from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo
from database.models.appointments import AppointmentStatusEnum
from repositories.statistics import StatisticsRepository
from schemas.statistics import (
    AppointmentOutcomesResponse,
    RevenueChartResponse,
    RevenueDayResponse,
    StatisticCardResponse,
)


CLINIC_TIMEZONE = ZoneInfo("Europe/Kyiv")


class StatisticsService:
    def __init__(self, repository: StatisticsRepository) -> None:
        self.repository = repository

    async def get_patients_statistics(self) -> StatisticCardResponse:
        now_local = datetime.now(CLINIC_TIMEZONE)

        today_start_local = datetime(
            year=now_local.year,
            month=now_local.month,
            day=now_local.day,
            tzinfo=CLINIC_TIMEZONE,
        )
        tomorrow_start_local = today_start_local + timedelta(days=1)

        current_month_start_local = datetime(
            year=now_local.year,
            month=now_local.month,
            day=1,
            tzinfo=CLINIC_TIMEZONE,
        )

        if now_local.month == 1:
            previous_month_start_local = datetime(
                year=now_local.year - 1,
                month=12,
                day=1,
                tzinfo=CLINIC_TIMEZONE,
            )
        else:
            previous_month_start_local = datetime(
                year=now_local.year,
                month=now_local.month - 1,
                day=1,
                tzinfo=CLINIC_TIMEZONE,
            )

        current_month_start = current_month_start_local.astimezone(timezone.utc)
        previous_month_start = previous_month_start_local.astimezone(timezone.utc)
        tomorrow_start = tomorrow_start_local.astimezone(timezone.utc)

        total = await self.repository.get_total_patients()

        current_month_count = await self.repository.get_new_patients_count(
            start_date=current_month_start,
            end_date=tomorrow_start,
        )

        previous_month_count = await self.repository.get_new_patients_count(
            start_date=previous_month_start,
            end_date=current_month_start,
        )

        change = None

        if previous_month_count > 0:
            change = round(
                (
                    (current_month_count - previous_month_count)
                    / previous_month_count
                )
                * 100,
                1,
            )

        return StatisticCardResponse(
            total=total,
            change=change,
        )

    async def get_daily_appointments_statistics(
        self,
    ) -> StatisticCardResponse:
        now_local = datetime.now(CLINIC_TIMEZONE)

        today_start_local = datetime(
            year=now_local.year,
            month=now_local.month,
            day=now_local.day,
            tzinfo=CLINIC_TIMEZONE,
        )

        tomorrow_start_local = today_start_local + timedelta(days=1)

        current_month_start_local = datetime(
            year=now_local.year,
            month=now_local.month,
            day=1,
            tzinfo=CLINIC_TIMEZONE,
        )

        if now_local.month == 1:
            previous_month_start_local = datetime(
                year=now_local.year - 1,
                month=12,
                day=1,
                tzinfo=CLINIC_TIMEZONE,
            )
        else:
            previous_month_start_local = datetime(
                year=now_local.year,
                month=now_local.month - 1,
                day=1,
                tzinfo=CLINIC_TIMEZONE,
            )

        today_start = today_start_local.astimezone(timezone.utc)
        tomorrow_start = tomorrow_start_local.astimezone(timezone.utc)
        current_month_start = current_month_start_local.astimezone(timezone.utc)
        previous_month_start = previous_month_start_local.astimezone(timezone.utc)

        total = await self.repository.get_appointments_count(
            start_date=today_start,
            end_date=tomorrow_start,
        )

        current_month_count = await self.repository.get_appointments_count(
            start_date=current_month_start,
            end_date=tomorrow_start,
        )

        previous_month_count = await self.repository.get_appointments_count(
            start_date=previous_month_start,
            end_date=current_month_start,
        )

        change = None

        if previous_month_count > 0:
            change = round(
                (
                    (current_month_count - previous_month_count)
                    / previous_month_count
                )
                * 100,
                1,
            )

        return StatisticCardResponse(
            total=total,
            change=change,
        )

    async def get_daily_revenue_statistics(
            self,
    ) -> StatisticCardResponse:
        now_local = datetime.now(CLINIC_TIMEZONE)

        today_start_local = datetime(
            year=now_local.year,
            month=now_local.month,
            day=now_local.day,
            tzinfo=CLINIC_TIMEZONE,
        )

        tomorrow_start_local = today_start_local + timedelta(days=1)

        current_month_start_local = datetime(
            year=now_local.year,
            month=now_local.month,
            day=1,
            tzinfo=CLINIC_TIMEZONE,
        )

        if now_local.month == 1:
            previous_month_start_local = datetime(
                year=now_local.year - 1,
                month=12,
                day=1,
                tzinfo=CLINIC_TIMEZONE,
            )
        else:
            previous_month_start_local = datetime(
                year=now_local.year,
                month=now_local.month - 1,
                day=1,
                tzinfo=CLINIC_TIMEZONE,
            )

        today_start = today_start_local.astimezone(timezone.utc)
        tomorrow_start = tomorrow_start_local.astimezone(timezone.utc)
        current_month_start = current_month_start_local.astimezone(timezone.utc)
        previous_month_start = previous_month_start_local.astimezone(timezone.utc)

        total = await self.repository.get_revenue(
            start_date=today_start,
            end_date=tomorrow_start,
        )

        current_month_revenue = await self.repository.get_revenue(
            start_date=current_month_start,
            end_date=tomorrow_start,
        )

        previous_month_revenue = await self.repository.get_revenue(
            start_date=previous_month_start,
            end_date=current_month_start,
        )

        change = None

        if previous_month_revenue > 0:
            change = round(
                (
                        (current_month_revenue - previous_month_revenue)
                        / previous_month_revenue
                )
                * 100,
                1,
            )

        return StatisticCardResponse(
            total=total,
            change=change,
        )

    def _get_period_boundaries(self) -> dict[str, datetime]:
        now_local = datetime.now(CLINIC_TIMEZONE)

        today_start_local = datetime(
            year=now_local.year,
            month=now_local.month,
            day=now_local.day,
            tzinfo=CLINIC_TIMEZONE,
        )

        tomorrow_start_local = today_start_local + timedelta(days=1)

        current_month_start_local = datetime(
            year=now_local.year,
            month=now_local.month,
            day=1,
            tzinfo=CLINIC_TIMEZONE,
        )

        if now_local.month == 1:
            previous_month_start_local = datetime(
                year=now_local.year - 1,
                month=12,
                day=1,
                tzinfo=CLINIC_TIMEZONE,
            )
        else:
            previous_month_start_local = datetime(
                year=now_local.year,
                month=now_local.month - 1,
                day=1,
                tzinfo=CLINIC_TIMEZONE,
            )

        return {
            "today_start": today_start_local.astimezone(timezone.utc),
            "tomorrow_start": tomorrow_start_local.astimezone(timezone.utc),
            "current_month_start": current_month_start_local.astimezone(timezone.utc),
            "previous_month_start": previous_month_start_local.astimezone(timezone.utc),
        }

    async def get_monthly_revenue_statistics(
            self,
    ) -> StatisticCardResponse:
        periods = self._get_period_boundaries()

        current_month_revenue = await self.repository.get_revenue(
            start_date=periods["current_month_start"],
            end_date=periods["tomorrow_start"],
        )

        previous_month_revenue = await self.repository.get_revenue(
            start_date=periods["previous_month_start"],
            end_date=periods["current_month_start"],
        )

        change = None

        if previous_month_revenue > 0:
            change = round(
                (
                        (current_month_revenue - previous_month_revenue)
                        / previous_month_revenue
                )
                * 100,
                1,
            )

        return StatisticCardResponse(
            total=current_month_revenue,
            change=change,
        )

    async def get_appointment_outcomes(
            self,
    ) -> AppointmentOutcomesResponse:
        periods = self._get_period_boundaries()

        total = await self.repository.get_appointments_count(
            start_date=periods["current_month_start"],
            end_date=periods["tomorrow_start"],
        )

        cancelled = await self.repository.get_appointments_count_by_status(
            start_date=periods["current_month_start"],
            end_date=periods["tomorrow_start"],
            status=AppointmentStatusEnum.CANCELLED,
        )

        repeated = await self.repository.get_repeated_patients_count(
            start_date=periods["current_month_start"],
            end_date=periods["tomorrow_start"],
        )

        return AppointmentOutcomesResponse(
            date=datetime.now(CLINIC_TIMEZONE).date(),
            total=total,
            cancelled=cancelled,
            repeated=repeated,
        )

    async def get_weekly_revenue_chart(
            self,
    ) -> RevenueChartResponse:
        periods = self._get_period_boundaries()

        now_local = datetime.now(CLINIC_TIMEZONE)

        week_start_local = datetime(
            year=now_local.year,
            month=now_local.month,
            day=now_local.day,
            tzinfo=CLINIC_TIMEZONE,
        ) - timedelta(days=now_local.weekday())

        week_end_local = week_start_local + timedelta(days=7)

        week_start = week_start_local.astimezone(timezone.utc)
        week_end = week_end_local.astimezone(timezone.utc)

        revenue_rows = await self.repository.get_revenue_by_day(
            start_date=week_start,
            end_date=week_end,
        )

        revenue_by_date = {
            day.astimezone(CLINIC_TIMEZONE).date(): value
            for day, value in revenue_rows
        }

        data = []

        for day_offset in range(7):
            current_day = (week_start_local + timedelta(days=day_offset)).date()

            data.append(
                RevenueDayResponse(
                    day=current_day.strftime("%a"),
                    value=revenue_by_date.get(current_day, 0.0),
                )
            )

        current_month_revenue = await self.repository.get_revenue(
            start_date=periods["current_month_start"],
            end_date=periods["tomorrow_start"],
        )

        previous_month_revenue = await self.repository.get_revenue(
            start_date=periods["previous_month_start"],
            end_date=periods["current_month_start"],
        )

        change = None

        if previous_month_revenue > 0:
            change = round(
                (
                        (current_month_revenue - previous_month_revenue)
                        / previous_month_revenue
                )
                * 100,
                1,
            )

        return RevenueChartResponse(
            total=current_month_revenue,
            change=change,
            data=data,
        )
