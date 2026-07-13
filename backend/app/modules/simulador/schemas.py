from decimal import Decimal

from pydantic import BaseModel, Field


class SimulacionRequest(BaseModel):
    monto: Decimal = Field(gt=0, decimal_places=2, description="Monto solicitado")
    tasa: Decimal = Field(ge=0, decimal_places=4, description="Tasa de interés por cuota, en porcentaje (ej. 5 = 5%)")
    cantidad_cuotas: int = Field(gt=0, le=600, description="Cantidad de cuotas")


class CuotaAmortizacion(BaseModel):
    numero_cuota: int
    cuota: Decimal
    interes: Decimal
    amortizacion: Decimal
    saldo: Decimal


class SimulacionResponse(BaseModel):
    monto: Decimal
    tasa: Decimal
    cantidad_cuotas: int
    valor_cuota: Decimal
    interes_total: Decimal
    monto_final: Decimal
    tabla_amortizacion: list[CuotaAmortizacion]
