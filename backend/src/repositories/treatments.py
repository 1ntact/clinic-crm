from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database.models.treatments import TreatmentModel


class TreatmentRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(
        self,
        treatment_id: int,
    ) -> TreatmentModel | None:
        statement = select(TreatmentModel).where(
            TreatmentModel.id == treatment_id,
        )

        return await self.session.scalar(statement)

    async def get_all(
        self,
        is_main: bool | None = None,
    ) -> list[TreatmentModel]:
        statement = select(TreatmentModel)

        if is_main is not None:
            statement = statement.where(
                TreatmentModel.is_main == is_main,
            )

        statement = statement.order_by(
            TreatmentModel.treatment,
        )

        result = await self.session.scalars(statement)

        return list(result.all())
