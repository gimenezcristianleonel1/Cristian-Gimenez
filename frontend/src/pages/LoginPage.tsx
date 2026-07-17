import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, apiErrorMessage } from '../lib/api'
import { useAuth } from '../auth/AuthContext'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const { iniciarSesion } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setEnviando(true)
    try {
      const body = new URLSearchParams({ username: email, password })
      const { data } = await api.post('/auth/login', body, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      await iniciarSesion(data.access_token)
      navigate('/cliente')
    } catch (err) {
      setError(apiErrorMessage(err, 'No se pudo iniciar sesión'))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-sm flex-col justify-center px-4">
      <h1 className="mb-6 text-2xl font-semibold text-navy-900">Iniciar sesión</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-accent-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Contraseña</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-accent-500 focus:outline-none"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={enviando}
          className="rounded-md bg-emerald-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-accent-700 disabled:opacity-50"
        >
          {enviando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        ¿Sos cliente y no tenés cuenta?{' '}
        <Link to="/registro" className="text-emerald-accent-600 hover:underline">
          Registrate
        </Link>
      </p>
      <p className="mt-2 text-sm text-slate-600">
        ¿Sos parte del equipo?{' '}
        <Link to="/staff/login" className="text-emerald-accent-600 hover:underline">
          Ingresá acá
        </Link>
      </p>
    </div>
  )
}
