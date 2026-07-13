from datetime import datetime

from sqlalchemy import Boolean, DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Financiera(Base):
    __tablename__ = "financieras"

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(150), nullable=False)
    cuit: Mapped[str] = mapped_column(String(13), unique=True, index=True, nullable=False)
    contacto: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    telefono: Mapped[str] = mapped_column(String(30), nullable=False)
    activa: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    financiadores: Mapped[list["Financiador"]] = relationship(back_populates="financiera")
    prestamos: Mapped[list["Prestamo"]] = relationship(back_populates="financiera")
