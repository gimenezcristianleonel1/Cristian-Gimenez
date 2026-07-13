from decimal import ROUND_HALF_UP, Decimal

from app.modules.simulador.schemas import CuotaAmortizacion, SimulacionResponse

DOS_DECIMALES = Decimal("0.01")


def _redondear(valor: Decimal) -> Decimal:
    return valor.quantize(DOS_DECIMALES, rounding=ROUND_HALF_UP)


class SimuladorService:
    def simular(self, monto: Decimal, tasa: Decimal, cantidad_cuotas: int) -> SimulacionResponse:
        i = tasa / Decimal(100)

        if i == 0:
            valor_cuota = _redondear(monto / cantidad_cuotas)
        else:
            factor = (1 + i) ** cantidad_cuotas
            valor_cuota = _redondear(monto * i * factor / (factor - 1))

        tabla: list[CuotaAmortizacion] = []
        saldo = monto
        for numero in range(1, cantidad_cuotas + 1):
            interes = _redondear(saldo * i)
            es_ultima = numero == cantidad_cuotas
            # La última cuota cancela el saldo exacto y absorbe los residuos
            # de redondeo acumulados en las cuotas anteriores.
            amortizacion = saldo if es_ultima else valor_cuota - interes
            cuota = amortizacion + interes if es_ultima else valor_cuota
            saldo = _redondear(saldo - amortizacion)

            tabla.append(
                CuotaAmortizacion(
                    numero_cuota=numero,
                    cuota=_redondear(cuota),
                    interes=interes,
                    amortizacion=_redondear(amortizacion),
                    saldo=saldo,
                )
            )

        interes_total = _redondear(sum((c.interes for c in tabla), Decimal(0)))
        monto_final = _redondear(sum((c.cuota for c in tabla), Decimal(0)))

        return SimulacionResponse(
            monto=monto,
            tasa=tasa,
            cantidad_cuotas=cantidad_cuotas,
            valor_cuota=valor_cuota,
            interes_total=interes_total,
            monto_final=monto_final,
            tabla_amortizacion=tabla,
        )
