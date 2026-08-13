"""update appointment fields

Revision ID: dad8f7ee4218
Revises: 6fe64db117a0
Create Date: 2026-07-28 18:33:17.228733

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "dad8f7ee4218"
down_revision: Union[str, Sequence[str], None] = "6fe64db117a0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.alter_column(
        "appointments",
        "reason_for_visit",
        new_column_name="type_visit",
        existing_type=sa.String(length=255),
        existing_nullable=True,
    )

    op.add_column(
        "appointments",
        sa.Column(
            "notes",
            sa.String(length=1000),
            nullable=True,
        ),
    )

    op.drop_column(
        "appointments",
        "channel",
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.add_column(
        "appointments",
        sa.Column(
            "channel",
            sa.String(length=30),
            nullable=True,
        ),
    )

    op.drop_column(
        "appointments",
        "notes",
    )

    op.alter_column(
        "appointments",
        "type_visit",
        new_column_name="reason_for_visit",
        existing_type=sa.String(length=255),
        existing_nullable=True,
    )
