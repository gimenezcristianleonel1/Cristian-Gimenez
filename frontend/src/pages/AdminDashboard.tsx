import { useEffect, useState, type FormEvent } from 'react'
import { api, apiErrorMessage } from '../lib/api'
import type { Desembolso, Financiador, Prestamo } from '../types'

export function AdminDashboard() {
  const [prestamosAprobados, setPrestamosAprobados] = useState<Prestamo[]>([])
  const [financiadores, setFinanciadores] = useState<Financiador[]>([])
  const [desembolsos, setDesembolsos] = useState<Desembolso[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [nombreFinanciador, setNombreFinanciador] = useState('')
  const [contactoFinanciador, setContactoFinanciador] = useState('')
  const [creandoFinanciador, setCreandoFinanciador] = useState(false)

  const [financiadorSeleccionado, setFinanciadorSeleccionado] = useState<Record<number, string>>({})
  const [asignandoId, setAsignandoId] = useState<number | null>(null)

  const [montoDesembolso, setMontoDesembolso] = useState<Record<number, string>>({})
  const [metodoDesembolso, setMetodoDesembolso] = useState<Record<number, string>>({})
  const [desembolsandoId, setDesembolsandoId] = useState<number | null>(null)

  async function cargarTodo() {
    setCargando(true)
    const [prestamosRes, financiadoresRes, desembolsosRes] = await Promise.all([
      api.get<Prestamo[]>('/prestamos', { params: { estado: 'aprobado' } }),
      api.get<Financiador[]>('/financiadores'),
      api.get<Desembolso[]>('/desembolsos'),
    ])
    setPrestamosAprobados(prestamosRes.data)
    setFinanciadores(financiadoresRes.data)
    setDesembolsos(desembolsosRes.data)
    setCargando(false)
  }

  useEffect(() => {
    cargarTodo()
  }, [])

  async function crearFinanciador(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setCreandoFinanciador(true)
    try {
      await api.post('/financiadores', { nombre: nombreFinanciador, contacto: contactoFinanciador })
      setNombreFinanciador('')
      setContactoFinanciador('')
      await cargarTodo()
    } catch (err) {
      setError(apiErrorMessage(err, 'No se pudo crear el financiador'))
    } finally {
      setCreandoFinanciador(false)
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
      {error && <p className="text-sm text-red-600">{error}</p>}

      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Financiadores</h2>
        <form onSubmit={crearFinanciador} className="mb-4 grid gap-3 sm:grid-cols-3">
          <input
            placeholder="Nombre"
            required
            value={nombreFinanciador}
            onChange={(e) => setNombreFinanciador(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          <input
            placeholder="Contacto"
            required
            value={contactoFinanciador}
            onChange={(e) => setContactoFinanciador(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={creandoFinanciador}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Agregar financiador
          </button>
        </form>
        <ul className="flex flex-col gap-1 text-sm text-slate-700">
          {financiadores.map((f) => (
            <li key={f.id}>
              {f.nombre} — {f.contacto}
            </li>
          ))}
        </ul>
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
