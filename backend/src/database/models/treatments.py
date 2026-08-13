from __future__ import annotations

from decimal import Decimal

from sqlalchemy import Boolean, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.models.base import Base


class TreatmentModel(Base):
    __tablename__ = "treatments"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    treatment: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        unique=True,
    )

    price: Mapped[Decimal] = mapped_column(
        Numeric(
            precision=10,
            scale=2,
        ),
        nullable=False,
    )

    is_main: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default="false",
    )

    appointments = relationship(
        "AppointmentModel",
        back_populates="treatment",
    )

    additional_visits_1 = relationship(
        "VisitModel",
        foreign_keys="VisitModel.treatment_add1",
    )

    additional_visits_2 = relationship(
        "VisitModel",
        foreign_keys="VisitModel.treatment_add2",
    )
