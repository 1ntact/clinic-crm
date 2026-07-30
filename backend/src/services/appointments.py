from datetime import date, datetime, time, timedelta, timezone
from typing import Any
from calendar import monthrange
from collections import defaultdict
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from database.models.appointments import (
    AppointmentModel,
    AppointmentStatusEnum,
)
from repositories.appointments import AppointmentRepository
from repositories.doctors import DoctorRepository
from repositories.patients import PatientRepository
from schemas.appointments import (
    AppointmentCalendarResponse,
    AppointmentCreate,
    AppointmentDashboardResponse,
    AppointmentStatisticsResponse,
    AppointmentUpdate,
    AvailableSlotResponse,
    AvailableSlotsResponse,
)


WORKDAY_START = time(hour=8, minute=0)
WORKDAY_END = time(hour=18, minute=0)

SLOT_STEP_MINUTES = 30
DASHBOARD_SLOT_DURATION_MINUTES = 30

DASHBOARD_BLOCKING_STATUSES = (
    AppointmentStatusEnum.SCHEDULED,
    AppointmentStatusEnum.CONFIRMED,
)


class AppointmentService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

        self.appointments = AppointmentRepository(session)
        self.patients = PatientRepository(session)
        self.doctors = DoctorRepository(session)

    async def create(
        self,
        appointment_data: AppointmentCreate,
    ) -> dict[str, Any]:
        patient = await self.patients.get_by_id(
            appointment_data.patient_id,
        )

        if patient is None:
            raise ValueError("Patient not found.")

        doctor = await self.doctors.get_by_id(
            appointment_data.doctor_id,
        )

        if doctor is None:
            raise ValueError("Doctor not found.")

        appointment_date_time = datetime.combine(
            appointment_data.appointment_date,
            appointment_data.appointment_time,
            tzinfo=timezone.utc,
        )

        if appointment_date_time <= datetime.now(timezone.utc):
            raise ValueError(
                "Appointment date and time must be in the future."
            )

        doctor_busy = await self.appointments.is_doctor_busy(
            doctor_id=appointment_data.doctor_id,
            date_time=appointment_date_time,
            duration=appointment_data.duration,
        )

        if doctor_busy:
            raise ValueError(
                "Doctor already has an appointment during this time."
            )

        try:
            appointment = self.appointments.add(
                appointment_data=appointment_data,
                date_time=appointment_date_time,
                duration=appointment_data.duration,
            )

            await self.session.commit()
            await self.session.refresh(appointment)

        except SQLAlchemyError:
            await self.session.rollback()
            raise

        appointment_details = (
            await self.appointments.get_details_by_id(
                appointment.id,
            )
        )

        if appointment_details is None:
            raise ValueError("Appointment was not created.")

        return appointment_details

    async def get_all(
        self,
        doctor_id: int | None = None,
        patient_id: int | None = None,
        appointment_date: date | None = None,
        date_from: date | None = None,
        date_to: date | None = None,
        appointment_status: AppointmentStatusEnum | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[dict[str, Any]]:
        if (
            date_from is not None
            and date_to is not None
            and date_from > date_to
        ):
            raise ValueError(
                "date_from cannot be later than date_to."
            )

        if appointment_date is not None and (
            date_from is not None
            or date_to is not None
        ):
            raise ValueError(
                "Use either appointment_date or date_from/date_to, not both."
            )

        return await self.appointments.get_all(
            doctor_id=doctor_id,
            patient_id=patient_id,
            appointment_date=appointment_date,
            date_from=date_from,
            date_to=date_to,
            appointment_status=appointment_status,
            limit=limit,
            offset=offset,
        )

    async def get_by_id(
        self,
        appointment_id: int,
    ) -> dict[str, Any]:
        appointment = await self.appointments.get_details_by_id(
            appointment_id=appointment_id,
        )

        if appointment is None:
            raise ValueError("Appointment not found.")

        return appointment

    async def _get_model_by_id(
        self,
        appointment_id: int,
    ) -> AppointmentModel:
        appointment = await self.appointments.get_by_id(
            appointment_id=appointment_id,
        )

        if appointment is None:
            raise ValueError("Appointment not found.")

        return appointment

    async def _get_details_after_change(
        self,
        appointment_id: int,
    ) -> dict[str, Any]:
        appointment_details = (
            await self.appointments.get_details_by_id(
                appointment_id,
            )
        )

        if appointment_details is None:
            raise ValueError("Appointment not found.")

        return appointment_details

    async def update(
        self,
        appointment_id: int,
        appointment_data: AppointmentUpdate,
    ) -> dict[str, Any]:
        appointment = await self._get_model_by_id(
            appointment_id,
        )

        if appointment.status in {
            AppointmentStatusEnum.CANCELLED,
            AppointmentStatusEnum.COMPLETED,
            AppointmentStatusEnum.NO_SHOW,
        }:
            raise ValueError(
                "Cancelled, completed or no-show appointment "
                "cannot be updated."
            )

        update_data = appointment_data.model_dump(
            exclude_unset=True,
        )

        new_patient_id = update_data.get(
            "patient_id",
            appointment.patient_id,
        )

        new_doctor_id = update_data.get(
            "doctor_id",
            appointment.doctor_id,
        )

        new_date_time = update_data.get(
            "date_time",
            appointment.date_time,
        )

        if new_date_time <= datetime.now(timezone.utc):
            raise ValueError(
                "Appointment date and time must be in the future."
            )

        new_duration = update_data.get(
            "duration",
            appointment.duration,
        )

        patient = await self.patients.get_by_id(
            new_patient_id,
        )

        if patient is None:
            raise ValueError("Patient not found.")

        doctor = await self.doctors.get_by_id(
            new_doctor_id,
        )

        if doctor is None:
            raise ValueError("Doctor not found.")

        doctor_busy = await self.appointments.is_doctor_busy(
            doctor_id=new_doctor_id,
            date_time=new_date_time,
            duration=new_duration,
            exclude_appointment_id=appointment.id,
        )

        if doctor_busy:
            raise ValueError(
                "Doctor already has an appointment during this time."
            )

        try:
            self.appointments.update(
                appointment=appointment,
                appointment_data=appointment_data,
            )

            await self.session.commit()
            await self.session.refresh(appointment)

        except SQLAlchemyError:
            await self.session.rollback()
            raise

        return await self._get_details_after_change(
            appointment.id,
        )

    async def confirm(
        self,
        appointment_id: int,
    ) -> dict[str, Any]:
        appointment = await self._get_model_by_id(
            appointment_id,
        )

        if appointment.date_time <= datetime.now(timezone.utc):
            raise ValueError(
                "Past appointment cannot be confirmed."
            )

        if appointment.status != AppointmentStatusEnum.SCHEDULED:
            raise ValueError(
                "Only scheduled appointment can be confirmed."
            )

        try:
            self.appointments.set_status(
                appointment=appointment,
                new_status=AppointmentStatusEnum.CONFIRMED,
            )

            await self.session.commit()
            await self.session.refresh(appointment)

        except SQLAlchemyError:
            await self.session.rollback()
            raise

        return await self._get_details_after_change(
            appointment.id,
        )

    async def cancel(
        self,
        appointment_id: int,
    ) -> dict[str, Any]:
        appointment = await self._get_model_by_id(
            appointment_id,
        )

        if appointment.date_time <= datetime.now(timezone.utc):
            raise ValueError(
                "A past appointment cannot be cancelled."
            )

        if appointment.status not in {
            AppointmentStatusEnum.SCHEDULED,
            AppointmentStatusEnum.CONFIRMED,
        }:
            raise ValueError(
                "Only scheduled or confirmed appointment can be cancelled."
            )

        try:
            self.appointments.set_status(
                appointment=appointment,
                new_status=AppointmentStatusEnum.CANCELLED,
            )

            await self.session.commit()
            await self.session.refresh(appointment)

        except SQLAlchemyError:
            await self.session.rollback()
            raise

        return await self._get_details_after_change(
            appointment.id,
        )

    async def get_dashboard(
        self,
        year: int,
        month: int,
    ) -> AppointmentDashboardResponse:
        if month < 1 or month > 12:
            raise ValueError(
                "Month must be between 1 and 12."
            )

        days_in_month = monthrange(
            year,
            month,
        )[1]

        doctor_ids = await self.doctors.get_active_ids()

        month_appointments = (
            await self.appointments.get_for_month(
                year=year,
                month=month,
            )
        )

        appointments_by_doctor_and_date: dict[
            tuple[int, date],
            list[AppointmentModel],
        ] = defaultdict(list)

        for appointment in month_appointments:
            appointment_date = appointment.date_time.date()

            appointments_by_doctor_and_date[
                (
                    appointment.doctor_id,
                    appointment_date,
                )
            ].append(appointment)

        available_days: list[int] = []
        fully_booked_days: list[int] = []

        if doctor_ids:
            for day_number in range(
                1,
                days_in_month + 1,
            ):
                selected_date = date(
                    year,
                    month,
                    day_number,
                )

                if selected_date.weekday() >= 5:
                    continue

                day_has_free_slot = False

                for doctor_id in doctor_ids:
                    doctor_appointments = (
                        appointments_by_doctor_and_date.get(
                            (
                                doctor_id,
                                selected_date,
                            ),
                            [],
                        )
                    )

                    doctor_has_free_slot = (
                        self._doctor_has_free_slot(
                            selected_date=selected_date,
                            appointments=doctor_appointments,
                        )
                    )

                    if doctor_has_free_slot:
                        day_has_free_slot = True
                        break

                if day_has_free_slot:
                    available_days.append(day_number)
                else:
                    fully_booked_days.append(day_number)

        now = datetime.now(timezone.utc)

        statistics = (
            await self.appointments.get_dashboard_statistics(
                now=now,
            )
        )

        return AppointmentDashboardResponse(
            calendar=AppointmentCalendarResponse(
                year=year,
                month=month,
                days_in_month=days_in_month,
                available_days=available_days,
                fully_booked_days=fully_booked_days,
            ),
            statistics=AppointmentStatisticsResponse(
                today_appointments=statistics[
                    "today_appointments"
                ],
                upcoming_appointments=statistics[
                    "upcoming_appointments"
                ],
                completed_today=statistics[
                    "completed_today"
                ],
                cancelled_today=statistics[
                    "cancelled_today"
                ],
            ),
        )

    async def complete(
        self,
        appointment_id: int,
    ) -> dict[str, Any]:
        appointment = await self._get_model_by_id(
            appointment_id,
        )

        if appointment.status not in {
            AppointmentStatusEnum.SCHEDULED,
            AppointmentStatusEnum.CONFIRMED,
        }:
            raise ValueError(
                "Only scheduled or confirmed appointment "
                "can be completed."
            )

        if appointment.date_time > datetime.now(timezone.utc):
            raise ValueError(
                "A future appointment cannot be completed."
            )

        try:
            self.appointments.set_status(
                appointment=appointment,
                new_status=AppointmentStatusEnum.COMPLETED,
            )

            await self.session.commit()
            await self.session.refresh(appointment)

        except SQLAlchemyError:
            await self.session.rollback()
            raise

        return await self._get_details_after_change(
            appointment.id,
        )

    async def mark_no_show(
        self,
        appointment_id: int,
    ) -> dict[str, Any]:
        appointment = await self._get_model_by_id(
            appointment_id,
        )

        if appointment.status not in {
            AppointmentStatusEnum.SCHEDULED,
            AppointmentStatusEnum.CONFIRMED,
        }:
            raise ValueError(
                "Only scheduled or confirmed appointment "
                "can be marked as no-show."
            )

        if appointment.date_time > datetime.now(timezone.utc):
            raise ValueError(
                "A future appointment cannot be marked as no-show."
            )

        try:
            self.appointments.set_status(
                appointment=appointment,
                new_status=AppointmentStatusEnum.NO_SHOW,
            )

            await self.session.commit()
            await self.session.refresh(appointment)

        except SQLAlchemyError:
            await self.session.rollback()
            raise

        return await self._get_details_after_change(
            appointment.id,
        )

    @staticmethod
    def _doctor_has_free_slot(
        selected_date: date,
        appointments: list[AppointmentModel],
    ) -> bool:
        workday_start = datetime.combine(
            selected_date,
            WORKDAY_START,
            tzinfo=timezone.utc,
        )

        workday_end = datetime.combine(
            selected_date,
            WORKDAY_END,
            tzinfo=timezone.utc,
        )

        slot_step = timedelta(
            minutes=SLOT_STEP_MINUTES,
        )

        slot_duration = timedelta(
            minutes=DASHBOARD_SLOT_DURATION_MINUTES,
        )

        current_slot_start = workday_start

        while current_slot_start + slot_duration <= workday_end:
            current_slot_end = current_slot_start + slot_duration

            slot_is_booked = False

            for appointment in appointments:
                if appointment.status not in DASHBOARD_BLOCKING_STATUSES:
                    continue

                appointment_start = appointment.date_time

                appointment_end = (
                    appointment_start
                    + timedelta(minutes=appointment.duration)
                )

                has_overlap = (
                    current_slot_start < appointment_end
                    and current_slot_end > appointment_start
                )

                if has_overlap:
                    slot_is_booked = True
                    break

            if not slot_is_booked:
                return True

            current_slot_start += slot_step

        return False

    async def get_available_slots(
        self,
        selected_date: date,
        doctor_id: int,
        duration: int,
    ) -> AvailableSlotsResponse:
        doctor = await self.doctors.get_by_id(
            doctor_id,
        )

        if doctor is None:
            raise ValueError("Doctor not found.")

        if duration < 30:
            raise ValueError(
                "Appointment duration must be at least 30 minutes."
            )

        if duration > 180:
            raise ValueError(
                "Appointment duration cannot exceed 180 minutes."
            )

        appointments = (
            await self.appointments.get_doctor_appointments_by_date(
                doctor_id=doctor_id,
                selected_date=selected_date,
            )
        )

        workday_start = datetime.combine(
            selected_date,
            time(hour=8, minute=0),
            tzinfo=timezone.utc,
        )

        workday_end = datetime.combine(
            selected_date,
            time(hour=18, minute=0),
            tzinfo=timezone.utc,
        )

        slot_step = timedelta(minutes=30)
        requested_duration = timedelta(minutes=duration)

        slots: list[AvailableSlotResponse] = []

        current_slot_start = workday_start

        while current_slot_start + requested_duration <= workday_end:
            current_slot_end = (
                current_slot_start + requested_duration
            )

            is_booked = False

            for appointment in appointments:
                appointment_start = appointment.date_time

                appointment_end = (
                    appointment_start
                    + timedelta(minutes=appointment.duration)
                )

                has_overlap = (
                    current_slot_start < appointment_end
                    and current_slot_end > appointment_start
                )

                if has_overlap:
                    is_booked = True
                    break

            slots.append(
                AvailableSlotResponse(
                    time=current_slot_start.time().replace(
                        tzinfo=None,
                    ),
                    status="booked" if is_booked else "free",
                )
            )

            current_slot_start += slot_step

        available_count = sum(
            slot.status == "free"
            for slot in slots
        )

        return AvailableSlotsResponse(
            date=selected_date,
            doctor_id=doctor_id,
            duration=duration,
            available_count=available_count,
            booked_count=len(appointments),
            slots=slots,
        )
