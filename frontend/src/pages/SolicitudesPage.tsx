import { Fragment, useEffect, useState, type FormEvent } from 'react'
import { useStaffAuth } from '../auth/StaffAuthContext'
import { api, apiErrorMessage } from '../lib/api'
import { MOTIVOS_APROBACION, MOTIVOS_RECHAZO } from '../lib/motivosEvaluacion'
import type { Cliente, DecisionEvaluacion, EstadoPrestamo, Financiador, Prestamo } from '../types'

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
  const esAdministrador = staff?.rol === 'administrador'

  const [filtro, setFiltro] = useState<Filtro>('pendiente')
  const [solicitudes, setSolicitudes] = useState<Prestamo[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [financiadores, setFinanciadores] = useState<Financiador[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandidoId, setExpandidoId] = useState<number | null>(null)

  const [mostrarForm, setMostrarForm] = useState(false)
  const [form, setForm] = useState<FormState>(FORM_VACIO)
  const [enviando, setEnviando] = useState(false)

  const [observacionesEval, setObservacionesEval] = useState<Record<number, string>>({})
  const [financiadorSeleccionado, setFinanciadorSeleccionado] = useState<Record<number, string>>({})
  const [procesandoId, setProcesandoId] = useState<number | null>(null)

  const [seleccionadas, setSeleccionadas] = useState<Set<number>>(new Set())
  const [eliminando, setEliminando] = useState(false)

  async function cargar(f: Filtro) {
    setCargando(true)
    const { data } = await api.get<Prestamo[]>('/prestamos', { params: { estado: f } })
    setSolicitudes(data)
    setCargando(false)
  }

  useEffect(() => {
    cargar(filtro)
    setSeleccionadas(new Set())
  }, [filtro])

  useEffect(() => {
    if (esAdministrador) {
      api.get<Cliente[]>('/clientes').then(({ data }) => setClientes(data))
      api.get<Financiador[]>('/financiadores').then(({ data }) => setFinanciadores(data.filter((f) => f.activo)))
    }
  }, [esAdministrador])

  function nombreCliente(id: number): string {
    const cliente = clientes.find((c) => c.id === id)
    return cliente ? cliente.usuario.nombre : `Cliente #${id}`
  }

  function nombreFinanciador(id: number | null): string | null {
    if (id === null) return null
    return financiadores.find((f) => f.id === id)?.nombre ?? `Financiador #${id}`
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

  function alternarExpandido(id: number) {
    setError(null)
    setExpandidoId((actual) => (actual === id ? null : id))
  }

  async function evaluar(prestamoId: number, decision: DecisionEvaluacion) {
    setError(null)
    const texto = observacionesEval[prestamoId]?.trim()
    if (!texto || texto.length < 5) {
      setError('Escribí una observación de al menos 5 caracteres antes de decidir')
      return
    }
    setProcesandoId(prestamoId)
    try {
      await api.post(`/prestamos/${prestamoId}/evaluar`, { decision, observaciones: texto })
      setExpandidoId(null)
      await cargar(filtro)
    } catch (err) {
      setError(apiErrorMessage(err, 'No se pudo registrar la decisión'))
    } finally {
      setProcesandoId(null)
    }
  }

  function toggleSeleccionada(id: number) {
    setSeleccionadas((actual) => {
      const copia = new Set(actual)
      if (copia.has(id)) copia.delete(id)
      else copia.add(id)
      return copia
    })
  }

  function toggleSeleccionarTodas() {
    setSeleccionadas((actual) =>
      actual.size === solicitudes.length ? new Set() : new Set(solicitudes.map((s) => s.id)),
    )
  }

  async function eliminarSeleccionadas() {
    if (seleccionadas.size === 0) return
    if (
      !window.confirm(
        `¿Eliminar ${seleccionadas.size} solicitud${seleccionadas.size > 1 ? 'es' : ''} aprobada${
          seleccionadas.size > 1 ? 's' : ''
        }? Esta acción no se puede deshacer.`,
      )
    ) {
      return
    }
    setError(null)
    setEliminando(true)
    try {
      await Promise.all([...seleccionadas].map((id) => api.delete(`/prestamos/${id}`)))
      setSeleccionadas(new Set())
      await cargar(filtro)
    } catch (err) {
      setError(apiErrorMessage(err, 'No se pudieron eliminar algunas solicitudes'))
      await cargar(filtro)
    } finally {
      setEliminando(false)
    }
  }

  async function eliminarUna(id: number) {
    if (!window.confirm('¿Eliminar esta solicitud aprobada? Esta acción no se puede deshacer.')) return
    setError(null)
    try {
      await api.delete(`/prestamos/${id}`)
      setSeleccionadas((actual) => {
        const copia = new Set(actual)
        copia.delete(id)
        return copia
      })
      await cargar(filtro)
    } catch (err) {
      setError(apiErrorMessage(err, 'No se pudo eliminar la solicitud'))
    }
  }

  async function asignarFinanciador(prestamoId: number) {
    setError(null)
    const financiadorId = financiadorSeleccionado[prestamoId]
    if (!financiadorId) {
      setError('Elegí un financiador antes de asignar')
      return
    }
    setProcesandoId(prestamoId)
    try {
      await api.post('/financiadores/asignar', {
        prestamo_id: prestamoId,
        financiador_id: Number(financiadorId),
      })
      await cargar(filtro)
    } catch (err) {
      setError(apiErrorMessage(err, 'No se pudo asignar el financiador'))
    } finally {
      setProcesandoId(null)
    }
  }

  const puedeEliminar = esAdministrador && filtro === 'aprobado'

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-navy-900">Solicitudes</h1>
        {esAdministrador && (
          <button
            onClick={() => setMostrarForm((v) => !v)}
            className="rounded-md bg-emerald-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-accent-700"
          >
            {mostrarForm ? 'Cancelar' : 'Nueva solicitud'}
          </button>
        )}
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {mostrarForm && esAdministrador && (
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
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-accent-500 focus:outline-none"
          />
          <input
            type="number"
            min="1"
            max="360"
            placeholder="Cantidad de cuotas"
            required
            value={form.cantidad_cuotas}
            onChange={(e) => setForm({ ...form, cantidad_cuotas: e.target.value })}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-accent-500 focus:outline-none"
          />
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Tasa por cuota (%)"
            required
            value={form.tasa}
            onChange={(e) => setForm({ ...form, tasa: e.target.value })}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-accent-500 focus:outline-none"
          />
          <div className="sm:col-span-2">
            <input
              placeholder="Destino del préstamo"
              required
              minLength={5}
              value={form.destino}
              onChange={(e) => setForm({ ...form, destino: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-accent-500 focus:outline-none"
            />
          </div>
          <div className="sm:col-span-3">
            <textarea
              placeholder="Observaciones (opcional)"
              value={form.observaciones}
              onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
              rows={2}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-accent-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={enviando}
            className="rounded-md bg-emerald-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-accent-700 disabled:opacity-50 sm:col-span-3 sm:w-fit"
          >
            {enviando ? 'Guardando...' : 'Guardar solicitud'}
          </button>
        </form>
      )}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {FILTROS.map((f) => (
            <button
              key={f.valor}
              onClick={() => {
                setFiltro(f.valor)
                setExpandidoId(null)
              }}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                filtro === f.valor
                  ? 'bg-emerald-accent-600 text-white'
                  : 'border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {f.etiqueta}
            </button>
          ))}
        </div>
        {puedeEliminar && seleccionadas.size > 0 && (
          <button
            onClick={eliminarSeleccionadas}
            disabled={eliminando}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {eliminando ? 'Eliminando...' : `Eliminar seleccionadas (${seleccionadas.size})`}
          </button>
        )}
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
                {puedeEliminar && (
                  <th className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={seleccionadas.size === solicitudes.length}
                      onChange={toggleSeleccionarTodas}
                      aria-label="Seleccionar todas"
                      className="h-4 w-4 rounded border-slate-300"
                    />
                  </th>
                )}
                <th className="px-4 py-2">Cliente</th>
                <th className="px-4 py-2">Monto</th>
                <th className="px-4 py-2">Cuotas</th>
                <th className="px-4 py-2">Tasa</th>
                <th className="px-4 py-2">Destino</th>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.map((s) => (
                <Fragment key={s.id}>
                  <tr className="border-b border-slate-100 last:border-0">
                    {puedeEliminar && (
                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          checked={seleccionadas.has(s.id)}
                          onChange={() => toggleSeleccionada(s.id)}
                          aria-label={`Seleccionar solicitud de ${nombreCliente(s.cliente_id)}`}
                          className="h-4 w-4 rounded border-slate-300"
                        />
                      </td>
                    )}
                    <td className="px-4 py-2 font-medium text-navy-900">{nombreCliente(s.cliente_id)}</td>
                    <td className="px-4 py-2 text-slate-600">${s.monto_solicitado}</td>
                    <td className="px-4 py-2 text-slate-600">{s.cantidad_cuotas}</td>
                    <td className="px-4 py-2 text-slate-600">{s.tasa ? `${s.tasa}%` : '—'}</td>
                    <td className="px-4 py-2 text-slate-600">{s.destino}</td>
                    <td className="px-4 py-2 text-slate-600">
                      {new Date(s.fecha_solicitud).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ESTADO_COLOR[s.estado]}`}
                      >
                        {s.estado}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => alternarExpandido(s.id)}
                          className="rounded-md border border-slate-300 px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-100"
                        >
                          {expandidoId === s.id ? 'Ocultar' : 'Ver'}
                        </button>
                        {puedeEliminar && (
                          <button
                            onClick={() => eliminarUna(s.id)}
                            className="rounded-md border border-red-300 px-2.5 py-1 text-xs text-red-700 hover:bg-red-50"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandidoId === s.id && (
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <td colSpan={puedeEliminar ? 9 : 8} className="px-4 py-4">
                        <div className="flex flex-col gap-3 text-sm">
                          {s.observaciones && (
                            <p className="text-slate-600">
                              <span className="font-medium">Observaciones de la solicitud:</span>{' '}
                              {s.observaciones}
                            </p>
                          )}

                          {s.evaluacion && (
                            <p className="text-slate-600">
                              <span className="font-medium">
                                {s.estado === 'rechazado' ? 'Motivo del rechazo' : 'Observaciones de la decisión'}:
                              </span>{' '}
                              {s.evaluacion.observaciones} ·{' '}
                              {new Date(s.evaluacion.fecha_evaluacion).toLocaleString()}
                            </p>
                          )}

                          {s.estado === 'pendiente' && (
                            <div className="flex flex-col gap-2">
                              <div>
                                <p className="mb-1 text-xs font-medium text-slate-500">Motivos frecuentes:</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {MOTIVOS_APROBACION.map((motivo) => (
                                    <button
                                      key={motivo}
                                      type="button"
                                      onClick={() => setObservacionesEval({ ...observacionesEval, [s.id]: motivo })}
                                      className="rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 hover:bg-green-100"
                                    >
                                      {motivo}
                                    </button>
                                  ))}
                                  {MOTIVOS_RECHAZO.map((motivo) => (
                                    <button
                                      key={motivo}
                                      type="button"
                                      onClick={() => setObservacionesEval({ ...observacionesEval, [s.id]: motivo })}
                                      className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                                    >
                                      {motivo}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <textarea
                                placeholder="Observaciones de la decisión"
                                value={observacionesEval[s.id] ?? ''}
                                onChange={(e) =>
                                  setObservacionesEval({ ...observacionesEval, [s.id]: e.target.value })
                                }
                                rows={2}
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-accent-500 focus:outline-none"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => evaluar(s.id, 'aprobado')}
                                  disabled={procesandoId === s.id}
                                  className="rounded-md bg-green-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                                >
                                  Aprobar
                                </button>
                                <button
                                  onClick={() => evaluar(s.id, 'rechazado')}
                                  disabled={procesandoId === s.id}
                                  className="rounded-md bg-red-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                                >
                                  Rechazar
                                </button>
                              </div>
                            </div>
                          )}

                          {s.estado === 'aprobado' && s.financiador_id === null && esAdministrador && (
                            <div className="flex items-center gap-2">
                              <select
                                value={financiadorSeleccionado[s.id] ?? ''}
                                onChange={(e) =>
                                  setFinanciadorSeleccionado({
                                    ...financiadorSeleccionado,
                                    [s.id]: e.target.value,
                                  })
                                }
                                className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                              >
                                <option value="">Elegir financiador</option>
                                {financiadores.map((f) => (
                                  <option key={f.id} value={f.id}>
                                    {f.nombre} (disponible ${f.capital_disponible})
                                  </option>
                                ))}
                              </select>
                              <button
                                onClick={() => asignarFinanciador(s.id)}
                                disabled={procesandoId === s.id}
                                className="rounded-md bg-emerald-accent-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-accent-700 disabled:opacity-50"
                              >
                                Asignar financiador
                              </button>
                            </div>
                          )}

                          {s.financiador_id !== null && (
                            <p className="text-slate-600">
                              <span className="font-medium">Financiador asignado:</span>{' '}
                              {nombreFinanciador(s.financiador_id)}
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
