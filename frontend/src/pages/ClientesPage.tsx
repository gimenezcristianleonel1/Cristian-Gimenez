import { Fragment, useEffect, useState, type FormEvent } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { api, apiErrorMessage } from '../lib/api'
import type { Cliente, EstadoPrestamo, Financiador, Financiera, Prestamo } from '../types'

interface FormState {
  nombre: string
  email: string
  dni: string
  telefono: string
  direccion: string
}

type CampoOrden = 'nombre' | 'alta'
type Direccion = 'asc' | 'desc'
type FiltroEstado = 'todos' | 'activos' | 'baja'

const ESTADO_COLOR: Record<EstadoPrestamo, string> = {
  pendiente: 'bg-amber-100 text-amber-800',
  en_evaluacion: 'bg-amber-100 text-amber-800',
  aprobado: 'bg-green-100 text-green-800',
  rechazado: 'bg-red-100 text-red-800',
  desembolsado: 'bg-blue-100 text-blue-800',
}

interface GruposPorPeriodo {
  hoy: Prestamo[]
  semana: Prestamo[]
  mes: Prestamo[]
  anteriores: Prestamo[]
}

function agruparPorPeriodo(solicitudes: Prestamo[]): GruposPorPeriodo {
  const inicioHoy = new Date()
  inicioHoy.setHours(0, 0, 0, 0)
  const haceUnaSemana = new Date(inicioHoy)
  haceUnaSemana.setDate(haceUnaSemana.getDate() - 7)
  const inicioMes = new Date(inicioHoy.getFullYear(), inicioHoy.getMonth(), 1)

  const grupos: GruposPorPeriodo = { hoy: [], semana: [], mes: [], anteriores: [] }
  for (const s of solicitudes) {
    const fecha = new Date(s.fecha_solicitud)
    if (fecha >= inicioHoy) grupos.hoy.push(s)
    else if (fecha >= haceUnaSemana) grupos.semana.push(s)
    else if (fecha >= inicioMes) grupos.mes.push(s)
    else grupos.anteriores.push(s)
  }
  return grupos
}

export function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [prestamos, setPrestamos] = useState<Prestamo[]>([])
  const [financiadores, setFinanciadores] = useState<Financiador[]>([])
  const [financieras, setFinancieras] = useState<Financiera[]>([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [expandidoId, setExpandidoId] = useState<number | null>(null)
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('todos')
  const [orden, setOrden] = useState<{ campo: CampoOrden; direccion: Direccion }>({
    campo: 'nombre',
    direccion: 'asc',
  })

  const [editando, setEditando] = useState<Cliente | null>(null)
  const [form, setForm] = useState<FormState>({ nombre: '', email: '', dni: '', telefono: '', direccion: '' })
  const [guardando, setGuardando] = useState(false)
  const [errorForm, setErrorForm] = useState<string | null>(null)
  const [errorAccion, setErrorAccion] = useState<string | null>(null)

  async function cargar() {
    setCargando(true)
    const [clientesRes, prestamosRes, financiadoresRes, financierasRes] = await Promise.all([
      api.get<Cliente[]>('/clientes'),
      api.get<Prestamo[]>('/prestamos'),
      api.get<Financiador[]>('/financiadores'),
      api.get<Financiera[]>('/financieras'),
    ])
    setClientes(clientesRes.data)
    setPrestamos(prestamosRes.data)
    setFinanciadores(financiadoresRes.data)
    setFinancieras(financierasRes.data)
    setCargando(false)
  }

  useEffect(() => {
    cargar()
  }, [])

  function abrirEdicion(c: Cliente) {
    setEditando(c)
    setForm({
      nombre: c.usuario.nombre,
      email: c.usuario.email,
      dni: c.dni,
      telefono: c.telefono,
      direccion: c.direccion,
    })
    setErrorForm(null)
  }

  function cerrarEdicion() {
    setEditando(null)
  }

  async function handleGuardar(e: FormEvent) {
    e.preventDefault()
    if (!editando) return
    setErrorForm(null)
    setGuardando(true)
    try {
      await api.put(`/clientes/${editando.id}`, form)
      cerrarEdicion()
      await cargar()
    } catch (err) {
      setErrorForm(apiErrorMessage(err, 'No se pudo guardar el cliente'))
    } finally {
      setGuardando(false)
    }
  }

  async function eliminarCliente(c: Cliente) {
    if (!window.confirm(`¿Dar de baja a ${c.usuario.nombre}? No va a poder iniciar sesión, pero se conserva su historial.`)) {
      return
    }
    setErrorAccion(null)
    try {
      await api.delete(`/clientes/${c.id}`)
      await cargar()
    } catch (err) {
      setErrorAccion(apiErrorMessage(err, 'No se pudo dar de baja al cliente'))
    }
  }

  function solicitudesDe(clienteId: number): Prestamo[] {
    return prestamos.filter((p) => p.cliente_id === clienteId).sort((a, b) => b.id - a.id)
  }

  function nombreFinanciador(id: number | null): string | null {
    if (id === null) return null
    return financiadores.find((f) => f.id === id)?.nombre ?? `Financiador #${id}`
  }

  function nombreFinanciera(id: number | null): string | null {
    if (id === null) return null
    return financieras.find((f) => f.id === id)?.nombre ?? `Financiera #${id}`
  }

  function alternarExpandido(id: number) {
    setExpandidoId((actual) => (actual === id ? null : id))
  }

  function alternarOrden(campo: CampoOrden) {
    setOrden((actual) =>
      actual.campo === campo
        ? { campo, direccion: actual.direccion === 'asc' ? 'desc' : 'asc' }
        : { campo, direccion: 'asc' },
    )
  }

  function ordenarClientes(lista: Cliente[]): Cliente[] {
    const factor = orden.direccion === 'asc' ? 1 : -1
    return [...lista].sort((a, b) => {
      if (orden.campo === 'nombre') return a.usuario.nombre.localeCompare(b.usuario.nombre) * factor
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

  function otorgadoPor(s: Prestamo) {
    if (s.financiador_id === null) return '—'
    return (
      <>
        {nombreFinanciador(s.financiador_id)}
        {s.financiera_id !== null && ` (${nombreFinanciera(s.financiera_id)})`}
      </>
    )
  }

  function TablaSolicitudes({ solicitudes }: { solicitudes: Prestamo[] }) {
    return (
      <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Monto</th>
              <th className="px-3 py-2">Cuotas</th>
              <th className="px-3 py-2">Destino</th>
              <th className="px-3 py-2">Fecha</th>
              <th className="px-3 py-2">Estado</th>
              <th className="px-3 py-2">Otorgado por</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((s) => (
              <tr key={s.id} className="border-b border-slate-100 last:border-0">
                <td className="px-3 py-2 text-slate-700">${s.monto_solicitado}</td>
                <td className="px-3 py-2 text-slate-600">{s.cantidad_cuotas}</td>
                <td className="px-3 py-2 text-slate-600">{s.destino}</td>
                <td className="px-3 py-2 text-slate-600">{new Date(s.fecha_solicitud).toLocaleDateString()}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ESTADO_COLOR[s.estado]}`}>
                    {s.estado}
                  </span>
                </td>
                <td className="px-3 py-2 text-slate-600">{otorgadoPor(s)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const termino = busqueda.trim().toLowerCase()
  const clientesBuscados = clientes.filter((c) => {
    if (!termino) return true
    return (
      c.usuario.nombre.toLowerCase().includes(termino) ||
      c.dni.toLowerCase().includes(termino) ||
      c.usuario.email.toLowerCase().includes(termino)
    )
  })

  const activos = ordenarClientes(clientesBuscados.filter((c) => c.usuario.activo))
  const baja = ordenarClientes(clientesBuscados.filter((c) => !c.usuario.activo))

  const grupos: { titulo: string | null; clientes: Cliente[] }[] =
    filtroEstado === 'activos'
      ? [{ titulo: null, clientes: activos }]
      : filtroEstado === 'baja'
        ? [{ titulo: null, clientes: baja }]
        : [
            ...(activos.length > 0 ? [{ titulo: 'Activos', clientes: activos }] : []),
            ...(baja.length > 0 ? [{ titulo: 'Dados de baja', clientes: baja }] : []),
          ]

  const totalVisible = grupos.reduce((acc, g) => acc + g.clientes.length, 0)

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold text-navy-900">Clientes</h1>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as FiltroEstado)}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-emerald-accent-500 focus:outline-none"
          >
            <option value="todos">Todos los estados</option>
            <option value="activos">Solo activos</option>
            <option value="baja">Solo dados de baja</option>
          </select>
          <input
            type="search"
            placeholder="Buscar por nombre, DNI o email"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-72 rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-emerald-accent-500 focus:outline-none"
          />
        </div>
      </div>

      {errorAccion && <p className="mb-4 text-sm text-red-600">{errorAccion}</p>}

      {cargando ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : totalVisible === 0 ? (
        <p className="text-sm text-slate-500">No se encontraron clientes.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2">
                  <button
                    onClick={() => alternarOrden('nombre')}
                    className="flex items-center gap-1 hover:text-navy-700"
                  >
                    Nombre <IconoOrden campo="nombre" />
                  </button>
                </th>
                <th className="px-4 py-2">DNI</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Teléfono</th>
                <th className="px-4 py-2">
                  <button
                    onClick={() => alternarOrden('alta')}
                    className="flex items-center gap-1 hover:text-navy-700"
                  >
                    Alta <IconoOrden campo="alta" />
                  </button>
                </th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Solicitudes</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {grupos.map((grupo) => (
                <Fragment key={grupo.titulo ?? 'todos'}>
                  {grupo.titulo && (
                    <tr>
                      <td
                        colSpan={8}
                        className="bg-slate-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500"
                      >
                        {grupo.titulo} ({grupo.clientes.length})
                      </td>
                    </tr>
                  )}
                  {grupo.clientes.map((c) => {
                    const solicitudes = solicitudesDe(c.id)
                    const grupoSolicitudes = agruparPorPeriodo(solicitudes)
                    return (
                      <Fragment key={c.id}>
                        <tr className="border-b border-slate-100 last:border-0">
                          <td className="px-4 py-2 font-medium text-navy-900">{c.usuario.nombre}</td>
                          <td className="px-4 py-2 text-slate-600">{c.dni}</td>
                          <td className="px-4 py-2 text-slate-600">{c.usuario.email}</td>
                          <td className="px-4 py-2 text-slate-600">{c.telefono}</td>
                          <td className="px-4 py-2 text-slate-600">
                            {new Date(c.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                c.usuario.activo ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {c.usuario.activo ? 'Activo' : 'Baja'}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-slate-600">{solicitudes.length}</td>
                          <td className="px-4 py-2">
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => alternarExpandido(c.id)}
                                disabled={solicitudes.length === 0}
                                className="rounded-md border border-slate-300 px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                {expandidoId === c.id ? 'Ocultar' : 'Ver solicitudes'}
                              </button>
                              <button
                                onClick={() => abrirEdicion(c)}
                                className="rounded-md border border-slate-300 px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-100"
                              >
                                Editar
                              </button>
                              {c.usuario.activo && (
                                <button
                                  onClick={() => eliminarCliente(c)}
                                  className="rounded-md border border-red-300 px-2.5 py-1 text-xs text-red-700 hover:bg-red-50"
                                >
                                  Eliminar
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                        {expandidoId === c.id && (
                          <tr className="border-b border-slate-100 bg-slate-50">
                            <td colSpan={8} className="px-4 py-4">
                              <div className="flex flex-col gap-4">
                                <p className="text-sm font-medium text-slate-700">
                                  Dirección: <span className="font-normal text-slate-600">{c.direccion}</span>
                                </p>

                                {grupoSolicitudes.hoy.length > 0 && (
                                  <div>
                                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                      Hoy
                                    </p>
                                    <TablaSolicitudes solicitudes={grupoSolicitudes.hoy} />
                                  </div>
                                )}
                                {grupoSolicitudes.semana.length > 0 && (
                                  <div>
                                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                      Esta semana
                                    </p>
                                    <TablaSolicitudes solicitudes={grupoSolicitudes.semana} />
                                  </div>
                                )}
                                {grupoSolicitudes.mes.length > 0 && (
                                  <div>
                                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                      Este mes
                                    </p>
                                    <TablaSolicitudes solicitudes={grupoSolicitudes.mes} />
                                  </div>
                                )}
                                {grupoSolicitudes.anteriores.length > 0 && (
                                  <div>
                                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                      Anteriores
                                    </p>
                                    <TablaSolicitudes solicitudes={grupoSolicitudes.anteriores} />
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    )
                  })}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <h2 className="text-base font-semibold text-navy-900">Editar cliente</h2>
            <form onSubmit={handleGuardar} className="mt-4 flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs text-slate-500">Nombre</label>
                <input
                  required
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-accent-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-accent-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">DNI</label>
                <input
                  required
                  value={form.dni}
                  onChange={(e) => setForm({ ...form, dni: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-accent-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Teléfono</label>
                <input
                  required
                  value={form.telefono}
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-accent-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Dirección</label>
                <input
                  required
                  value={form.direccion}
                  onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-accent-500 focus:outline-none"
                />
              </div>

              {errorForm && <p className="text-sm text-red-600">{errorForm}</p>}

              <div className="mt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={guardando}
                  className="rounded-md bg-emerald-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-accent-700 disabled:opacity-50"
                >
                  Guardar cambios
                </button>
                <button
                  type="button"
                  onClick={cerrarEdicion}
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
