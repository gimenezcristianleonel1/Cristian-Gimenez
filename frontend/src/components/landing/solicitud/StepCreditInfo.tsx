import type { ChangeEvent } from 'react'
import { formatearMonto } from '../../../lib/creditMath'
import type { Destino, SolicitudFormData } from './types'

const DESTINOS: { value: Destino; label: string }[] = [
  { value: 'personal', label: 'Gastos personales' },
  { value: 'vivienda', label: 'Vivienda' },
  { value: 'vehiculo', label: 'Vehículo' },
  { value: 'negocio', label: 'Negocio propio' },
  { value: 'salud', label: 'Salud' },
  { value: 'educacion', label: 'Educación' },
  { value: 'otro', label: 'Otro' },
]

interface StepCreditInfoProps {
  data: SolicitudFormData
  onChange: (patch: Partial<SolicitudFormData>) => void
}

export function StepCreditInfo({ data, onChange }: StepCreditInfoProps) {
  function handleMonto(e: ChangeEvent<HTMLInputElement>) {
    onChange({ monto: Number(e.target.value) })
  }

  return (
    <fieldset className="flex flex-col gap-5">
      <legend className="sr-only">Datos del crédito</legend>

      <div>
        <label htmlFor="sol-monto" className="text-sm font-medium text-slate-700">
          Monto solicitado
        </label>
        <input
          id="sol-monto"
          type="number"
          min={50000}
          step={10000}
          required
          value={data.monto}
          onChange={handleMonto}
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-emerald-accent-500 focus:outline-none focus:ring-2 focus:ring-emerald-accent-100"
        />
        <p className="mt-1 text-xs text-slate-500">{formatearMonto(data.monto)}</p>
      </div>

      <div>
        <span className="text-sm font-medium text-slate-700">Plazo elegido en el simulador</span>
        <p className="mt-1.5 rounded-lg bg-slate-50 px-4 py-2.5 text-sm text-slate-600">
          {data.cuotas} cuotas mensuales
        </p>
      </div>

      <div>
        <label htmlFor="sol-destino" className="text-sm font-medium text-slate-700">
          Destino del préstamo
        </label>
        <select
          id="sol-destino"
          required
          value={data.destino}
          onChange={(e) => onChange({ destino: e.target.value as Destino })}
          className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-emerald-accent-500 focus:outline-none focus:ring-2 focus:ring-emerald-accent-100"
        >
          <option value="" disabled>
            Seleccioná una opción
          </option>
          {DESTINOS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>
    </fieldset>
  )
}
