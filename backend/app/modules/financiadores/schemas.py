from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class FinanciadorCreate(BaseModel):
    nombre: str = Field(min_length=2, max_length=150)
    contacto: str = Field(min_length=3, max_length=255)


class FinanciadorResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    contacto: str
    activo: bool
    created_at: datetime


class AsignarFinanciador(BaseModel):
    prestamo_id: int
    financiador_id: int
