import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, ForeignKey, Numeric, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Desembolso(Base):
    __tablename__ = "desembolsos"

    id: Mapped[int] = mapped_column(primary_key=True)
    prestamo_id: Mapped[int] = mapped_column(ForeignKey("prestamos.id"), unique=True, nullable=False)
    registrado_por_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("staff.id"), nullable=False
    )
    monto: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    metodo: Mapped[str] = mapped_column(String(100), nullable=False)
    observaciones: Mapped[str | None] = mapped_column(Text, nullable=True)
    fecha_desembolso: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    prestamo: Mapped["Prestamo"] = relationship(back_populates="desembolso")
