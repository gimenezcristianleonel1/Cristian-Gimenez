import { useState, type ReactNode } from 'react'
import { Menu } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { Avatar } from './Avatar'
import type { RolStaff } from '../types'

interface StaffShellProps {
  nombre: string
  rol: RolStaff | undefined
  onLogout: () => void
  children: ReactNode
}

export function StaffShell({ nombre, rol, onLogout, children }: StaffShellProps) {
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <div className="flex min-h-screen bg-textured">
      <Sidebar rol={rol} abierto={menuAbierto} onCerrar={() => setMenuAbierto(false)} />
      <div className="flex flex-1 flex-col">
        <header className="border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:justify-end sm:px-8">
            <button
              onClick={() => setMenuAbierto(true)}
              aria-label="Abrir menú"
              className="rounded-md p-2 text-slate-600 hover:bg-slate-100 sm:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="flex items-center gap-3">
              <Avatar nombre={nombre} />
              <div className="text-sm leading-tight">
                <p className="font-semibold text-navy-900">{nombre}</p>
                <p className="capitalize text-slate-500">{rol}</p>
              </div>
              <button
                onClick={onLogout}
                className="ml-2 rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  )
}
