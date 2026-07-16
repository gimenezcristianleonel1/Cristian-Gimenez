import type { SituacionLaboral, SolicitudFormData } from './types'

const SITUACIONES: { value: SituacionLaboral; label: string }[] = [
  { value: 'relacion_dependencia', label: 'Relación de dependencia' },
  { value: 'autonomo', label: 'Autónomo' },
  { value: 'monotributista', label: 'Monotributista' },
  { value: 'otro', label: 'Otro' },
]

interface StepWorkInfoProps {
  data: SolicitudFormData
  onChange: (patch: Partial<SolicitudFormData>) => void
}

export function StepWorkInfo({ data, onChange }: StepWorkInfoProps) {
  return (
    <fieldset className="flex flex-col gap-5">
      <legend className="sr-only">Situación laboral e ingresos</legend>

      <div>
        <label htmlFor="sol-situacion" className="text-sm font-medium text-slate-700">
          Situación laboral
        </label>
        <select
          id="sol-situacion"
          required
          value={data.situacionLaboral}
          onChange={(e) => onChange({ situacionLaboral: e.target.value as SituacionLaboral })}
          className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-emerald-accent-500 focus:outline-none focus:ring-2 focus:ring-emerald-accent-100"
        >
          <option value="" disabled>
            Seleccioná una opción
          </option>
          {SITUACIONES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="sol-ingresos" className="text-sm font-medium text-slate-700">
          Ingresos mensuales netos
        </label>
        <input
          id="sol-ingresos"
          type="number"
          min={0}
          step={1000}
          required
          value={data.ingresosMensuales}
          onChange={(e) => onChange({ ingresosMensuales: e.target.value === '' ? '' : Number(e.target.value) })}
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-emerald-accent-500 focus:outline-none focus:ring-2 focus:ring-emerald-accent-100"
        />
        <p className="mt-1 text-xs text-slate-500">
          Este dato lo usan las financieras para evaluar tu capacidad de pago.
        </p>
      </div>
    </fieldset>
  )
}
