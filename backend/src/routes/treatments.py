from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from database.session_postgresql import get_postgresql_db
from schemas.treatments import TreatmentResponse
from services.treatments import TreatmentService


router = APIRouter(
    tags=["treatments"],
)


@router.get(
    "/",
    response_model=list[TreatmentResponse],
    status_code=status.HTTP_200_OK,
)
async def get_treatments(
    is_main: bool | None = Query(
        default=None,
        description=(
            "true — main treatments for appointments; "
            "false — additional treatments for visits"
        ),
    ),
    db: AsyncSession = Depends(get_postgresql_db),
) -> list[TreatmentResponse]:
    service = TreatmentService(db)

    return await service.get_all(
        is_main=is_main,
    )
