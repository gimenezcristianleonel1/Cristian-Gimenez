import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import DecisionEvaluacion, EstadoPrestamo


class PrestamoCreate(BaseModel):
    monto_solicitado: Decimal = Field(gt=0, decimal_places=2)
    plazo_meses: int = Field(gt=0, le=360)
    motivo: str = Field(min_length=5, max_length=2000)


class EvaluacionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    operador_id: uuid.UUID
    decision: DecisionEvaluacion
    observaciones: str
    fecha_evaluacion: datetime


class PrestamoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    cliente_id: int
    monto_solicitado: Decimal
    plazo_meses: int
    motivo: str
    estado: EstadoPrestamo
    financiador_id: int | None
    financiera_id: int | None
    fecha_solicitud: datetime
    evaluacion: EvaluacionResponse | None = None


class EvaluacionCreate(BaseModel):
    decision: DecisionEvaluacion
    observaciones: str = Field(min_length=5, max_length=2000)
