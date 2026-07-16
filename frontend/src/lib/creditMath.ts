/**
 * Tasa mensual estimada usada únicamente para la previsualización del simulador
 * del Hero. Es un valor de referencia: la tasa real depende de la financiera
 * que finalmente evalúe la solicitud.
 */
export const TASA_REFERENCIA_MENSUAL = 4.5

export interface EstimacionCuota {
  cuotaMensual: number
  totalAPagar: number
  totalIntereses: number
}

/**
 * Estimación rápida de cuota por sistema francés, solo para feedback
 * instantáneo mientras el usuario mueve los sliders. No reemplaza al
 * simulador oficial (/simulador) que usa el backend con precisión decimal.
 */
export function estimarCuota(
  monto: number,
  cantidadCuotas: number,
  tasaMensual: number = TASA_REFERENCIA_MENSUAL,
): EstimacionCuota {
  if (monto <= 0 || cantidadCuotas <= 0) {
    return { cuotaMensual: 0, totalAPagar: 0, totalIntereses: 0 }
  }

  const i = tasaMensual / 100
  const cuotaMensual =
    i === 0 ? monto / cantidadCuotas : (monto * i) / (1 - Math.pow(1 + i, -cantidadCuotas))

  const totalAPagar = cuotaMensual * cantidadCuotas
  const totalIntereses = totalAPagar - monto

  return { cuotaMensual, totalAPagar, totalIntereses }
}

export function formatearMonto(valor: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(valor)
}
