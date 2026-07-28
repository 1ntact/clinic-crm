from datetime import date

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)
from sqlalchemy.ext.asyncio import AsyncSession

from database.models.appointments import AppointmentStatusEnum
from database.session_postgresql import get_postgresql_db
from schemas.appointments import (
    AppointmentCreate,
    AppointmentResponse,
    AppointmentUpdate,
)
from services.appointments import AppointmentService


router = APIRouter(
    tags=["appointments"],
)


def raise_http_error(error: ValueError) -> None:
    message = str(error)

    not_found_messages = {
        "Appointment not found.",
        "Patient not found.",
        "Doctor not found.",
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
    response_model=AppointmentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_appointment(
    appointment_data: AppointmentCreate,
    db: AsyncSession = Depends(get_postgresql_db),
):
    service = AppointmentService(db)

    try:
        return await service.create(
            appointment_data=appointment_data,
        )
    except ValueError as error:
        raise_http_error(error)


@router.get(
    "/",
    response_model=list[AppointmentResponse],
)
async def get_appointments(
    doctor_id: int | None = None,
    patient_id: int | None = None,
    appointment_date: date | None = None,
    date_from: date | None = None,
    date_to: date | None = None,
    appointment_status: AppointmentStatusEnum | None = None,
    limit: int = Query(
        default=100,
        ge=1,
        le=100,
    ),
    offset: int = Query(
        default=0,
        ge=0,
    ),
    db: AsyncSession = Depends(get_postgresql_db),
):
    service = AppointmentService(db)

    try:
        return await service.get_all(
            doctor_id=doctor_id,
            patient_id=patient_id,
            appointment_date=appointment_date,
            date_from=date_from,
            date_to=date_to,
            appointment_status=appointment_status,
            limit=limit,
            offset=offset,
        )
    except ValueError as error:
        raise_http_error(error)


@router.get(
    "/{appointment_id}/",
    response_model=AppointmentResponse,
)
async def get_appointment(
    appointment_id: int,
    db: AsyncSession = Depends(get_postgresql_db),
):
    service = AppointmentService(db)

    try:
        return await service.get_by_id(
            appointment_id=appointment_id,
        )
    except ValueError as error:
        raise_http_error(error)


@router.patch(
    "/{appointment_id}/",
    response_model=AppointmentResponse,
)
async def update_appointment(
    appointment_id: int,
    appointment_data: AppointmentUpdate,
    db: AsyncSession = Depends(get_postgresql_db),
):
    service = AppointmentService(db)

    try:
        return await service.update(
            appointment_id=appointment_id,
            appointment_data=appointment_data,
        )
    except ValueError as error:
        raise_http_error(error)


@router.patch(
    "/{appointment_id}/confirm/",
    response_model=AppointmentResponse,
)
async def confirm_appointment(
    appointment_id: int,
    db: AsyncSession = Depends(get_postgresql_db),
):
    service = AppointmentService(db)

    try:
        return await service.confirm(
            appointment_id=appointment_id,
        )
    except ValueError as error:
        raise_http_error(error)


@router.patch(
    "/{appointment_id}/cancel/",
    response_model=AppointmentResponse,
)
async def cancel_appointment(
    appointment_id: int,
    db: AsyncSession = Depends(get_postgresql_db),
):
    service = AppointmentService(db)

    try:
        return await service.cancel(
            appointment_id=appointment_id,
        )
    except ValueError as error:
        raise_http_error(error)


@router.patch(
    "/{appointment_id}/complete/",
    response_model=AppointmentResponse,
)
async def complete_appointment(
    appointment_id: int,
    db: AsyncSession = Depends(get_postgresql_db),
):
    service = AppointmentService(db)

    try:
        return await service.complete(
            appointment_id=appointment_id,
        )
    except ValueError as error:
        raise_http_error(error)


@router.patch(
    "/{appointment_id}/no-show/",
    response_model=AppointmentResponse,
)
async def mark_appointment_no_show(
    appointment_id: int,
    db: AsyncSession = Depends(get_postgresql_db),
):
    service = AppointmentService(db)

    try:
        return await service.mark_no_show(
            appointment_id=appointment_id,
        )
    except ValueError as error:
        raise_http_error(error)


