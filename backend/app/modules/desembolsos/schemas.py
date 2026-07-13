from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class DesembolsoCreate(BaseModel):
    prestamo_id: int
    monto: Decimal = Field(gt=0, decimal_places=2)
    metodo: str = Field(min_length=2, max_length=100)
    observaciones: str | None = Field(default=None, max_length=2000)


class DesembolsoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    prestamo_id: int
    registrado_por_id: int
    monto: Decimal
    metodo: str
    observaciones: str | None
    fecha_desembolso: datetime
