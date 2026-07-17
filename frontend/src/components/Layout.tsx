import type { ReactNode } from 'react'
import { ArrowLeft, Landmark } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const RUTAS_PRINCIPALES = ['/administrador', '/operador', '/cliente']

export function Layout({
  nombre,
  rolLabel,
  onLogout,
  children,
}: {
  nombre: string
  rolLabel: string
  onLogout: () => void
  children: ReactNode
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const mostrarVolver = !RUTAS_PRINCIPALES.includes(location.pathname)

  return (
    <div className="min-h-screen bg-textured">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-navy-900">
            <Landmark className="h-5 w-5 text-emerald-accent-600" aria-hidden="true" />
            <span className="text-lg font-bold tracking-tight">Nexo Préstamos</span>
          </Link>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span>
              {nombre} · <span className="capitalize">{rolLabel}</span>
            </span>
            <button
              onClick={onLogout}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-100"
            >
              Salir
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        {mostrarVolver && (
          <button
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-navy-900"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver
          </button>
        )}
        {children}
      </main>
    </div>
  )
}
