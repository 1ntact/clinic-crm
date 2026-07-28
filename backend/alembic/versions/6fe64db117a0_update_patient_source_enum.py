"""update patient source enum

Revision ID: 6fe64db117a0
Revises: 93147b559385
Create Date: 2026-07-27 18:00:09.280788

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "6fe64db117a0"
down_revision: Union[str, Sequence[str], None] = "93147b559385"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


patient_source_enum = sa.Enum(
    "organic_search",
    "paid_search",
    "organic_social",
    "paid_social",
    "referral",
    "direct",
    "offline_ad",
    "other",
    "unknown",
    name="patient_source_enum",
)


def upgrade() -> None:
    # Приводимо старі значення до нових.
    op.execute(
        """
        UPDATE patients
        SET source = CASE
            WHEN source = 'google_search' THEN 'organic_search'
            WHEN source = 'social_media' THEN 'organic_social'
            WHEN source = 'recommendation' THEN 'referral'
            WHEN source = 'outdoor_ad' THEN 'offline_ad'
            WHEN source = 'website' THEN 'direct'
            WHEN source = 'other' THEN 'other'
            WHEN source IS NULL THEN 'unknown'
            ELSE 'unknown'
        END
        """
    )

    # Створюємо PostgreSQL enum.
    patient_source_enum.create(
        op.get_bind(),
        checkfirst=True,
    )

    # Міняємо VARCHAR на enum через явне PostgreSQL USING.
    op.alter_column(
        "patients",
        "source",
        existing_type=sa.VARCHAR(length=30),
        type_=patient_source_enum,
        nullable=False,
        server_default=sa.text("'unknown'"),
        postgresql_using="source::patient_source_enum",
    )


def downgrade() -> None:
    # Спочатку повертаємо enum у VARCHAR.
    op.alter_column(
        "patients",
        "source",
        existing_type=patient_source_enum,
        type_=sa.VARCHAR(length=30),
        nullable=True,
        server_default=None,
        postgresql_using="source::text",
    )

    # За можливості повертаємо старі назви.
    op.execute(
        """
        UPDATE patients
        SET source = CASE
            WHEN source = 'organic_search' THEN 'google_search'
            WHEN source = 'organic_social' THEN 'social_media'
            WHEN source = 'referral' THEN 'recommendation'
            WHEN source = 'offline_ad' THEN 'outdoor_ad'
            WHEN source = 'direct' THEN 'website'
            WHEN source = 'other' THEN 'other'
            ELSE 'other'
        END
        """
    )

    patient_source_enum.drop(
        op.get_bind(),
        checkfirst=True,
    )
