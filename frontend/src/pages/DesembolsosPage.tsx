import { useEffect, useState } from 'react'
import { api, apiErrorMessage } from '../lib/api'
import type { Desembolso, Prestamo } from '../types'

export function DesembolsosPage() {
  const [prestamosAprobados, setPrestamosAprobados] = useState<Prestamo[]>([])
  const [desembolsos, setDesembolsos] = useState<Desembolso[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [montoDesembolso, setMontoDesembolso] = useState<Record<number, string>>({})
  const [metodoDesembolso, setMetodoDesembolso] = useState<Record<number, string>>({})
  const [desembolsandoId, setDesembolsandoId] = useState<number | null>(null)

  async function cargar() {
    setCargando(true)
    const [prestamosRes, desembolsosRes] = await Promise.all([
      api.get<Prestamo[]>('/prestamos', { params: { estado: 'aprobado' } }),
      api.get<Desembolso[]>('/desembolsos'),
    ])
    setPrestamosAprobados(prestamosRes.data)
    setDesembolsos(desembolsosRes.data)
    setCargando(false)
  }

  useEffect(() => {
    cargar()
  }, [])

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
      await cargar()
    } catch (err) {
      setError(apiErrorMessage(err, 'No se pudo registrar el desembolso'))
    } finally {
      setDesembolsandoId(null)
    }
  }

  if (cargando) return <p className="text-sm text-slate-500">Cargando...</p>

  const pendientesDeDesembolso = prestamosAprobados.filter((p) => p.financiador_id !== null)

  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-lg font-semibold text-navy-900">Desembolsos</h1>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <section>
        <h2 className="mb-4 text-base font-semibold text-navy-900">Registrar desembolso</h2>
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
        <h2 className="mb-4 text-base font-semibold text-navy-900">Historial de desembolsos</h2>
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
