import { Link } from 'react-router-dom'
import { Landmark, Users, ShieldCheck } from 'lucide-react'

export function AccesoPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-4 py-12">
      <div className="mb-10 text-center">
        <Link to="/" className="inline-flex items-center gap-2 text-navy-900">
          <Landmark className="h-6 w-6 text-emerald-accent-600" aria-hidden="true" />
          <span className="text-lg font-bold">Nexo Préstamos</span>
        </Link>
        <h1 className="mt-6 text-2xl font-bold text-slate-900">¿Cómo querés ingresar?</h1>
        <p className="mt-2 text-sm text-slate-500">Elegí la opción que corresponde a tu cuenta.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Link
          to="/login"
          className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm transition-all hover:border-emerald-accent-500 hover:shadow-md"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-accent-50">
            <Users className="h-7 w-7 text-emerald-accent-600" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-navy-900">Soy cliente</h2>
            <p className="mt-1 text-sm text-slate-500">
              Consultá el estado de tu solicitud o pedí un nuevo crédito.
            </p>
          </div>
        </Link>

        <Link
          to="/staff/login"
          className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm transition-all hover:border-navy-500 hover:shadow-md"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-navy-50">
            <ShieldCheck className="h-7 w-7 text-navy-700" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-navy-900">Soy staff / administrador</h2>
            <p className="mt-1 text-sm text-slate-500">
              Acceso interno para evaluar solicitudes y gestionar la operación.
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
