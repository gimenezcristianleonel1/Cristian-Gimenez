import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from '../lib/api'
import { supabase } from '../lib/supabaseClient'
import type { Staff } from '../types'

interface StaffAuthContextValue {
  staff: Staff | null
  cargando: boolean
  iniciarSesion: (email: string, password: string) => Promise<void>
  cerrarSesion: () => Promise<void>
}

const StaffAuthContext = createContext<StaffAuthContextValue | null>(null)

export function StaffAuthProvider({ children }: { children: ReactNode }) {
  const [staff, setStaff] = useState<Staff | null>(null)
  const [cargando, setCargando] = useState(true)

  async function cargarPerfil() {
    try {
      const { data } = await api.get<Staff>('/staff/me')
      setStaff(data)
    } catch {
      setStaff(null)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        cargarPerfil()
      } else {
        setCargando(false)
      }
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        cargarPerfil()
      } else {
        setStaff(null)
        setCargando(false)
      }
    })

    return () => subscription.subscription.unsubscribe()
  }, [])

  async function iniciarSesion(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    await cargarPerfil()
  }

  async function cerrarSesion() {
    await supabase.auth.signOut()
    setStaff(null)
  }

  return (
    <StaffAuthContext.Provider value={{ staff, cargando, iniciarSesion, cerrarSesion }}>
      {children}
    </StaffAuthContext.Provider>
  )
}

export function useStaffAuth(): StaffAuthContextValue {
  const context = useContext(StaffAuthContext)
  if (!context) throw new Error('useStaffAuth debe usarse dentro de StaffAuthProvider')
  return context
}
