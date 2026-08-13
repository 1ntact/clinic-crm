from datetime import date, datetime, timezone
from typing import NoReturn

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Path,
    Query,
    status,
)
from sqlalchemy.ext.asyncio import AsyncSession

from database.models.appointments import AppointmentStatusEnum
from database.session_postgresql import get_postgresql_db
from schemas.appointments import (
    AppointmentCreate,
    AppointmentDashboardResponse,
    AppointmentResponse,
    AppointmentStatusUpdate,
    AppointmentUpdate,
    AvailableSlotsResponse,
    PaginatedAppointmentResponse,
)
from security.permissions import DoctorAdminOrSuperAdminDep
from services.appointments import AppointmentService

router = APIRouter(
    tags=["appointments"],
)


def raise_http_error(error: ValueError) -> NoReturn:
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
    current_user: DoctorAdminOrSuperAdminDep,
    db: AsyncSession = Depends(get_postgresql_db),
) -> AppointmentResponse:
    service = AppointmentService(db)

    try:
        return await service.create(
            appointment_data=appointment_data,
        )
    except ValueError as error:
        raise_http_error(error)


@router.get(
    "/",
    response_model=PaginatedAppointmentResponse,
)
async def get_appointments(
    current_user: DoctorAdminOrSuperAdminDep,
    doctor_id: int | None = Query(
        default=None,
        gt=0,
    ),
    patient_id: int | None = Query(
        default=None,
        gt=0,
    ),
    search: str | None = Query(
        default=None,
    ),
    appointment_date: date | None = Query(
        default=None,
    ),
    date_from: date | None = Query(
        default=None,
    ),
    date_to: date | None = Query(
        default=None,
    ),
    appointment_status: AppointmentStatusEnum | None = Query(
        default=None,
    ),
    page: int = Query(
        default=1,
        ge=1,
    ),
    page_size: int = Query(
        default=20,
        ge=1,
        le=100,
    ),
    db: AsyncSession = Depends(get_postgresql_db),
) -> PaginatedAppointmentResponse:
    service = AppointmentService(db)

    try:
        return await service.get_all(
            doctor_id=doctor_id,
            patient_id=patient_id,
            search=search,
            appointment_date=appointment_date,
            date_from=date_from,
            date_to=date_to,
            appointment_status=appointment_status,
            page=page,
            page_size=page_size,
        )
    except ValueError as error:
        raise_http_error(error)


@router.get(
    "/available-slots/",
    response_model=AvailableSlotsResponse,
)
async def get_available_slots(
    current_user: DoctorAdminOrSuperAdminDep,
    selected_date: date = Query(
        alias="date",
    ),
    doctor_id: int = Query(
        gt=0,
    ),
    duration: int = Query(
        default=30,
        ge=30,
        le=180,
    ),
    db: AsyncSession = Depends(get_postgresql_db),
) -> AvailableSlotsResponse:
    service = AppointmentService(db)

    try:
        return await service.get_available_slots(
            selected_date=selected_date,
            doctor_id=doctor_id,
            duration=duration,
        )
    except ValueError as error:
        raise_http_error(error)


@router.get(
    "/dashboard/",
    response_model=AppointmentDashboardResponse,
    status_code=status.HTTP_200_OK,
)
async def get_appointments_dashboard(
    current_user: DoctorAdminOrSuperAdminDep,
    year: int | None = Query(
        default=None,
        ge=2000,
        le=2100,
    ),
    month: int | None = Query(
        default=None,
        ge=1,
        le=12,
    ),
    db: AsyncSession = Depends(get_postgresql_db),
) -> AppointmentDashboardResponse:
    now = datetime.now(timezone.utc)

    selected_year = year if year is not None else now.year
    selected_month = month if month is not None else now.month

    service = AppointmentService(db)

    try:
        return await service.get_dashboard(
            year=selected_year,
            month=selected_month,
        )
    except ValueError as error:
        raise_http_error(error)


@router.get(
    "/{appointment_id}/",
    response_model=AppointmentResponse,
)
async def get_appointment(
    current_user: DoctorAdminOrSuperAdminDep,
    appointment_id: int = Path(
        gt=0,
    ),
    db: AsyncSession = Depends(get_postgresql_db),
) -> AppointmentResponse:
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
    appointment_data: AppointmentUpdate,
    current_user: DoctorAdminOrSuperAdminDep,
    appointment_id: int = Path(
        gt=0,
    ),
    db: AsyncSession = Depends(get_postgresql_db),
) -> AppointmentResponse:
    service = AppointmentService(db)

    try:
        return await service.update(
            appointment_id=appointment_id,
            appointment_data=appointment_data,
        )
    except ValueError as error:
        raise_http_error(error)


@router.patch(
    "/{appointment_id}/status/",
    response_model=AppointmentResponse,
)
async def update_appointment_status(
    status_data: AppointmentStatusUpdate,
    current_user: DoctorAdminOrSuperAdminDep,
    appointment_id: int = Path(
        gt=0,
    ),
    db: AsyncSession = Depends(get_postgresql_db),
) -> AppointmentResponse:
    service = AppointmentService(db)

    try:
        return await service.update(
            appointment_id=appointment_id,
            appointment_data=AppointmentUpdate(
                status=status_data.status,
            ),
        )
    except ValueError as error:
        raise_http_error(error)
