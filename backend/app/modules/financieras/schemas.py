from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.modules.financiadores.schemas import FinanciadorResponse


class FinancieraCreate(BaseModel):
    nombre: str = Field(min_length=2, max_length=150)
    cuit: str = Field(min_length=11, max_length=13)
    contacto: str = Field(min_length=3, max_length=255)
    email: EmailStr
    telefono: str = Field(min_length=5, max_length=30)


class FinancieraResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    cuit: str
    contacto: str
    email: str
    telefono: str
    activa: bool
    created_at: datetime


class FinancieraEstadisticas(BaseModel):
    financiera_id: int
    nombre: str
    prestamos_originados: int
    monto_total_desembolsado: Decimal
    financiadores: list[FinanciadorResponse]
