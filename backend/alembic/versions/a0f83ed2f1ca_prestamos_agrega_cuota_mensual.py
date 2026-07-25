"""prestamos agrega cuota_mensual

Revision ID: a0f83ed2f1ca
Revises: 770323bdbdb5
Create Date: 2026-07-25 20:52:14.790237

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a0f83ed2f1ca'
down_revision: Union[str, None] = '770323bdbdb5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('prestamos', sa.Column('cuota_mensual', sa.Numeric(precision=12, scale=2), nullable=True))


def downgrade() -> None:
    op.drop_column('prestamos', 'cuota_mensual')
