import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import DecisionEvaluacion, EstadoPrestamo


class PrestamoCreate(BaseModel):
    monto_solicitado: Decimal = Field(gt=0, decimal_places=2)
    cantidad_cuotas: int = Field(gt=0, le=360)
    destino: str = Field(min_length=5, max_length=2000)
    observaciones: str | None = Field(default=None, max_length=2000)


class SolicitudStaffCreate(BaseModel):
    cliente_id: int
    monto_solicitado: Decimal = Field(gt=0, decimal_places=2)
    cantidad_cuotas: int = Field(gt=0, le=360)
    tasa: Decimal = Field(ge=0, decimal_places=2)
    destino: str = Field(min_length=5, max_length=2000)
    observaciones: str | None = Field(default=None, max_length=2000)


class PrestamoUpdate(BaseModel):
    monto_solicitado: Decimal | None = Field(default=None, gt=0, decimal_places=2)
    cantidad_cuotas: int | None = Field(default=None, gt=0, le=360)
    tasa: Decimal | None = Field(default=None, ge=0, decimal_places=2)
    destino: str | None = Field(default=None, min_length=5, max_length=2000)
    observaciones: str | None = Field(default=None, max_length=2000)


class EvaluacionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    aprobado_por_id: uuid.UUID
    decision: DecisionEvaluacion
    observaciones: str
    fecha_evaluacion: datetime


class PrestamoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    cliente_id: int
    monto_solicitado: Decimal
    cantidad_cuotas: int
    destino: str
    tasa: Decimal | None
    observaciones: str | None
    estado: EstadoPrestamo
    financiador_id: int | None
    financiera_id: int | None
    fecha_solicitud: datetime
    evaluacion: EvaluacionResponse | None = None


class EvaluacionCreate(BaseModel):
    decision: DecisionEvaluacion
    observaciones: str = Field(min_length=5, max_length=2000)
