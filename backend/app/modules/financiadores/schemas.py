from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, model_validator


class FinanciadorCreate(BaseModel):
    financiera_id: int
    nombre: str = Field(min_length=2, max_length=150)
    contacto: str = Field(min_length=3, max_length=255)
    capital_aportado: Decimal = Field(ge=0, decimal_places=2)
    capital_disponible: Decimal = Field(ge=0, decimal_places=2)
    rendimiento_acordado: Decimal = Field(ge=0, decimal_places=2)
    observaciones: str | None = Field(default=None, max_length=2000)

    @model_validator(mode="after")
    def _validar_capital_disponible(self) -> "FinanciadorCreate":
        if self.capital_disponible > self.capital_aportado:
            raise ValueError("El capital disponible no puede ser mayor al capital aportado")
        return self


class FinanciadorUpdate(BaseModel):
    financiera_id: int | None = None
    nombre: str | None = Field(default=None, min_length=2, max_length=150)
    contacto: str | None = Field(default=None, min_length=3, max_length=255)
    capital_aportado: Decimal | None = Field(default=None, ge=0, decimal_places=2)
    capital_disponible: Decimal | None = Field(default=None, ge=0, decimal_places=2)
    rendimiento_acordado: Decimal | None = Field(default=None, ge=0, decimal_places=2)
    observaciones: str | None = Field(default=None, max_length=2000)

    @model_validator(mode="after")
    def _validar_capital_disponible(self) -> "FinanciadorUpdate":
        if (
            self.capital_disponible is not None
            and self.capital_aportado is not None
            and self.capital_disponible > self.capital_aportado
        ):
            raise ValueError("El capital disponible no puede ser mayor al capital aportado")
        return self


class FinanciadorResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    financiera_id: int
    nombre: str
    contacto: str
    capital_aportado: Decimal
    capital_disponible: Decimal
    rendimiento_acordado: Decimal
    observaciones: str | None
    activo: bool
    created_at: datetime


class AsignarFinanciador(BaseModel):
    prestamo_id: int
    financiador_id: int
