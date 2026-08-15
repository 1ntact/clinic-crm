from pydantic import BaseModel
from datetime import date


class StatisticCardResponse(BaseModel):
    total: int | float
    change: float | None


class AppointmentOutcomesResponse(BaseModel):
    date: date
    total: int
    cancelled: int
    repeated: int


class RevenueDayResponse(BaseModel):
    day: str
    value: float


class RevenueChartResponse(BaseModel):
    total: float
    change: float | None
    data: list[RevenueDayResponse]
