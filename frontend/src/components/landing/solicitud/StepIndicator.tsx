import { Check } from 'lucide-react'
import clsx from 'clsx'

const PASOS = ['Crédito', 'Datos personales', 'Situación laboral']

interface StepIndicatorProps {
  pasoActual: number
}

export function StepIndicator({ pasoActual }: StepIndicatorProps) {
  return (
    <ol className="flex items-center justify-center gap-2 sm:gap-4" aria-label="Progreso de la solicitud">
      {PASOS.map((paso, index) => {
        const numero = index + 1
        const completado = numero < pasoActual
        const activo = numero === pasoActual

        return (
          <li key={paso} className="flex items-center gap-2 sm:gap-4">
            <div className="flex flex-col items-center gap-1.5">
              <span
                aria-current={activo ? 'step' : undefined}
                className={clsx(
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                  completado && 'bg-emerald-accent-600 text-white',
                  activo && 'bg-navy-900 text-white',
                  !completado && !activo && 'bg-slate-100 text-slate-400',
                )}
              >
                {completado ? <Check className="h-4 w-4" aria-hidden="true" /> : numero}
              </span>
              <span
                className={clsx(
                  'hidden text-xs font-medium sm:block',
                  activo ? 'text-navy-900' : 'text-slate-400',
                )}
              >
                {paso}
              </span>
            </div>
            {numero < PASOS.length && (
              <div
                aria-hidden="true"
                className={clsx('h-0.5 w-8 rounded sm:w-16', completado ? 'bg-emerald-accent-600' : 'bg-slate-200')}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
