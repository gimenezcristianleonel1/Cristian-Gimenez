"""agrega financieras y relacion con financiadores y prestamos

Revision ID: 2b833fa26877
Revises: 3f6e0ebad916
Create Date: 2026-07-13 21:05:21.168839

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2b833fa26877'
down_revision: Union[str, None] = '3f6e0ebad916'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


financieras = sa.table(
    "financieras",
    sa.column("id", sa.Integer),
    sa.column("nombre", sa.String),
    sa.column("cuit", sa.String),
    sa.column("contacto", sa.String),
    sa.column("email", sa.String),
    sa.column("telefono", sa.String),
    sa.column("activa", sa.Boolean),
)

financiadores = sa.table("financiadores", sa.column("id", sa.Integer), sa.column("financiera_id", sa.Integer))

CUIT_FINANCIERA_DEFAULT = "20-00000000-0"


def upgrade() -> None:
    op.create_table('financieras',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nombre', sa.String(length=150), nullable=False),
    sa.Column('cuit', sa.String(length=13), nullable=False),
    sa.Column('contacto', sa.String(length=255), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('telefono', sa.String(length=30), nullable=False),
    sa.Column('activa', sa.Boolean(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_financieras_cuit'), 'financieras', ['cuit'], unique=True)

    # financiera placeholder para poder volver financiera_id NOT NULL sobre
    # financiadores que ya existan en la tabla (datos previos a este cambio).
    op.bulk_insert(
        financieras,
        [{
            "nombre": "Financiera sin asignar",
            "cuit": CUIT_FINANCIERA_DEFAULT,
            "contacto": "Pendiente de completar",
            "email": "pendiente@nexoprestamos.com",
            "telefono": "0000000000",
            "activa": False,
        }],
    )

    op.add_column('financiadores', sa.Column('financiera_id', sa.Integer(), nullable=True))
    op.execute(
        financiadores.update()
        .where(financiadores.c.financiera_id.is_(None))
        .values(financiera_id=sa.select(financieras.c.id).where(financieras.c.cuit == CUIT_FINANCIERA_DEFAULT).scalar_subquery())
    )
    op.alter_column('financiadores', 'financiera_id', nullable=False)
    op.create_foreign_key(
        'fk_financiadores_financiera_id', 'financiadores', 'financieras', ['financiera_id'], ['id']
    )

    op.add_column('prestamos', sa.Column('financiera_id', sa.Integer(), nullable=True))
    op.create_foreign_key('fk_prestamos_financiera_id', 'prestamos', 'financieras', ['financiera_id'], ['id'])


def downgrade() -> None:
    op.drop_constraint('fk_prestamos_financiera_id', 'prestamos', type_='foreignkey')
    op.drop_column('prestamos', 'financiera_id')
    op.drop_constraint('fk_financiadores_financiera_id', 'financiadores', type_='foreignkey')
    op.drop_column('financiadores', 'financiera_id')
    op.drop_index(op.f('ix_financieras_cuit'), table_name='financieras')
    op.drop_table('financieras')
