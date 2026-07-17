import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStaffAuth } from '../auth/StaffAuthContext'
import { StaffShell } from './StaffShell'

export function StaffLayout({ children }: { children: ReactNode }) {
  const { staff, cerrarSesion } = useStaffAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await cerrarSesion()
    navigate('/staff/login')
  }

  return (
    <StaffShell nombre={staff?.nombre ?? ''} rol={staff?.rol} onLogout={handleLogout}>
      {children}
    </StaffShell>
  )
}
