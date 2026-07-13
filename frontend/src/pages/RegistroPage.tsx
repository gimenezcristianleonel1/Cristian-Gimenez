import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, apiErrorMessage } from '../lib/api'
import { useAuth } from '../auth/AuthContext'

const CAMPOS = [
  { name: 'nombre', label: 'Nombre completo', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'password', label: 'Contraseña', type: 'password' },
  { name: 'dni', label: 'DNI', type: 'text' },
  { name: 'telefono', label: 'Teléfono', type: 'text' },
  { name: 'direccion', label: 'Dirección', type: 'text' },
] as const

type Form = Record<(typeof CAMPOS)[number]['name'], string>

export function RegistroPage() {
  const [form, setForm] = useState<Form>({
    nombre: '',
    email: '',
    password: '',
    dni: '',
    telefono: '',
    direccion: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const { iniciarSesion } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setEnviando(true)
    try {
      const { data } = await api.post('/clientes/registro', form)
      await iniciarSesion(data.access_token)
      navigate('/cliente')
    } catch (err) {
      setError(apiErrorMessage(err, 'No se pudo completar el registro'))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-sm flex-col justify-center px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Crear cuenta de cliente</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {CAMPOS.map((campo) => (
          <div key={campo.name}>
            <label className="mb-1 block text-sm font-medium text-slate-700">{campo.label}</label>
            <input
              type={campo.type}
              required
              value={form[campo.name]}
              onChange={(e) => setForm({ ...form, [campo.name]: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        ))}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={enviando}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {enviando ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        ¿Ya tenés cuenta?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Iniciá sesión
        </Link>
      </p>
    </div>
  )
}
