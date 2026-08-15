"""merge_treatments_with_previous_heads

Revision ID: 8d8f04bcb57a
Revises: 568e9b2518a1, b7f2c8a1d9e0
Create Date: 2026-08-13 22:53:54.101239

"""
from typing import Sequence, Union



# revision identifiers, used by Alembic.
revision: str = '8d8f04bcb57a'
down_revision: Union[str, Sequence[str], None] = ('568e9b2518a1', 'b7f2c8a1d9e0')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
