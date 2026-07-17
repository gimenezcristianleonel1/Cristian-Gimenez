import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api, apiErrorMessage } from '../lib/api'
import type { Financiera, FinancieraEstadisticas } from '../types'

interface FormState {
  nombre: string
  cuit: string
  contacto: string
  email: string
  telefono: string
}

const FORM_VACIO: FormState = {
  nombre: '',
  cuit: '',
  contacto: '',
  email: '',
  telefono: '',
}

export function FinancierasPage() {
  const [financieras, setFinancieras] = useState<Financiera[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [mostrarForm, setMostrarForm] = useState(false)
  const [form, setForm] = useState<FormState>(FORM_VACIO)
  const [enviando, setEnviando] = useState(false)

  const [estadisticasAbiertas, setEstadisticasAbiertas] = useState<Record<number, FinancieraEstadisticas>>({})
  const [cargandoEstadisticasId, setCargandoEstadisticasId] = useState<number | null>(null)

  async function cargar() {
    setCargando(true)
    const { data } = await api.get<Financiera[]>('/financieras')
    setFinancieras(data)
    setCargando(false)
  }

  useEffect(() => {
    cargar()
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setEnviando(true)
    try {
      await api.post('/financieras', form)
      setForm(FORM_VACIO)
      setMostrarForm(false)
      await cargar()
    } catch (err) {
      setError(apiErrorMessage(err, 'No se pudo crear la financiera'))
    } finally {
      setEnviando(false)
    }
  }

  async function verEstadisticas(financieraId: number) {
    setError(null)
    if (estadisticasAbiertas[financieraId]) {
      const copia = { ...estadisticasAbiertas }
      delete copia[financieraId]
      setEstadisticasAbiertas(copia)
      return
    }
    setCargandoEstadisticasId(financieraId)
    try {
      const { data } = await api.get<FinancieraEstadisticas>(`/financieras/${financieraId}/estadisticas`)
      setEstadisticasAbiertas({ ...estadisticasAbiertas, [financieraId]: data })
    } catch (err) {
      setError(apiErrorMessage(err, 'No se pudieron cargar las estadísticas'))
    } finally {
      setCargandoEstadisticasId(null)
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-navy-900">Financieras</h1>
        <div className="flex gap-2">
          <Link
            to="/administrador/financiadores"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Ver financiadores
          </Link>
          <button
            onClick={() => {
              setForm(FORM_VACIO)
              setError(null)
              setMostrarForm((v) => !v)
            }}
            className="rounded-md bg-emerald-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-accent-700"
          >
            {mostrarForm ? 'Cancelar' : 'Nueva financiera'}
          </button>
        </div>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {mostrarForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-3"
        >
          <input
            placeholder="Nombre"
            required
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-accent-500 focus:outline-none"
          />
          <input
            placeholder="CUIT (ej. 30-71234567-9)"
            required
            value={form.cuit}
            onChange={(e) => setForm({ ...form, cuit: e.target.value })}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-accent-500 focus:outline-none"
          />
          <input
            placeholder="Contacto"
            required
            value={form.contacto}
            onChange={(e) => setForm({ ...form, contacto: e.target.value })}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-accent-500 focus:outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-accent-500 focus:outline-none"
          />
          <input
            placeholder="Teléfono"
            required
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-accent-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={enviando}
            className="rounded-md bg-emerald-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-accent-700 disabled:opacity-50"
          >
            {enviando ? 'Guardando...' : 'Agregar financiera'}
          </button>
        </form>
      )}

      {cargando ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : financieras.length === 0 ? (
        <p className="text-sm text-slate-500">Todavía no hay financieras cargadas.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {financieras.map((f) => (
            <div key={f.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700">
                  {f.nombre} · CUIT {f.cuit} · {f.contacto}
                </span>
                <button
                  onClick={() => verEstadisticas(f.id)}
                  disabled={cargandoEstadisticasId === f.id}
                  className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                  {estadisticasAbiertas[f.id] ? 'Ocultar estadísticas' : 'Ver estadísticas'}
                </button>
              </div>
              {estadisticasAbiertas[f.id] && (
                <div className="mt-3 grid gap-2 border-t border-slate-100 pt-3 text-sm text-slate-600 sm:grid-cols-3">
                  <span>Préstamos originados: {estadisticasAbiertas[f.id].prestamos_originados}</span>
                  <span>Monto desembolsado: ${estadisticasAbiertas[f.id].monto_total_desembolsado}</span>
                  <span>
                    Financiadores:{' '}
                    {estadisticasAbiertas[f.id].financiadores.map((fdor) => fdor.nombre).join(', ') || '—'}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
