from datetime import datetime
from decimal import Decimal

from sqlalchemy import Boolean, DateTime, ForeignKey, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Financiador(Base):
    __tablename__ = "financiadores"

    id: Mapped[int] = mapped_column(primary_key=True)
    financiera_id: Mapped[int] = mapped_column(ForeignKey("financieras.id"), nullable=False)
    nombre: Mapped[str] = mapped_column(String(150), nullable=False)
    contacto: Mapped[str] = mapped_column(String(255), nullable=False)
    capital_aportado: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False)
    capital_disponible: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False)
    rendimiento_acordado: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False)
    observaciones: Mapped[str | None] = mapped_column(Text, nullable=True)
    activo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    financiera: Mapped["Financiera"] = relationship(back_populates="financiadores")
    prestamos: Mapped[list["Prestamo"]] = relationship(back_populates="financiador")
