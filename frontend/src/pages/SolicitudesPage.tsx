import { useEffect, useState, type FormEvent } from 'react'
import { useStaffAuth } from '../auth/StaffAuthContext'
import { api, apiErrorMessage } from '../lib/api'
import type { Cliente, EstadoPrestamo, Prestamo } from '../types'

type Filtro = 'pendiente' | 'aprobado' | 'rechazado'

const FILTROS: { valor: Filtro; etiqueta: string }[] = [
  { valor: 'pendiente', etiqueta: 'Pendientes' },
  { valor: 'aprobado', etiqueta: 'Aprobadas' },
  { valor: 'rechazado', etiqueta: 'Rechazadas' },
]

const ESTADO_COLOR: Record<EstadoPrestamo, string> = {
  pendiente: 'bg-amber-100 text-amber-800',
  en_evaluacion: 'bg-amber-100 text-amber-800',
  aprobado: 'bg-green-100 text-green-800',
  rechazado: 'bg-red-100 text-red-800',
  desembolsado: 'bg-blue-100 text-blue-800',
}

interface FormState {
  cliente_id: string
  monto_solicitado: string
  cantidad_cuotas: string
  tasa: string
  destino: string
  observaciones: string
}

const FORM_VACIO: FormState = {
  cliente_id: '',
  monto_solicitado: '',
  cantidad_cuotas: '',
  tasa: '',
  destino: '',
  observaciones: '',
}

export function SolicitudesPage() {
  const { staff } = useStaffAuth()
  const puedeCrear = staff?.rol === 'administrador'

  const [filtro, setFiltro] = useState<Filtro>('pendiente')
  const [solicitudes, setSolicitudes] = useState<Prestamo[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [mostrarForm, setMostrarForm] = useState(false)
  const [form, setForm] = useState<FormState>(FORM_VACIO)
  const [enviando, setEnviando] = useState(false)

  async function cargar(f: Filtro) {
    setCargando(true)
    const { data } = await api.get<Prestamo[]>('/prestamos', { params: { estado: f } })
    setSolicitudes(data)
    setCargando(false)
  }

  useEffect(() => {
    cargar(filtro)
  }, [filtro])

  useEffect(() => {
    if (puedeCrear) {
      api.get<Cliente[]>('/clientes').then(({ data }) => setClientes(data))
    }
  }, [puedeCrear])

  function nombreCliente(id: number): string {
    const cliente = clientes.find((c) => c.id === id)
    return cliente ? cliente.usuario.nombre : `Cliente #${id}`
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setEnviando(true)
    try {
      await api.post('/prestamos/solicitudes', {
        cliente_id: Number(form.cliente_id),
        monto_solicitado: Number(form.monto_solicitado),
        cantidad_cuotas: Number(form.cantidad_cuotas),
        tasa: Number(form.tasa),
        destino: form.destino,
        observaciones: form.observaciones || null,
      })
      setForm(FORM_VACIO)
      setMostrarForm(false)
      if (filtro === 'pendiente') await cargar('pendiente')
    } catch (err) {
      setError(apiErrorMessage(err, 'No se pudo guardar la solicitud'))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-900">Solicitudes</h1>
        {puedeCrear && (
          <button
            onClick={() => setMostrarForm((v) => !v)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {mostrarForm ? 'Cancelar' : 'Nueva solicitud'}
          </button>
        )}
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {mostrarForm && puedeCrear && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-3"
        >
          <select
            required
            value={form.cliente_id}
            onChange={(e) => setForm({ ...form, cliente_id: e.target.value })}
            className="rounded-md border border-slate-300 px-2 py-2 text-sm"
          >
            <option value="">Cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.usuario.nombre} · DNI {c.dni}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Monto"
            required
            value={form.monto_solicitado}
            onChange={(e) => setForm({ ...form, monto_solicitado: e.target.value })}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            min="1"
            max="360"
            placeholder="Cantidad de cuotas"
            required
            value={form.cantidad_cuotas}
            onChange={(e) => setForm({ ...form, cantidad_cuotas: e.target.value })}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Tasa por cuota (%)"
            required
            value={form.tasa}
            onChange={(e) => setForm({ ...form, tasa: e.target.value })}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          <div className="sm:col-span-2">
            <input
              placeholder="Destino del préstamo"
              required
              minLength={5}
              value={form.destino}
              onChange={(e) => setForm({ ...form, destino: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="sm:col-span-3">
            <textarea
              placeholder="Observaciones (opcional)"
              value={form.observaciones}
              onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
              rows={2}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={enviando}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 sm:col-span-3 sm:w-fit"
          >
            {enviando ? 'Guardando...' : 'Guardar solicitud'}
          </button>
        </form>
      )}

      <div className="mb-4 flex gap-2">
        {FILTROS.map((f) => (
          <button
            key={f.valor}
            onClick={() => setFiltro(f.valor)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              filtro === f.valor
                ? 'bg-blue-600 text-white'
                : 'border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {f.etiqueta}
          </button>
        ))}
      </div>

      {cargando ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : solicitudes.length === 0 ? (
        <p className="text-sm text-slate-500">No hay solicitudes en este estado.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2">Cliente</th>
                <th className="px-4 py-2">Monto</th>
                <th className="px-4 py-2">Cuotas</th>
                <th className="px-4 py-2">Tasa</th>
                <th className="px-4 py-2">Destino</th>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.map((s) => (
                <tr key={s.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-2 font-medium text-slate-900">{nombreCliente(s.cliente_id)}</td>
                  <td className="px-4 py-2 text-slate-600">${s.monto_solicitado}</td>
                  <td className="px-4 py-2 text-slate-600">{s.cantidad_cuotas}</td>
                  <td className="px-4 py-2 text-slate-600">{s.tasa ? `${s.tasa}%` : '—'}</td>
                  <td className="px-4 py-2 text-slate-600">{s.destino}</td>
                  <td className="px-4 py-2 text-slate-600">
                    {new Date(s.fecha_solicitud).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ESTADO_COLOR[s.estado]}`}>
                      {s.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
