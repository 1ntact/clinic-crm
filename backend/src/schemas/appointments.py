from datetime import date, datetime, time

from pydantic import BaseModel, ConfigDict, Field

from database.models.appointments import AppointmentStatusEnum


class AppointmentBase(BaseModel):
    patient_id: int
    doctor_id: int
    date_time: datetime
    duration: int = Field(default=30, ge=1)
    type_visit: str | None = None
    status: AppointmentStatusEnum = AppointmentStatusEnum.SCHEDULED
    notes: str | None = None


class AppointmentCreate(BaseModel):
    patient_id: int
    doctor_id: int
    appointment_date: date
    appointment_time: time
    type_visit: str
    notes: str | None = None


class AppointmentUpdate(BaseModel):
    patient_id: int | None = None
    doctor_id: int | None = None
    date_time: datetime | None = None
    duration: int | None = Field(default=None, ge=1)
    type_visit: str | None = None
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


class AppointmentStatusUpdate(BaseModel):
    status: AppointmentStatusEnum
