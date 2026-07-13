import type { ReactNode } from 'react'

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
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <span className="text-lg font-semibold text-slate-900">Nexo Préstamos</span>
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
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  )
}
