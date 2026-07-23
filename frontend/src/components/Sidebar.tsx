import { Banknote, Building2, FileText, LayoutDashboard, Users, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import type { ComponentType } from 'react'
import type { RolStaff } from '../types'
import nexoIcon from '../assets/nexo-icon.png'

interface NavItem {
  to: string
  label: string
  icon: ComponentType<{ className?: string }>
  roles: RolStaff[]
}

const NAV_ITEMS: NavItem[] = [
  { to: '/administrador', label: 'Inicio', icon: LayoutDashboard, roles: ['administrador'] },
  { to: '/operador', label: 'Inicio', icon: LayoutDashboard, roles: ['operador'] },
  { to: '/solicitudes', label: 'Solicitudes', icon: FileText, roles: ['administrador', 'operador'] },
  { to: '/administrador/clientes', label: 'Clientes', icon: Users, roles: ['administrador'] },
  { to: '/administrador/financieras', label: 'Financieras', icon: Building2, roles: ['administrador'] },
  { to: '/administrador/desembolsos', label: 'Desembolsos', icon: Banknote, roles: ['administrador'] },
]

interface SidebarProps {
  rol: RolStaff | undefined
  abierto: boolean
  onCerrar: () => void
}

export function Sidebar({ rol, abierto, onCerrar }: SidebarProps) {
  const location = useLocation()
  const items = NAV_ITEMS.filter((item) => rol && item.roles.includes(rol))

  return (
    <>
      {abierto && (
        <div
          className="fixed inset-0 z-40 bg-navy-950/40 sm:hidden"
          onClick={onCerrar}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white transition-transform duration-200 sm:static sm:z-auto sm:translate-x-0 ${
          abierto ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Link to="/" className="flex items-center gap-2 text-navy-900">
            <img src={nexoIcon} alt="" className="h-9 w-9" aria-hidden="true" />
            <span className="text-lg font-bold tracking-tight">Nexo Préstamos</span>
          </Link>
          <button
            onClick={onCerrar}
            aria-label="Cerrar menú"
            className="rounded-md p-1 text-slate-500 hover:bg-slate-100 sm:hidden"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {items.map((item) => {
            const activo = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onCerrar}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  activo
                    ? 'bg-emerald-accent-50 text-emerald-accent-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-navy-900'
                }`}
              >
                <item.icon className="h-5 w-5" aria-hidden="true" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
