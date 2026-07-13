"""supabase auth: staff, roles administrador y operador

Revision ID: 8d55ada9690d
Revises: 2b833fa26877
Create Date: 2026-07-13 21:41:56.151867

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '8d55ada9690d'
down_revision: Union[str, None] = '2b833fa26877'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # El staff interno (antes en `usuarios` con rol admin/analista) pasa a
    # autenticarse vía Supabase Auth. Estos datos de prueba quedan
    # incompatibles con el nuevo esquema, así que se eliminan.
    op.execute("DELETE FROM desembolsos")
    op.execute("DELETE FROM evaluaciones")
    op.execute("DELETE FROM usuarios WHERE id NOT IN (SELECT usuario_id FROM clientes)")

    op.create_table('staff',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('nombre', sa.String(length=150), nullable=False),
        sa.Column('rol', sa.Enum('ADMINISTRADOR', 'OPERADOR', name='rol_staff'), nullable=False),
        sa.Column('activo', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )

    op.drop_constraint('desembolsos_registrado_por_id_fkey', 'desembolsos', type_='foreignkey')
    op.drop_column('desembolsos', 'registrado_por_id')
    op.add_column('desembolsos', sa.Column('registrado_por_id', sa.UUID(), nullable=False))
    op.create_foreign_key(
        'fk_desembolsos_registrado_por_id', 'desembolsos', 'staff', ['registrado_por_id'], ['id']
    )

    op.drop_constraint('evaluaciones_analista_id_fkey', 'evaluaciones', type_='foreignkey')
    op.drop_column('evaluaciones', 'analista_id')
    op.add_column('evaluaciones', sa.Column('operador_id', sa.UUID(), nullable=False))
    op.create_foreign_key(
        'fk_evaluaciones_operador_id', 'evaluaciones', 'staff', ['operador_id'], ['id']
    )

    op.drop_column('usuarios', 'rol')
    sa.Enum(name='rol_usuario').drop(op.get_bind(), checkfirst=True)


def downgrade() -> None:
    rol_usuario = sa.Enum('ADMIN', 'ANALISTA', 'CLIENTE', name='rol_usuario')
    rol_usuario.create(op.get_bind(), checkfirst=True)
    op.add_column(
        'usuarios',
        sa.Column('rol', rol_usuario, nullable=False, server_default='CLIENTE'),
    )
    op.alter_column('usuarios', 'rol', server_default=None)

    op.drop_constraint('fk_evaluaciones_operador_id', 'evaluaciones', type_='foreignkey')
    op.drop_column('evaluaciones', 'operador_id')
    op.add_column('evaluaciones', sa.Column('analista_id', sa.Integer(), nullable=True))
    op.create_foreign_key(
        'evaluaciones_analista_id_fkey', 'evaluaciones', 'usuarios', ['analista_id'], ['id']
    )

    op.drop_constraint('fk_desembolsos_registrado_por_id', 'desembolsos', type_='foreignkey')
    op.drop_column('desembolsos', 'registrado_por_id')
    op.add_column('desembolsos', sa.Column('registrado_por_id', sa.Integer(), nullable=True))
    op.create_foreign_key(
        'desembolsos_registrado_por_id_fkey', 'desembolsos', 'usuarios', ['registrado_por_id'], ['id']
    )

    op.drop_table('staff')
    sa.Enum(name='rol_staff').drop(op.get_bind(), checkfirst=True)
