from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, Enum, ForeignKey, Numeric, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.enums import EstadoPrestamo


class Prestamo(Base):
    __tablename__ = "prestamos"

    id: Mapped[int] = mapped_column(primary_key=True)
    cliente_id: Mapped[int] = mapped_column(ForeignKey("clientes.id"), nullable=False)
    monto_solicitado: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    cantidad_cuotas: Mapped[int] = mapped_column(nullable=False)
    destino: Mapped[str] = mapped_column(Text, nullable=False)
    tasa: Mapped[Decimal | None] = mapped_column(Numeric(5, 2), nullable=True)
    observaciones: Mapped[str | None] = mapped_column(Text, nullable=True)
    estado: Mapped[EstadoPrestamo] = mapped_column(
        Enum(EstadoPrestamo, name="estado_prestamo"),
        default=EstadoPrestamo.PENDIENTE,
        nullable=False,
    )
    financiador_id: Mapped[int | None] = mapped_column(ForeignKey("financiadores.id"), nullable=True)
    financiera_id: Mapped[int | None] = mapped_column(ForeignKey("financieras.id"), nullable=True)
    fecha_solicitud: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    cliente: Mapped["Cliente"] = relationship(back_populates="prestamos")
    financiador: Mapped["Financiador | None"] = relationship(back_populates="prestamos")
    financiera: Mapped["Financiera | None"] = relationship(back_populates="prestamos")
    evaluacion: Mapped["Evaluacion | None"] = relationship(back_populates="prestamo", uselist=False)
    desembolso: Mapped["Desembolso | None"] = relationship(back_populates="prestamo", uselist=False)
