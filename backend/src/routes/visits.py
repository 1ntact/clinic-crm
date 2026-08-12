from typing import NoReturn

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Path,
    status,
)
from sqlalchemy.ext.asyncio import AsyncSession

from database.session_postgresql import get_postgresql_db
from schemas.visits import (
    VisitCreate,
    VisitResponse,
    VisitUpdate,
)
from security.permissions import DoctorAdminOrSuperAdminDep
from services.visits import VisitService

router = APIRouter(
    tags=["visits"],
)


def raise_http_error(error: ValueError) -> NoReturn:
    message = str(error)

    not_found_messages = {
        "Visit not found.",
        "Visit not found for this appointment.",
        "Appointment not found.",
        "Main appointment treatment not found.",
        "Additional treatment not found.",
    }

    if message in not_found_messages:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=message,
        ) from error

    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=message,
    ) from error


@router.post(
    "/",
    response_model=VisitResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_visit(
    visit_data: VisitCreate,
    current_user: DoctorAdminOrSuperAdminDep,
    db: AsyncSession = Depends(get_postgresql_db),
) -> VisitResponse:
    service = VisitService(db)

    try:
        return await service.create(
            visit_data=visit_data,
        )
    except ValueError as error:
        raise_http_error(error)


@router.get(
    "/by-appointment/{appointment_id}/",
    response_model=VisitResponse,
    status_code=status.HTTP_200_OK,
)
async def get_visit_by_appointment(
    current_user: DoctorAdminOrSuperAdminDep,
    appointment_id: int = Path(
        gt=0,
    ),
    db: AsyncSession = Depends(get_postgresql_db),
) -> VisitResponse:
    service = VisitService(db)

    try:
        return await service.get_by_appointment_id(
            appointment_id=appointment_id,
        )
    except ValueError as error:
        raise_http_error(error)


@router.get(
    "/{visit_id}/",
    response_model=VisitResponse,
    status_code=status.HTTP_200_OK,
)
async def get_visit(
    current_user: DoctorAdminOrSuperAdminDep,
    visit_id: int = Path(
        gt=0,
    ),
    db: AsyncSession = Depends(get_postgresql_db),
) -> VisitResponse:
    service = VisitService(db)

    try:
        return await service.get_by_id(
            visit_id=visit_id,
        )
    except ValueError as error:
        raise_http_error(error)


@router.patch(
    "/{visit_id}/",
    response_model=VisitResponse,
    status_code=status.HTTP_200_OK,
)
async def update_visit(
    visit_data: VisitUpdate,
    current_user: DoctorAdminOrSuperAdminDep,
    visit_id: int = Path(
        gt=0,
    ),
    db: AsyncSession = Depends(get_postgresql_db),
) -> VisitResponse:
    service = VisitService(db)

    try:
        return await service.update(
            visit_id=visit_id,
            visit_data=visit_data,
        )
    except ValueError as error:
        raise_http_error(error)
