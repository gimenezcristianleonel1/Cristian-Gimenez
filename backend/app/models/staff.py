import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.enums import RolStaff


class Staff(Base):
    """Perfil interno de un usuario autenticado vía Supabase Auth.

    El id coincide con el id del usuario en auth.users de Supabase: la
    identidad y la contraseña las administra Supabase, acá solo guardamos
    los datos de negocio (nombre y rol) asociados a esa identidad.
    """

    __tablename__ = "staff"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)
    nombre: Mapped[str] = mapped_column(String(150), nullable=False)
    rol: Mapped[RolStaff] = mapped_column(Enum(RolStaff, name="rol_staff"), nullable=False)
    activo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
