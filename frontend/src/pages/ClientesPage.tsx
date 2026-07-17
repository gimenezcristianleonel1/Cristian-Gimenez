import { Fragment, useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { Cliente, EstadoPrestamo, Financiador, Financiera, Prestamo } from '../types'

const ESTADO_COLOR: Record<EstadoPrestamo, string> = {
  pendiente: 'bg-amber-100 text-amber-800',
  en_evaluacion: 'bg-amber-100 text-amber-800',
  aprobado: 'bg-green-100 text-green-800',
  rechazado: 'bg-red-100 text-red-800',
  desembolsado: 'bg-blue-100 text-blue-800',
}

export function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [prestamos, setPrestamos] = useState<Prestamo[]>([])
  const [financiadores, setFinanciadores] = useState<Financiador[]>([])
  const [financieras, setFinancieras] = useState<Financiera[]>([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [expandidoId, setExpandidoId] = useState<number | null>(null)

  useEffect(() => {
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
    cargar()
  }, [])

  function solicitudesDe(clienteId: number): Prestamo[] {
    return prestamos
      .filter((p) => p.cliente_id === clienteId)
      .sort((a, b) => b.id - a.id)
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

  const termino = busqueda.trim().toLowerCase()
  const clientesFiltrados = clientes.filter((c) => {
    if (!termino) return true
    return (
      c.usuario.nombre.toLowerCase().includes(termino) ||
      c.dni.toLowerCase().includes(termino) ||
      c.usuario.email.toLowerCase().includes(termino)
    )
  })

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-lg font-semibold text-slate-900">Clientes</h1>
        <input
          type="search"
          placeholder="Buscar por nombre, DNI o email"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-72 rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      {cargando ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : clientesFiltrados.length === 0 ? (
        <p className="text-sm text-slate-500">No se encontraron clientes.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">DNI</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Teléfono</th>
                <th className="px-4 py-2">Alta</th>
                <th className="px-4 py-2">Solicitudes</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.map((c) => {
                const solicitudes = solicitudesDe(c.id)
                return (
                  <Fragment key={c.id}>
                    <tr className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-2 font-medium text-slate-900">{c.usuario.nombre}</td>
                      <td className="px-4 py-2 text-slate-600">{c.dni}</td>
                      <td className="px-4 py-2 text-slate-600">{c.usuario.email}</td>
                      <td className="px-4 py-2 text-slate-600">{c.telefono}</td>
                      <td className="px-4 py-2 text-slate-600">
                        {new Date(c.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 text-slate-600">{solicitudes.length}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => alternarExpandido(c.id)}
                          disabled={solicitudes.length === 0}
                          className="rounded-md border border-slate-300 px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {expandidoId === c.id ? 'Ocultar' : 'Ver solicitudes'}
                        </button>
                      </td>
                    </tr>
                    {expandidoId === c.id && (
                      <tr className="border-b border-slate-100 bg-slate-50">
                        <td colSpan={7} className="px-4 py-4">
                          <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium text-slate-700">
                              Dirección: <span className="font-normal text-slate-600">{c.direccion}</span>
                            </p>
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
                                      <td className="px-3 py-2 text-slate-600">
                                        {new Date(s.fecha_solicitud).toLocaleDateString()}
                                      </td>
                                      <td className="px-3 py-2">
                                        <span
                                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ESTADO_COLOR[s.estado]}`}
                                        >
                                          {s.estado}
                                        </span>
                                      </td>
                                      <td className="px-3 py-2 text-slate-600">
                                        {s.financiador_id !== null ? (
                                          <>
                                            {nombreFinanciador(s.financiador_id)}
                                            {s.financiera_id !== null && ` (${nombreFinanciera(s.financiera_id)})`}
                                          </>
                                        ) : (
                                          '—'
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
