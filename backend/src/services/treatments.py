from sqlalchemy.ext.asyncio import AsyncSession

from repositories.treatments import TreatmentRepository
from schemas.treatments import TreatmentResponse


class TreatmentService:
    def __init__(self, session: AsyncSession) -> None:
        self.treatments = TreatmentRepository(session)

    async def get_all(
        self,
        is_main: bool | None = None,
    ) -> list[TreatmentResponse]:
        treatments = await self.treatments.get_all(
            is_main=is_main,
        )

        return [TreatmentResponse.model_validate(treatment) for treatment in treatments]
