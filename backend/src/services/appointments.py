from datetime import date, datetime, timezone
from typing import Any

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
    AppointmentCreate,
    AppointmentUpdate,
)


DEFAULT_APPOINTMENT_DURATION = 30


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
            duration=DEFAULT_APPOINTMENT_DURATION,
        )

        if doctor_busy:
            raise ValueError(
                "Doctor already has an appointment during this time."
            )

        try:
            appointment = self.appointments.add(
                appointment_data=appointment_data,
                date_time=appointment_date_time,
                duration=DEFAULT_APPOINTMENT_DURATION,
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
