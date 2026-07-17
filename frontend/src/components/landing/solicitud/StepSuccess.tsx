import { Link } from 'react-router-dom'
import { PartyPopper } from 'lucide-react'
import { estimarCuota, formatearMonto } from '../../../lib/creditMath'
import type { Prestamo } from '../../../types'

interface StepSuccessProps {
  nombre: string
  prestamo: Prestamo
}

export function StepSuccess({ nombre, prestamo }: StepSuccessProps) {
  const estimacion = estimarCuota(Number(prestamo.monto_solicitado), prestamo.cantidad_cuotas)

  return (
    <div className="flex flex-col items-center gap-6 py-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-accent-50">
        <PartyPopper className="h-8 w-8 text-emerald-accent-600" aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-navy-900">
          ¡Listo, {nombre.split(' ')[0]}! Tu solicitud #{prestamo.id} fue registrada
        </h3>
        <p className="mt-1 max-w-md text-sm text-slate-600">
          Nuestro equipo va a evaluar tu perfil contra la red de financieras aliadas. Te contactaremos por
          email o teléfono con la resolución.
        </p>
      </div>

      <div className="w-full max-w-md rounded-xl border border-slate-200 p-5 text-left">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Estado</span>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            Pendiente de evaluación
          </span>
        </div>
        <dl className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-sm">
          <div>
            <dt className="text-slate-500">Monto</dt>
            <dd className="font-semibold text-navy-900">{formatearMonto(Number(prestamo.monto_solicitado))}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Plazo</dt>
            <dd className="font-semibold text-navy-900">{prestamo.cantidad_cuotas} cuotas</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-slate-500">Cuota estimada de referencia</dt>
            <dd className="font-semibold text-emerald-accent-600">{formatearMonto(estimacion.cuotaMensual)}</dd>
          </div>
        </dl>
      </div>

      <Link
        to="/cliente"
        className="rounded-full bg-navy-900 px-6 py-3 text-sm font-semibold text-white hover:bg-navy-800"
      >
        Ver el estado de mi solicitud
      </Link>
      <p className="text-xs text-slate-400">
        Cuota estimada de referencia. La tasa y condiciones finales dependen de la financiera asignada.
      </p>
    </div>
  )
}
