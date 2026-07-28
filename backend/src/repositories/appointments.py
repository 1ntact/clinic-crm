from datetime import date, datetime, time, timedelta, timezone
from typing import Any

from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import aliased

from database.models.appointments import (
    AppointmentModel,
    AppointmentStatusEnum,
)
from database.models.doctors import DoctorModel
from database.models.patient import PatientModel
from database.models.users import UserModel
from schemas.appointments import (
    AppointmentCreate,
    AppointmentUpdate,
)


ACTIVE_APPOINTMENT_STATUSES = (
    AppointmentStatusEnum.SCHEDULED,
    AppointmentStatusEnum.CONFIRMED,
)


class AppointmentRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    @staticmethod
    def _serialize_appointment(
        appointment: AppointmentModel,
        patient_first_name: str | None,
        patient_last_name: str | None,
        patient_phone_number: str | None,
        doctor_first_name: str | None,
        doctor_last_name: str | None,
    ) -> dict[str, Any]:
        return {
            "id": appointment.id,
            "patient_id": appointment.patient_id,
            "doctor_id": appointment.doctor_id,
            "date_time": appointment.date_time,
            "duration": appointment.duration,
            "type_visit": appointment.type_visit,
            "status": appointment.status,
            "notes": appointment.notes,
            "created_at": appointment.created_at,
            "patient_first_name": patient_first_name,
            "patient_last_name": patient_last_name,
            "patient_phone_number": patient_phone_number,
            "doctor_first_name": doctor_first_name,
            "doctor_last_name": doctor_last_name,
        }

    def add(
        self,
        appointment_data: AppointmentCreate,
        date_time: datetime,
        duration: int,
    ) -> AppointmentModel:
        appointment = AppointmentModel(
            patient_id=appointment_data.patient_id,
            doctor_id=appointment_data.doctor_id,
            date_time=date_time,
            duration=duration,
            type_visit=appointment_data.type_visit,
            notes=appointment_data.notes,
            status=AppointmentStatusEnum.SCHEDULED,
        )

        self.session.add(appointment)

        return appointment

    async def get_by_id(
        self,
        appointment_id: int,
    ) -> AppointmentModel | None:
        statement = select(AppointmentModel).where(
            AppointmentModel.id == appointment_id,
        )

        result = await self.session.execute(statement)

        return result.scalar_one_or_none()

    async def get_details_by_id(
        self,
        appointment_id: int,
    ) -> dict[str, Any] | None:
        patient_user = aliased(UserModel)
        doctor_user = aliased(UserModel)

        statement = (
            select(
                AppointmentModel,
                patient_user.first_name,
                patient_user.last_name,
                patient_user.phone_number,
                doctor_user.first_name,
                doctor_user.last_name,
            )
            .join(
                PatientModel,
                AppointmentModel.patient_id == PatientModel.id,
            )
            .join(
                patient_user,
                PatientModel.user_id == patient_user.id,
            )
            .join(
                DoctorModel,
                AppointmentModel.doctor_id == DoctorModel.id,
            )
            .join(
                doctor_user,
                DoctorModel.user_id == doctor_user.id,
            )
            .where(
                AppointmentModel.id == appointment_id,
            )
        )

        result = await self.session.execute(statement)
        row = result.one_or_none()

        if row is None:
            return None

        return self._serialize_appointment(
            appointment=row[0],
            patient_first_name=row[1],
            patient_last_name=row[2],
            patient_phone_number=row[3],
            doctor_first_name=row[4],
            doctor_last_name=row[5],
        )

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
        patient_user = aliased(UserModel)
        doctor_user = aliased(UserModel)

        statement = (
            select(
                AppointmentModel,
                patient_user.first_name,
                patient_user.last_name,
                patient_user.phone_number,
                doctor_user.first_name,
                doctor_user.last_name,
            )
            .join(
                PatientModel,
                AppointmentModel.patient_id == PatientModel.id,
            )
            .join(
                patient_user,
                PatientModel.user_id == patient_user.id,
            )
            .join(
                DoctorModel,
                AppointmentModel.doctor_id == DoctorModel.id,
            )
            .join(
                doctor_user,
                DoctorModel.user_id == doctor_user.id,
            )
        )

        if doctor_id is not None:
            statement = statement.where(
                AppointmentModel.doctor_id == doctor_id,
            )

        if patient_id is not None:
            statement = statement.where(
                AppointmentModel.patient_id == patient_id,
            )

        if appointment_date is not None:
            day_start = datetime.combine(
                appointment_date,
                time.min,
                tzinfo=timezone.utc,
            )
            day_end = day_start + timedelta(days=1)

            statement = statement.where(
                AppointmentModel.date_time >= day_start,
                AppointmentModel.date_time < day_end,
            )

        if date_from is not None:
            start_datetime = datetime.combine(
                date_from,
                time.min,
                tzinfo=timezone.utc,
            )

            statement = statement.where(
                AppointmentModel.date_time >= start_datetime,
            )

        if date_to is not None:
            end_datetime = datetime.combine(
                date_to + timedelta(days=1),
                time.min,
                tzinfo=timezone.utc,
            )

            statement = statement.where(
                AppointmentModel.date_time < end_datetime,
            )

        if appointment_status is not None:
            statement = statement.where(
                AppointmentModel.status == appointment_status,
            )

        statement = (
            statement.order_by(
                AppointmentModel.date_time,
                AppointmentModel.id,
            )
            .offset(offset)
            .limit(limit)
        )

        result = await self.session.execute(statement)

        appointments: list[dict[str, Any]] = []

        for row in result.all():
            appointments.append(
                self._serialize_appointment(
                    appointment=row[0],
                    patient_first_name=row[1],
                    patient_last_name=row[2],
                    patient_phone_number=row[3],
                    doctor_first_name=row[4],
                    doctor_last_name=row[5],
                )
            )

        return appointments

    async def is_doctor_busy(
        self,
        doctor_id: int,
        date_time: datetime,
        duration: int = 30,
        exclude_appointment_id: int | None = None,
    ) -> bool:
        new_appointment_end = (
            date_time + timedelta(minutes=duration)
        )

        existing_appointment_end = (
            AppointmentModel.date_time
            + AppointmentModel.duration
            * text("INTERVAL '1 minute'")
        )

        statement = select(AppointmentModel.id).where(
            AppointmentModel.doctor_id == doctor_id,
            AppointmentModel.status.in_(
                ACTIVE_APPOINTMENT_STATUSES,
            ),
            AppointmentModel.date_time < new_appointment_end,
            existing_appointment_end > date_time,
        )

        if exclude_appointment_id is not None:
            statement = statement.where(
                AppointmentModel.id != exclude_appointment_id,
            )

        appointment_id = await self.session.scalar(statement)

        return appointment_id is not None

    def update(
        self,
        appointment: AppointmentModel,
        appointment_data: AppointmentUpdate,
    ) -> AppointmentModel:
        update_data = appointment_data.model_dump(
            exclude_unset=True,
        )

        for field, value in update_data.items():
            setattr(
                appointment,
                field,
                value,
            )

        return appointment

    def set_status(
        self,
        appointment: AppointmentModel,
        new_status: AppointmentStatusEnum,
    ) -> AppointmentModel:
        appointment.status = new_status

        return appointment

    async def delete(
        self,
        appointment: AppointmentModel,
    ) -> None:
        await self.session.delete(appointment)
