from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database.session_postgresql import get_postgresql_db
from repositories.statistics import StatisticsRepository
from schemas.statistics import (
    AppointmentOutcomesResponse,
    RevenueChartResponse,
    StatisticCardResponse,
)
from security.permissions import DoctorAdminOrSuperAdminDep
from services.statistics import StatisticsService


router = APIRouter(
    tags=["statistics"],
)


@router.get(
    "/patients",
    response_model=StatisticCardResponse,
)
async def get_patients_statistics(
    current_user: DoctorAdminOrSuperAdminDep,
    db: AsyncSession = Depends(get_postgresql_db),
) -> StatisticCardResponse:
    repository = StatisticsRepository(db)
    service = StatisticsService(repository)

    return await service.get_patients_statistics()

@router.get(
    "/appointments",
    response_model=StatisticCardResponse,
)
async def get_daily_appointments_statistics(
    current_user: DoctorAdminOrSuperAdminDep,
    db: AsyncSession = Depends(get_postgresql_db),
) -> StatisticCardResponse:
    repository = StatisticsRepository(db)
    service = StatisticsService(repository)

    return await service.get_daily_appointments_statistics()

@router.get(
    "/daily-revenue",
    response_model=StatisticCardResponse,
)
async def get_daily_revenue_statistics(
    current_user: DoctorAdminOrSuperAdminDep,
    db: AsyncSession = Depends(get_postgresql_db),
) -> StatisticCardResponse:
    repository = StatisticsRepository(db)
    service = StatisticsService(repository)

    return await service.get_daily_revenue_statistics()

@router.get(
    "/monthly-revenue",
    response_model=StatisticCardResponse,
)
async def get_monthly_revenue_statistics(
    current_user: DoctorAdminOrSuperAdminDep,
    db: AsyncSession = Depends(get_postgresql_db),
) -> StatisticCardResponse:
    repository = StatisticsRepository(db)
    service = StatisticsService(repository)

    return await service.get_monthly_revenue_statistics()

@router.get(
    "/appointment-outcomes",
    response_model=AppointmentOutcomesResponse,
)
async def get_appointment_outcomes(
    current_user: DoctorAdminOrSuperAdminDep,
    db: AsyncSession = Depends(get_postgresql_db),
) -> AppointmentOutcomesResponse:
    repository = StatisticsRepository(db)
    service = StatisticsService(repository)

    return await service.get_appointment_outcomes()

@router.get(
    "/revenue-chart",
    response_model=RevenueChartResponse,
)
async def get_revenue_chart(
    current_user: DoctorAdminOrSuperAdminDep,
    db: AsyncSession = Depends(get_postgresql_db),
) -> RevenueChartResponse:
    repository = StatisticsRepository(db)
    service = StatisticsService(repository)

    return await service.get_weekly_revenue_chart()
