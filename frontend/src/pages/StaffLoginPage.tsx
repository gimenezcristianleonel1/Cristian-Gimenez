import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStaffAuth } from '../auth/StaffAuthContext'
import { api } from '../lib/api'
import type { RolStaff, Staff } from '../types'

const RUTA_POR_ROL: Record<RolStaff, string> = {
  administrador: '/administrador',
  operador: '/operador',
}

export function StaffLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const { iniciarSesion } = useStaffAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setEnviando(true)
    try {
      await iniciarSesion(email, password)
      const { data } = await api.get<Staff>('/staff/me')
      navigate(RUTA_POR_ROL[data.rol])
    } catch {
      setError('No se pudo iniciar sesión. Verificá tu email y contraseña.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-sm flex-col justify-center px-4">
      <h1 className="mb-1 text-2xl font-semibold text-slate-900">Acceso de staff</h1>
      <p className="mb-6 text-sm text-slate-500">Administrador y Operador</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Contraseña</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={enviando}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {enviando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        ¿Sos cliente?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Ingresá acá
        </Link>
      </p>
    </div>
  )
}
