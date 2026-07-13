import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useStaffAuth } from './StaffAuthContext'
import type { RolStaff } from '../types'

export function StaffProtectedRoute({
  roles,
  children,
}: {
  roles: RolStaff[]
  children: ReactNode
}) {
  const { staff, cargando } = useStaffAuth()

  if (cargando) return <div className="p-8 text-center text-slate-500">Cargando...</div>
  if (!staff) return <Navigate to="/staff/login" replace />
  if (!roles.includes(staff.rol)) return <Navigate to="/" replace />

  return <>{children}</>
}
