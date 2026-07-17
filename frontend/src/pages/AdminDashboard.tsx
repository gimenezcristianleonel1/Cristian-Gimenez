import { Link } from 'react-router-dom'
import { Banknote, Building2, FileText, Users } from 'lucide-react'
import type { ComponentType } from 'react'

interface Panel {
  to: string
  titulo: string
  descripcion: string
  boton: string
  icon: ComponentType<{ className?: string }>
}

const PANELES: Panel[] = [
  {
    to: '/solicitudes',
    titulo: 'Solicitudes',
    descripcion: 'Ver, aprobar, rechazar y asignar financiador a las solicitudes de crédito.',
    boton: 'Ver solicitudes',
    icon: FileText,
  },
  {
    to: '/administrador/clientes',
    titulo: 'Clientes',
    descripcion: 'Datos de cada cliente, todas sus solicitudes y quién les otorgó cada crédito.',
    boton: 'Ver clientes',
    icon: Users,
  },
  {
    to: '/administrador/financieras',
    titulo: 'Financieras',
    descripcion: 'Financieras aliadas cargadas, sus estadísticas, y alta de nuevas financieras.',
    boton: 'Ver financieras',
    icon: Building2,
  },
  {
    to: '/administrador/desembolsos',
    titulo: 'Desembolsos',
    descripcion: 'Registrar desembolsos de préstamos aprobados y ver el historial.',
    boton: 'Ver desembolsos',
    icon: Banknote,
  },
]

export function AdminDashboard() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {PANELES.map((panel) => (
        <div key={panel.to} className="flex flex-col rounded-lg border border-slate-200 bg-white p-6">
          <panel.icon className="h-8 w-8 text-emerald-accent-600" aria-hidden="true" />
          <h2 className="mt-3 text-lg font-semibold text-navy-900">{panel.titulo}</h2>
          <p className="mt-1 flex-1 text-sm text-slate-500">{panel.descripcion}</p>
          <Link
            to={panel.to}
            className="mt-4 w-fit rounded-md bg-emerald-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-accent-700"
          >
            {panel.boton}
          </Link>
        </div>
      ))}
    </div>
  )
}
