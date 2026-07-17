import type { SolicitudFormData } from './types'

interface StepPersonalInfoProps {
  data: SolicitudFormData
  onChange: (patch: Partial<SolicitudFormData>) => void
}

export function StepPersonalInfo({ data, onChange }: StepPersonalInfoProps) {
  const passwordsNoCoinciden =
    data.confirmarPassword.length > 0 && data.password !== data.confirmarPassword

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

      <div>
        <label htmlFor="sol-direccion" className="text-sm font-medium text-slate-700">
          Dirección
        </label>
        <input
          id="sol-direccion"
          type="text"
          required
          autoComplete="street-address"
          value={data.direccion}
          onChange={(e) => onChange({ direccion: e.target.value })}
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-emerald-accent-500 focus:outline-none focus:ring-2 focus:ring-emerald-accent-100"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="sol-password" className="text-sm font-medium text-slate-700">
            Contraseña
          </label>
          <input
            id="sol-password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={data.password}
            onChange={(e) => onChange({ password: e.target.value })}
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-emerald-accent-500 focus:outline-none focus:ring-2 focus:ring-emerald-accent-100"
          />
        </div>
        <div>
          <label htmlFor="sol-confirmar-password" className="text-sm font-medium text-slate-700">
            Confirmar contraseña
          </label>
          <input
            id="sol-confirmar-password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            aria-invalid={passwordsNoCoinciden}
            value={data.confirmarPassword}
            onChange={(e) => onChange({ confirmarPassword: e.target.value })}
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-emerald-accent-500 focus:outline-none focus:ring-2 focus:ring-emerald-accent-100"
          />
        </div>
      </div>
      {passwordsNoCoinciden && <p className="-mt-2 text-xs text-red-600">Las contraseñas no coinciden.</p>}
      <p className="-mt-2 text-xs text-slate-500">
        Con esta contraseña vas a poder ingresar más adelante a{' '}
        <span className="font-medium text-slate-600">Iniciar sesión</span> para ver el estado de tu
        solicitud.
      </p>
    </fieldset>
  )
}
