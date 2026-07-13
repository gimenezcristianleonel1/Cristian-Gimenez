import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from './AuthContext'
import type { Rol } from '../types'

export function ProtectedRoute({
  roles,
  children,
}: {
  roles: Rol[]
  children: ReactNode
}) {
  const { usuario, cargando } = useAuth()

  if (cargando) return <div className="p-8 text-center text-slate-500">Cargando...</div>
  if (!usuario) return <Navigate to="/login" replace />
  if (!roles.includes(usuario.rol)) return <Navigate to="/" replace />

  return <>{children}</>
}
