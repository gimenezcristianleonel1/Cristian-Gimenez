import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Landmark } from 'lucide-react'

const NAV_LINKS = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#como-funciona', label: 'Cómo funciona' },
  { href: '#requisitos', label: 'Requisitos' },
  { href: '#preguntas-frecuentes', label: 'Preguntas frecuentes' },
]

export function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  function irASolicitud() {
    setMenuAbierto(false)
    document.getElementById('solicitud')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <a href="#inicio" className="flex items-center gap-2 text-navy-900">
          <Landmark className="h-6 w-6 text-emerald-accent-600" aria-hidden="true" />
          <span className="text-lg font-bold tracking-tight">Nexo Préstamos</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-navy-800"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 md:flex">
          <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-navy-800">
            Iniciar sesión
          </Link>
          <button
            type="button"
            onClick={irASolicitud}
            className="rounded-full bg-emerald-accent-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-accent-700"
          >
            Solicitar crédito
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMenuAbierto((v) => !v)}
          aria-expanded={menuAbierto}
          aria-controls="menu-movil"
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          className="rounded-md p-2 text-slate-700 md:hidden"
        >
          {menuAbierto ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {menuAbierto && (
        <div id="menu-movil" className="border-t border-slate-200 bg-white px-4 pb-4 md:hidden">
          <ul className="flex flex-col gap-1 pt-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuAbierto(false)}
                  className="block rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={irASolicitud}
            className="mt-2 w-full rounded-full bg-emerald-accent-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-accent-700"
          >
            Solicitar crédito
          </button>
          <Link
            to="/login"
            onClick={() => setMenuAbierto(false)}
            className="mt-1 block px-3 py-2.5 text-center text-sm font-medium text-slate-600 hover:text-navy-800"
          >
            Iniciar sesión
          </Link>
        </div>
      )}
    </header>
  )
}
