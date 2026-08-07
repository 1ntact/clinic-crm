from datetime import date, datetime, time
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from database.models.appointments import AppointmentStatusEnum


class AppointmentBase(BaseModel):
    patient_id: int
    doctor_id: int
    treatment_id: int
    date_time: datetime
    duration: int = Field(
        default=30,
        ge=30,
        le=180,
    )
    status: AppointmentStatusEnum = AppointmentStatusEnum.SCHEDULED
    notes: str | None = None


class AppointmentCreate(BaseModel):
    patient_id: int
    doctor_id: int
    treatment_id: int
    appointment_date: date
    appointment_time: time
    duration: int = Field(
        default=30,
        ge=30,
        le=180,
        description="Appointment duration in minutes",
    )
    notes: str | None = None


class AppointmentUpdate(BaseModel):
    patient_id: int | None = None
    doctor_id: int | None = None
    treatment_id: int | None = None
    date_time: datetime | None = None
    duration: int | None = Field(
        default=None,
        ge=30,
        le=180,
    )
    status: AppointmentStatusEnum | None = None
    notes: str | None = None


class AppointmentResponse(AppointmentBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime

    patient_first_name: str | None = None
    patient_last_name: str | None = None
    patient_phone_number: str | None = None

    doctor_first_name: str | None = None
    doctor_last_name: str | None = None

    treatment: str | None = None
    treatment_price: float | None = None


class AppointmentStatusUpdate(BaseModel):
    status: AppointmentStatusEnum


class AvailableSlotResponse(BaseModel):
    time: time
    status: Literal["free", "booked", "expired"]


class AvailableSlotsResponse(BaseModel):
    date: date
    doctor_id: int
    duration: int
    available_count: int
    booked_count: int
    slots: list[AvailableSlotResponse]


class AppointmentCalendarResponse(BaseModel):
    year: int
    month: int
    days_in_month: int
    available_days: list[int]
    fully_booked_days: list[int]


class AppointmentStatisticsResponse(BaseModel):
    today_appointments: int
    upcoming_appointments: int
    completed_today: int
    cancelled_today: int


class AppointmentDashboardResponse(BaseModel):
    calendar: AppointmentCalendarResponse
    statistics: AppointmentStatisticsResponse


class PaginatedAppointmentResponse(BaseModel):
    items: list[AppointmentResponse]
    total: int
    page: int
    page_size: int
    pages: int
