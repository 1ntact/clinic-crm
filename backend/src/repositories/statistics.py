from datetime import datetime

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from database.models.patient import PatientModel
from database.models.users import UserModel
from database.models.appointments import (
    AppointmentModel,
    AppointmentStatusEnum,
)
from database.models.treatments import TreatmentModel


class StatisticsRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_total_patients(self) -> int:
        query = select(func.count(PatientModel.id))

        result = await self.db.execute(query)

        return result.scalar_one()

    async def get_new_patients_count(
        self,
        start_date: datetime,
        end_date: datetime,
    ) -> int:
        query = (
            select(func.count(PatientModel.id))
            .join(
                UserModel,
                PatientModel.user_id == UserModel.id,
            )
            .where(
                UserModel.registration_date >= start_date,
                UserModel.registration_date < end_date,
            )
        )

        result = await self.db.execute(query)

        return result.scalar_one()

    async def get_appointments_count(
            self,
            start_date: datetime,
            end_date: datetime,
    ) -> int:
        query = (
            select(func.count(AppointmentModel.id))
            .where(
                AppointmentModel.date_time >= start_date,
                AppointmentModel.date_time < end_date,
            )
        )

        result = await self.db.execute(query)

        return result.scalar_one()

    async def get_revenue(
            self,
            start_date: datetime,
            end_date: datetime,
    ) -> float:
        query = (
            select(
                func.coalesce(
                    func.sum(TreatmentModel.price),
                    0,
                )
            )
            .join(
                AppointmentModel,
                AppointmentModel.treatment_id == TreatmentModel.id,
            )
            .where(
                AppointmentModel.date_time >= start_date,
                AppointmentModel.date_time < end_date,
                AppointmentModel.status == AppointmentStatusEnum.COMPLETED,
            )
        )

        result = await self.db.execute(query)

        return float(result.scalar_one())

    async def get_appointments_count_by_status(
            self,
            start_date: datetime,
            end_date: datetime,
            status: AppointmentStatusEnum,
    ) -> int:
        query = (
            select(func.count(AppointmentModel.id))
            .where(
                AppointmentModel.date_time >= start_date,
                AppointmentModel.date_time < end_date,
                AppointmentModel.status == status,
            )
        )

        result = await self.db.execute(query)

        return result.scalar_one()

    async def get_repeated_patients_count(
            self,
            start_date: datetime,
            end_date: datetime,
    ) -> int:
        previous_completed_appointment = (
            select(AppointmentModel.id)
            .where(
                AppointmentModel.patient_id == PatientModel.id,
                AppointmentModel.status == AppointmentStatusEnum.COMPLETED,
                AppointmentModel.date_time < start_date,
            )
            .exists()
        )

        query = (
            select(
                func.count(
                    func.distinct(AppointmentModel.patient_id),
                )
            )
            .join(
                PatientModel,
                AppointmentModel.patient_id == PatientModel.id,
            )
            .where(
                AppointmentModel.date_time >= start_date,
                AppointmentModel.date_time < end_date,
                previous_completed_appointment,
            )
        )

        result = await self.db.execute(query)

        return result.scalar_one()

    async def get_revenue_by_day(
            self,
            start_date: datetime,
            end_date: datetime,
    ) -> list[tuple[datetime, float]]:
        query = (
            select(
                func.date_trunc(
                    "day",
                    AppointmentModel.date_time,
                ).label("day"),
                func.coalesce(
                    func.sum(TreatmentModel.price),
                    0,
                ).label("revenue"),
            )
            .join(
                TreatmentModel,
                AppointmentModel.treatment_id == TreatmentModel.id,
            )
            .where(
                AppointmentModel.date_time >= start_date,
                AppointmentModel.date_time < end_date,
                AppointmentModel.status == AppointmentStatusEnum.COMPLETED,
            )
            .group_by("day")
            .order_by("day")
        )

        result = await self.db.execute(query)

        return [
            (
                row.day,
                float(row.revenue),
            )
            for row in result.all()
        ]
