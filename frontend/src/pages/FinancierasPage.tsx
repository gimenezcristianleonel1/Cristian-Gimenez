import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { api, apiErrorMessage } from '../lib/api'
import type { Financiera, FinancieraEstadisticas } from '../types'

interface FormState {
  nombre: string
  cuit: string
  contacto: string
  email: string
  telefono: string
}

type CampoOrden = 'nombre' | 'alta'
type Direccion = 'asc' | 'desc'
type FiltroEstado = 'todos' | 'activas' | 'inactivas'

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

  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('todos')
  const [orden, setOrden] = useState<{ campo: CampoOrden; direccion: Direccion }>({
    campo: 'nombre',
    direccion: 'asc',
  })

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

  function alternarOrden(campo: CampoOrden) {
    setOrden((actual) =>
      actual.campo === campo
        ? { campo, direccion: actual.direccion === 'asc' ? 'desc' : 'asc' }
        : { campo, direccion: 'asc' },
    )
  }

  function ordenarFinancieras(lista: Financiera[]): Financiera[] {
    const factor = orden.direccion === 'asc' ? 1 : -1
    return [...lista].sort((a, b) => {
      if (orden.campo === 'nombre') return a.nombre.localeCompare(b.nombre) * factor
      return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * factor
    })
  }

  function IconoOrden({ campo }: { campo: CampoOrden }) {
    if (orden.campo !== campo) return <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
    return orden.direccion === 'asc' ? (
      <ArrowUp className="h-3.5 w-3.5 text-emerald-accent-600" aria-hidden="true" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-emerald-accent-600" aria-hidden="true" />
    )
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold text-navy-900">Financieras</h1>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as FiltroEstado)}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-emerald-accent-500 focus:outline-none"
          >
            <option value="todos">Todos los estados</option>
            <option value="activas">Solo activas</option>
            <option value="inactivas">Solo inactivas</option>
          </select>
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
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            Ordenar por:
            <button
              onClick={() => alternarOrden('nombre')}
              className="ml-1 flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 hover:bg-slate-100"
            >
              Nombre <IconoOrden campo="nombre" />
            </button>
            <button
              onClick={() => alternarOrden('alta')}
              className="flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 hover:bg-slate-100"
            >
              Fecha de alta <IconoOrden campo="alta" />
            </button>
          </div>

          {(() => {
            const activas = ordenarFinancieras(financieras.filter((f) => f.activa))
            const inactivas = ordenarFinancieras(financieras.filter((f) => !f.activa))
            const grupos: { titulo: string | null; items: Financiera[] }[] =
              filtroEstado === 'activas'
                ? [{ titulo: null, items: activas }]
                : filtroEstado === 'inactivas'
                  ? [{ titulo: null, items: inactivas }]
                  : [
                      ...(activas.length > 0 ? [{ titulo: 'Activas', items: activas }] : []),
                      ...(inactivas.length > 0 ? [{ titulo: 'Inactivas', items: inactivas }] : []),
                    ]
            const totalVisible = grupos.reduce((acc, g) => acc + g.items.length, 0)

            if (totalVisible === 0) {
              return <p className="text-sm text-slate-500">No hay financieras en este estado.</p>
            }

            return grupos.map((grupo) => (
              <div key={grupo.titulo ?? 'todas'} className="flex flex-col gap-2">
                {grupo.titulo && (
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {grupo.titulo} ({grupo.items.length})
                  </p>
                )}
                {grupo.items.map((f) => (
                  <div key={f.id} className="rounded-lg border border-slate-200 bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm text-slate-700">
                        {f.nombre} · CUIT {f.cuit} · {f.contacto}
                        <span
                          className={`ml-2 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            f.activa ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {f.activa ? 'Activa' : 'Inactiva'}
                        </span>
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
            ))
          })()}
        </div>
      )}
    </div>
  )
}
