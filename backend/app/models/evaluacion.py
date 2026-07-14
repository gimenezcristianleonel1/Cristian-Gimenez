import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.enums import DecisionEvaluacion


class Evaluacion(Base):
    __tablename__ = "evaluaciones"

    id: Mapped[int] = mapped_column(primary_key=True)
    prestamo_id: Mapped[int] = mapped_column(ForeignKey("prestamos.id"), unique=True, nullable=False)
    aprobado_por_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("staff.id"), nullable=False
    )
    decision: Mapped[DecisionEvaluacion] = mapped_column(
        Enum(DecisionEvaluacion, name="decision_evaluacion"), nullable=False
    )
    observaciones: Mapped[str] = mapped_column(Text, nullable=False)
    fecha_evaluacion: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    prestamo: Mapped["Prestamo"] = relationship(back_populates="evaluacion")
