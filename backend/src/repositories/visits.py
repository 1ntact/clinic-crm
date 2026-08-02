from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from database.models.visits import VisitModel
from schemas.visits import VisitCreate, VisitUpdate


class VisitRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    def add(
        self,
        visit_data: VisitCreate,
        amount,
    ) -> VisitModel:
        visit = VisitModel(
            appointment_id=visit_data.appointment_id,
            treatment_add1=visit_data.treatment_add1,
            treatment_add2=visit_data.treatment_add2,
            diagnosis=visit_data.diagnosis,
            description=visit_data.description,
            recommendation=visit_data.recommendation,
            amount=amount,
        )

        self.session.add(visit)

        return visit

    async def get_by_id(
        self,
        visit_id: int,
    ) -> VisitModel | None:
        statement = (
            select(VisitModel)
            .options(
                joinedload(VisitModel.appointment),
                joinedload(VisitModel.additional_treatment_1),
                joinedload(VisitModel.additional_treatment_2),
            )
            .where(
                VisitModel.id == visit_id,
            )
        )

        return await self.session.scalar(statement)

    async def get_by_appointment_id(
        self,
        appointment_id: int,
    ) -> VisitModel | None:
        statement = select(VisitModel).where(
            VisitModel.appointment_id == appointment_id,
        )

        return await self.session.scalar(statement)

    def update(
        self,
        visit: VisitModel,
        visit_data: VisitUpdate,
        amount,
    ) -> VisitModel:
        update_data = visit_data.model_dump(
            exclude_unset=True,
        )

        for field, value in update_data.items():
            setattr(
                visit,
                field,
                value,
            )

        visit.amount = amount

        return visit

    async def get_by_appointment_id(
            self,
            appointment_id: int,
    ) -> VisitModel | None:
        statement = select(VisitModel).where(
            VisitModel.appointment_id == appointment_id,
        )

        return await self.session.scalar(statement)