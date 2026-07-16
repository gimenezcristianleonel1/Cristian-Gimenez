import type { SolicitudFormData } from './types'

interface StepPersonalInfoProps {
  data: SolicitudFormData
  onChange: (patch: Partial<SolicitudFormData>) => void
}

export function StepPersonalInfo({ data, onChange }: StepPersonalInfoProps) {
  return (
    <fieldset className="flex flex-col gap-5">
      <legend className="sr-only">Información personal</legend>

      <div>
        <label htmlFor="sol-nombre" className="text-sm font-medium text-slate-700">
          Nombre completo
        </label>
        <input
          id="sol-nombre"
          type="text"
          required
          autoComplete="name"
          value={data.nombre}
          onChange={(e) => onChange({ nombre: e.target.value })}
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-emerald-accent-500 focus:outline-none focus:ring-2 focus:ring-emerald-accent-100"
        />
      </div>

      <div>
        <label htmlFor="sol-dni" className="text-sm font-medium text-slate-700">
          DNI
        </label>
        <input
          id="sol-dni"
          type="text"
          inputMode="numeric"
          required
          value={data.dni}
          onChange={(e) => onChange({ dni: e.target.value })}
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-emerald-accent-500 focus:outline-none focus:ring-2 focus:ring-emerald-accent-100"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="sol-email" className="text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="sol-email"
            type="email"
            required
            autoComplete="email"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-emerald-accent-500 focus:outline-none focus:ring-2 focus:ring-emerald-accent-100"
          />
        </div>
        <div>
          <label htmlFor="sol-telefono" className="text-sm font-medium text-slate-700">
            Teléfono
          </label>
          <input
            id="sol-telefono"
            type="tel"
            required
            autoComplete="tel"
            value={data.telefono}
            onChange={(e) => onChange({ telefono: e.target.value })}
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-emerald-accent-500 focus:outline-none focus:ring-2 focus:ring-emerald-accent-100"
          />
        </div>
      </div>
    </fieldset>
  )
}
