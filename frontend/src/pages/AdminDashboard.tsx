import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api, apiErrorMessage } from '../lib/api'
import type { Desembolso, Financiera, FinancieraEstadisticas, Financiador, Prestamo } from '../types'

export function AdminDashboard() {
  const [prestamosAprobados, setPrestamosAprobados] = useState<Prestamo[]>([])
  const [financieras, setFinancieras] = useState<Financiera[]>([])
  const [financiadores, setFinanciadores] = useState<Financiador[]>([])
  const [desembolsos, setDesembolsos] = useState<Desembolso[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [formFinanciera, setFormFinanciera] = useState({
    nombre: '',
    cuit: '',
    contacto: '',
    email: '',
    telefono: '',
  })
  const [creandoFinanciera, setCreandoFinanciera] = useState(false)
  const [estadisticasAbiertas, setEstadisticasAbiertas] = useState<Record<number, FinancieraEstadisticas>>({})
  const [cargandoEstadisticasId, setCargandoEstadisticasId] = useState<number | null>(null)

  const [financiadorSeleccionado, setFinanciadorSeleccionado] = useState<Record<number, string>>({})
  const [asignandoId, setAsignandoId] = useState<number | null>(null)

  const [montoDesembolso, setMontoDesembolso] = useState<Record<number, string>>({})
  const [metodoDesembolso, setMetodoDesembolso] = useState<Record<number, string>>({})
  const [desembolsandoId, setDesembolsandoId] = useState<number | null>(null)

  async function cargarTodo() {
    setCargando(true)
    const [prestamosRes, financierasRes, financiadoresRes, desembolsosRes] = await Promise.all([
      api.get<Prestamo[]>('/prestamos', { params: { estado: 'aprobado' } }),
      api.get<Financiera[]>('/financieras'),
      api.get<Financiador[]>('/financiadores'),
      api.get<Desembolso[]>('/desembolsos'),
    ])
    setPrestamosAprobados(prestamosRes.data)
    setFinancieras(financierasRes.data)
    setFinanciadores(financiadoresRes.data.filter((f) => f.activo))
    setDesembolsos(desembolsosRes.data)
    setCargando(false)
  }

  useEffect(() => {
    cargarTodo()
  }, [])

  async function crearFinanciera(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setCreandoFinanciera(true)
    try {
      await api.post('/financieras', formFinanciera)
      setFormFinanciera({ nombre: '', cuit: '', contacto: '', email: '', telefono: '' })
      await cargarTodo()
    } catch (err) {
      setError(apiErrorMessage(err, 'No se pudo crear la financiera'))
    } finally {
      setCreandoFinanciera(false)
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

  async function asignarFinanciador(prestamoId: number) {
    setError(null)
    const financiadorId = financiadorSeleccionado[prestamoId]
    if (!financiadorId) {
      setError('Elegí un financiador antes de asignar')
      return
    }
    setAsignandoId(prestamoId)
    try {
      await api.post('/financiadores/asignar', {
        prestamo_id: prestamoId,
        financiador_id: Number(financiadorId),
      })
      await cargarTodo()
    } catch (err) {
      setError(apiErrorMessage(err, 'No se pudo asignar el financiador'))
    } finally {
      setAsignandoId(null)
    }
  }

  async function registrarDesembolso(prestamoId: number, montoSolicitado: string) {
    setError(null)
    const monto = montoDesembolso[prestamoId] ?? montoSolicitado
    const metodo = metodoDesembolso[prestamoId]
    if (!monto || !metodo) {
      setError('Completá monto y método antes de registrar el desembolso')
      return
    }
    setDesembolsandoId(prestamoId)
    try {
      await api.post('/desembolsos', { prestamo_id: prestamoId, monto: Number(monto), metodo })
      await cargarTodo()
    } catch (err) {
      setError(apiErrorMessage(err, 'No se pudo registrar el desembolso'))
    } finally {
      setDesembolsandoId(null)
    }
  }

  if (cargando) return <p className="text-sm text-slate-500">Cargando...</p>

  const pendientesDeFinanciador = prestamosAprobados.filter((p) => p.financiador_id === null)
  const pendientesDeDesembolso = prestamosAprobados.filter((p) => p.financiador_id !== null)

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-end">
        <Link to="/solicitudes" className="text-sm text-blue-600 hover:underline">
          Ver todas las solicitudes
        </Link>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Financieras</h2>
        <form onSubmit={crearFinanciera} className="mb-4 grid gap-3 sm:grid-cols-3">
          <input
            placeholder="Nombre"
            required
            value={formFinanciera.nombre}
            onChange={(e) => setFormFinanciera({ ...formFinanciera, nombre: e.target.value })}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          <input
            placeholder="CUIT (ej. 30-71234567-9)"
            required
            value={formFinanciera.cuit}
            onChange={(e) => setFormFinanciera({ ...formFinanciera, cuit: e.target.value })}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          <input
            placeholder="Contacto"
            required
            value={formFinanciera.contacto}
            onChange={(e) => setFormFinanciera({ ...formFinanciera, contacto: e.target.value })}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={formFinanciera.email}
            onChange={(e) => setFormFinanciera({ ...formFinanciera, email: e.target.value })}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          <input
            placeholder="Teléfono"
            required
            value={formFinanciera.telefono}
            onChange={(e) => setFormFinanciera({ ...formFinanciera, telefono: e.target.value })}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={creandoFinanciera}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Agregar financiera
          </button>
        </form>
        <div className="flex flex-col gap-2">
          {financieras.map((f) => (
            <div key={f.id} className="rounded-md border border-slate-200 p-3">
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
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Financiadores</h2>
          <Link
            to="/administrador/financiadores"
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Administrar financiadores
          </Link>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Alta, edición, capital y rendimiento de cada financiador se gestionan en su propia pantalla.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Asignar financiador (préstamos aprobados)
        </h2>
        {pendientesDeFinanciador.length === 0 ? (
          <p className="text-sm text-slate-500">No hay préstamos esperando financiador.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {pendientesDeFinanciador.map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
                <span className="flex-1 text-sm text-slate-700">
                  Préstamo #{p.id} · Cliente #{p.cliente_id} · ${p.monto_solicitado}
                </span>
                <select
                  value={financiadorSeleccionado[p.id] ?? ''}
                  onChange={(e) =>
                    setFinanciadorSeleccionado({ ...financiadorSeleccionado, [p.id]: e.target.value })
                  }
                  className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                >
                  <option value="">Elegir financiador</option>
                  {financiadores.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nombre}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => asignarFinanciador(p.id)}
                  disabled={asignandoId === p.id}
                  className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  Asignar
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Registrar desembolso</h2>
        {pendientesDeDesembolso.length === 0 ? (
          <p className="text-sm text-slate-500">No hay préstamos listos para desembolsar.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {pendientesDeDesembolso.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
                <span className="flex-1 text-sm text-slate-700">
                  Préstamo #{p.id} · Cliente #{p.cliente_id} · Financiador #{p.financiador_id}
                </span>
                <input
                  type="number"
                  placeholder="Monto"
                  value={montoDesembolso[p.id] ?? p.monto_solicitado}
                  onChange={(e) => setMontoDesembolso({ ...montoDesembolso, [p.id]: e.target.value })}
                  className="w-28 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                />
                <input
                  placeholder="Método (ej. transferencia)"
                  value={metodoDesembolso[p.id] ?? ''}
                  onChange={(e) => setMetodoDesembolso({ ...metodoDesembolso, [p.id]: e.target.value })}
                  className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                />
                <button
                  onClick={() => registrarDesembolso(p.id, p.monto_solicitado)}
                  disabled={desembolsandoId === p.id}
                  className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                >
                  Desembolsar
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Historial de desembolsos</h2>
        {desembolsos.length === 0 ? (
          <p className="text-sm text-slate-500">Todavía no hay desembolsos registrados.</p>
        ) : (
          <div className="flex flex-col gap-2 text-sm text-slate-700">
            {desembolsos.map((d) => (
              <div key={d.id} className="rounded-lg border border-slate-200 bg-white p-3">
                Préstamo #{d.prestamo_id} · ${d.monto} · {d.metodo} ·{' '}
                {new Date(d.fecha_desembolso).toLocaleDateString()}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
