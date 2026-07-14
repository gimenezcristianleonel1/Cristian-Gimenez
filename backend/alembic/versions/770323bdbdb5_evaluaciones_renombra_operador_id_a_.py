"""evaluaciones: renombra operador_id a aprobado_por_id

Revision ID: 770323bdbdb5
Revises: abdc8e612169
Create Date: 2026-07-14 21:30:23.930099

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '770323bdbdb5'
down_revision: Union[str, None] = 'abdc8e612169'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column('evaluaciones', 'operador_id', new_column_name='aprobado_por_id')
    op.execute(
        "ALTER TABLE evaluaciones RENAME CONSTRAINT fk_evaluaciones_operador_id "
        "TO fk_evaluaciones_aprobado_por_id"
    )


def downgrade() -> None:
    op.execute(
        "ALTER TABLE evaluaciones RENAME CONSTRAINT fk_evaluaciones_aprobado_por_id "
        "TO fk_evaluaciones_operador_id"
    )
    op.alter_column('evaluaciones', 'aprobado_por_id', new_column_name='operador_id')
