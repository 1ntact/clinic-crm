"""add treatments and visits

Revision ID: 568e9b2518a1
Revises: dad8f7ee4218
Create Date: 2026-08-01 18:29:35.103529

"""

from decimal import Decimal
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "568e9b2518a1"
down_revision: Union[str, Sequence[str], None] = "dad8f7ee4218"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


TREATMENTS = [
    {
        "treatment": "Dental Examination",
        "price": Decimal("600.00"),
        "is_main": True,
    },
    {
        "treatment": "Specialist Consultation",
        "price": Decimal("800.00"),
        "is_main": True,
    },
    {
        "treatment": "Professional Cleaning",
        "price": Decimal("1700.00"),
        "is_main": True,
    },
    {
        "treatment": "Fluoride Treatment",
        "price": Decimal("1200.00"),
        "is_main": True,
    },
    {
        "treatment": "Fissure Sealing",
        "price": Decimal("500.00"),
        "is_main": True,
    },
    {
        "treatment": "Emergency Examination",
        "price": Decimal("800.00"),
        "is_main": True,
    },
    {
        "treatment": "Dental Filling",
        "price": Decimal("1800.00"),
        "is_main": True,
    },
    {
        "treatment": "Root Canal Treatment",
        "price": Decimal("3500.00"),
        "is_main": True,
    },
    {
        "treatment": "Tooth Extraction",
        "price": Decimal("1500.00"),
        "is_main": True,
    },
    {
        "treatment": "Follow-up Examination",
        "price": Decimal("400.00"),
        "is_main": True,
    },
    {
        "treatment": "Orthodontic Adjustment",
        "price": Decimal("1200.00"),
        "is_main": True,
    },
    {
        "treatment": "Periodontal Cleaning",
        "price": Decimal("3000.00"),
        "is_main": True,
    },
    {
        "treatment": "Teeth Whitening",
        "price": Decimal("5000.00"),
        "is_main": True,
    },
    {
        "treatment": "Dental Crown",
        "price": Decimal("8000.00"),
        "is_main": True,
    },
    {
        "treatment": "Dental Implant",
        "price": Decimal("20000.00"),
        "is_main": True,
    },
    {
        "treatment": "Dental X-ray",
        "price": Decimal("300.00"),
        "is_main": False,
    },
    {
        "treatment": "Intraoral Scan",
        "price": Decimal("1000.00"),
        "is_main": False,
    },
    {
        "treatment": "Local Anesthesia",
        "price": Decimal("350.00"),
        "is_main": False,
    },
    {
        "treatment": "Rubber Dam Isolation",
        "price": Decimal("400.00"),
        "is_main": False,
    },
    {
        "treatment": "Temporary Filling",
        "price": Decimal("300.00"),
        "is_main": False,
    },
    {
        "treatment": "Medication Dressing",
        "price": Decimal("500.00"),
        "is_main": False,
    },
    {
        "treatment": "Tooth Polishing",
        "price": Decimal("500.00"),
        "is_main": False,
    },
    {
        "treatment": "Sensitivity Treatment",
        "price": Decimal("500.00"),
        "is_main": False,
    },
    {
        "treatment": "Suturing",
        "price": Decimal("700.00"),
        "is_main": False,
    },
    {
        "treatment": "Bleeding Control",
        "price": Decimal("400.00"),
        "is_main": False,
    },
]


def upgrade() -> None:
    """Upgrade schema."""

    op.create_table(
        "treatments",
        sa.Column(
            "id",
            sa.Integer(),
            nullable=False,
        ),
        sa.Column(
            "treatment",
            sa.String(length=100),
            nullable=False,
        ),
        sa.Column(
            "price",
            sa.Numeric(
                precision=10,
                scale=2,
            ),
            nullable=False,
        ),
        sa.Column(
            "is_main",
            sa.Boolean(),
            server_default=sa.text("false"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "treatment",
            name="uq_treatments_treatment",
        ),
    )

    treatments_table = sa.table(
        "treatments",
        sa.column(
            "treatment",
            sa.String(length=100),
        ),
        sa.column(
            "price",
            sa.Numeric(
                precision=10,
                scale=2,
            ),
        ),
        sa.column(
            "is_main",
            sa.Boolean(),
        ),
    )

    op.bulk_insert(
        treatments_table,
        TREATMENTS,
    )

    op.add_column(
        "appointments",
        sa.Column(
            "treatment_id",
            sa.Integer(),
            nullable=True,
        ),
    )

    op.execute(
        sa.text(
            """
            UPDATE appointments
            SET treatment_id = (
                SELECT id
                FROM treatments
                WHERE treatment = 'Specialist Consultation'
                LIMIT 1
            )
            WHERE treatment_id IS NULL
            """
        )
    )

    op.alter_column(
        "appointments",
        "treatment_id",
        existing_type=sa.Integer(),
        nullable=False,
    )

    op.create_foreign_key(
        "fk_appointments_treatment_id_treatments",
        "appointments",
        "treatments",
        ["treatment_id"],
        ["id"],
        ondelete="RESTRICT",
    )

    op.drop_column(
        "appointments",
        "type_visit",
    )

    op.create_table(
        "visit",
        sa.Column(
            "id",
            sa.Integer(),
            nullable=False,
        ),
        sa.Column(
            "appointment_id",
            sa.Integer(),
            nullable=False,
        ),
        sa.Column(
            "treatment_add1",
            sa.Integer(),
            nullable=True,
        ),
        sa.Column(
            "treatment_add2",
            sa.Integer(),
            nullable=True,
        ),
        sa.Column(
            "diagnosis",
            sa.Text(),
            nullable=True,
        ),
        sa.Column(
            "description",
            sa.Text(),
            nullable=True,
        ),
        sa.Column(
            "recommendation",
            sa.Text(),
            nullable=True,
        ),
        sa.Column(
            "amount",
            sa.Numeric(
                precision=10,
                scale=2,
            ),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["appointment_id"],
            ["appointments.id"],
            name="fk_visit_appointment_id_appointments",
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["treatment_add1"],
            ["treatments.id"],
            name="fk_visit_treatment_add1_treatments",
            ondelete="RESTRICT",
        ),
        sa.ForeignKeyConstraint(
            ["treatment_add2"],
            ["treatments.id"],
            name="fk_visit_treatment_add2_treatments",
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "appointment_id",
            name="uq_visit_appointment_id",
        ),
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_table("visit")

    op.add_column(
        "appointments",
        sa.Column(
            "type_visit",
            sa.String(length=255),
            nullable=True,
        ),
    )

    op.execute(
        sa.text(
            """
            UPDATE appointments
            SET type_visit = treatments.treatment
            FROM treatments
            WHERE appointments.treatment_id = treatments.id
            """
        )
    )

    op.drop_constraint(
        "fk_appointments_treatment_id_treatments",
        "appointments",
        type_="foreignkey",
    )

    op.drop_column(
        "appointments",
        "treatment_id",
    )

    op.drop_table("treatments")

