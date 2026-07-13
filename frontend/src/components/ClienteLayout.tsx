import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { Layout } from './Layout'

export function ClienteLayout({ children }: { children: ReactNode }) {
  const { usuario, cerrarSesion } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    cerrarSesion()
    navigate('/login')
  }

  return (
    <Layout nombre={usuario?.nombre ?? ''} rolLabel="cliente" onLogout={handleLogout}>
      {children}
    </Layout>
  )
}
