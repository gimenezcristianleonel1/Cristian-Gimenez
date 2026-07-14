"""prestamos: tasa, observaciones, renombra cantidad_cuotas/destino, estado pendiente

Revision ID: abdc8e612169
Revises: 27439c14ec73
Create Date: 2026-07-14 21:18:57.199124

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'abdc8e612169'
down_revision: Union[str, None] = '27439c14ec73'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column('prestamos', 'plazo_meses', new_column_name='cantidad_cuotas')
    op.alter_column('prestamos', 'motivo', new_column_name='destino')
    op.add_column('prestamos', sa.Column('tasa', sa.Numeric(precision=5, scale=2), nullable=True))
    op.add_column('prestamos', sa.Column('observaciones', sa.Text(), nullable=True))
    op.execute("ALTER TYPE estado_prestamo RENAME VALUE 'SOLICITADO' TO 'PENDIENTE'")


def downgrade() -> None:
    op.execute("ALTER TYPE estado_prestamo RENAME VALUE 'PENDIENTE' TO 'SOLICITADO'")
    op.drop_column('prestamos', 'observaciones')
    op.drop_column('prestamos', 'tasa')
    op.alter_column('prestamos', 'destino', new_column_name='motivo')
    op.alter_column('prestamos', 'cantidad_cuotas', new_column_name='plazo_meses')
