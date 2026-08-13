from __future__ import annotations

from decimal import Decimal

from sqlalchemy import ForeignKey, Integer, Numeric, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.models.base import Base


class VisitModel(Base):
    __tablename__ = "visit"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    appointment_id: Mapped[int] = mapped_column(
        ForeignKey(
            "appointments.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        unique=True,
    )

    treatment_add1: Mapped[int | None] = mapped_column(
        ForeignKey(
            "treatments.id",
            ondelete="RESTRICT",
        ),
        nullable=True,
    )

    treatment_add2: Mapped[int | None] = mapped_column(
        ForeignKey(
            "treatments.id",
            ondelete="RESTRICT",
        ),
        nullable=True,
    )

    diagnosis: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    recommendation: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    amount: Mapped[Decimal] = mapped_column(
        Numeric(
            precision=10,
            scale=2,
        ),
        nullable=False,
    )

    appointment = relationship(
        "AppointmentModel",
        back_populates="visit",
    )

    additional_treatment_1 = relationship(
        "TreatmentModel",
        foreign_keys=[treatment_add1],
    )

    additional_treatment_2 = relationship(
        "TreatmentModel",
        foreign_keys=[treatment_add2],
    )
