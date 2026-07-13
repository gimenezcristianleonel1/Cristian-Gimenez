import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from './AuthContext'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { usuario, cargando } = useAuth()

  if (cargando) return <div className="p-8 text-center text-slate-500">Cargando...</div>
  if (!usuario) return <Navigate to="/login" replace />

  return <>{children}</>
}
