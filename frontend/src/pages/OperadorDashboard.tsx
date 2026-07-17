import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, apiErrorMessage } from '../lib/api'
import { MOTIVOS_APROBACION, MOTIVOS_RECHAZO } from '../lib/motivosEvaluacion'
import type { DecisionEvaluacion, Prestamo } from '../types'

export function OperadorDashboard() {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [observaciones, setObservaciones] = useState<Record<number, string>>({})
  const [enviandoId, setEnviandoId] = useState<number | null>(null)

  async function cargar() {
    setCargando(true)
    const { data } = await api.get<Prestamo[]>('/prestamos', { params: { estado: 'pendiente' } })
    setPrestamos(data)
    setCargando(false)
  }

  useEffect(() => {
    cargar()
  }, [])

  async function evaluar(prestamoId: number, decision: DecisionEvaluacion) {
    setError(null)
    const texto = observaciones[prestamoId]?.trim()
    if (!texto || texto.length < 5) {
      setError('Escribí una observación de al menos 5 caracteres antes de evaluar')
      return
    }
    setEnviandoId(prestamoId)
    try {
      await api.post(`/prestamos/${prestamoId}/evaluar`, { decision, observaciones: texto })
      await cargar()
    } catch (err) {
      setError(apiErrorMessage(err, 'No se pudo registrar la evaluación'))
    } finally {
      setEnviandoId(null)
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-navy-900">Préstamos pendientes de evaluación</h2>
        <Link to="/solicitudes" className="text-sm text-emerald-accent-600 hover:underline">
          Ver todas las solicitudes
        </Link>
      </div>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      {cargando ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : prestamos.length === 0 ? (
        <p className="text-sm text-slate-500">No hay préstamos pendientes.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {prestamos.map((p) => (
            <div key={p.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-navy-900">
                  Cliente #{p.cliente_id} · ${p.monto_solicitado}
                </span>
                <span className="text-sm text-slate-500">{p.cantidad_cuotas} cuotas</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">{p.destino}</p>
              {p.tasa && <p className="mt-1 text-xs text-slate-400">Tasa propuesta: {p.tasa}%</p>}
              {p.observaciones && (
                <p className="mt-1 text-xs text-slate-400">Observaciones: {p.observaciones}</p>
              )}
              <div className="mt-3">
                <p className="mb-1 text-xs font-medium text-slate-500">Motivos frecuentes:</p>
                <div className="flex flex-wrap gap-1.5">
                  {MOTIVOS_APROBACION.map((motivo) => (
                    <button
                      key={motivo}
                      type="button"
                      onClick={() => setObservaciones({ ...observaciones, [p.id]: motivo })}
                      className="rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 hover:bg-green-100"
                    >
                      {motivo}
                    </button>
                  ))}
                  {MOTIVOS_RECHAZO.map((motivo) => (
                    <button
                      key={motivo}
                      type="button"
                      onClick={() => setObservaciones({ ...observaciones, [p.id]: motivo })}
                      className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                    >
                      {motivo}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                placeholder="Observaciones de la evaluación"
                value={observaciones[p.id] ?? ''}
                onChange={(e) => setObservaciones({ ...observaciones, [p.id]: e.target.value })}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-accent-500 focus:outline-none"
                rows={2}
              />
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => evaluar(p.id, 'aprobado')}
                  disabled={enviandoId === p.id}
                  className="rounded-md bg-green-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                >
                  Aprobar
                </button>
                <button
                  onClick={() => evaluar(p.id, 'rechazado')}
                  disabled={enviandoId === p.id}
                  className="rounded-md bg-red-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
