import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from '../lib/api'
import type { Usuario } from '../types'

interface AuthContextValue {
  usuario: Usuario | null
  cargando: boolean
  iniciarSesion: (token: string) => Promise<void>
  cerrarSesion: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [cargando, setCargando] = useState(true)

  async function cargarUsuario() {
    try {
      const { data } = await api.get<Usuario>('/auth/me')
      setUsuario(data)
    } catch {
      localStorage.removeItem('token')
      setUsuario(null)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
      cargarUsuario()
    } else {
      setCargando(false)
    }
  }, [])

  async function iniciarSesion(token: string) {
    localStorage.setItem('token', token)
    setCargando(true)
    await cargarUsuario()
  }

  function cerrarSesion() {
    localStorage.removeItem('token')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, cargando, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}
