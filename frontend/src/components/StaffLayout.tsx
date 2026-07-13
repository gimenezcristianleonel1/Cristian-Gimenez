import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStaffAuth } from '../auth/StaffAuthContext'
import { Layout } from './Layout'

export function StaffLayout({ children }: { children: ReactNode }) {
  const { staff, cerrarSesion } = useStaffAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await cerrarSesion()
    navigate('/staff/login')
  }

  return (
    <Layout nombre={staff?.nombre ?? ''} rolLabel={staff?.rol ?? ''} onLogout={handleLogout}>
      {children}
    </Layout>
  )
}
