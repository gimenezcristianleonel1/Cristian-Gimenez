import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api, apiErrorMessage } from '../lib/api'
import type { Prestamo } from '../types'

const ESTADO_LABEL: Record<Prestamo['estado'], string> = {
  pendiente: 'Pendiente',
  en_evaluacion: 'En evaluación',
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
  desembolsado: 'Desembolsado',
}

const ESTADO_COLOR: Record<Prestamo['estado'], string> = {
  pendiente: 'bg-amber-100 text-amber-800',
  en_evaluacion: 'bg-amber-100 text-amber-800',
  aprobado: 'bg-green-100 text-green-800',
  rechazado: 'bg-red-100 text-red-800',
  desembolsado: 'bg-blue-100 text-blue-800',
}

export function ClienteDashboard() {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([])
  const [cargando, setCargando] = useState(true)
  const [monto, setMonto] = useState('')
  const [cuotas, setCuotas] = useState('')
  const [destino, setDestino] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function cargarPrestamos() {
    setCargando(true)
    const { data } = await api.get<Prestamo[]>('/prestamos/me')
    setPrestamos(data)
    setCargando(false)
  }

  useEffect(() => {
    cargarPrestamos()
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setEnviando(true)
    try {
      await api.post('/prestamos', {
        monto_solicitado: Number(monto),
        cantidad_cuotas: Number(cuotas),
        destino,
      })
      setMonto('')
      setCuotas('')
      setDestino('')
      await cargarPrestamos()
    } catch (err) {
      setError(apiErrorMessage(err, 'No se pudo enviar la solicitud'))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Solicitar préstamo</h2>
          <Link to="/simulador" className="text-sm text-blue-600 hover:underline">
            Simular antes de solicitar
          </Link>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Monto solicitado</label>
            <input
              type="number"
              min="1"
              step="0.01"
              required
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Cantidad de cuotas</label>
            <input
              type="number"
              min="1"
              max="360"
              required
              value={cuotas}
              onChange={(e) => setCuotas(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Destino del préstamo</label>
            <textarea
              required
              minLength={5}
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              rows={3}
            />
          </div>
          {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
          <button
            type="submit"
            disabled={enviando}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 sm:col-span-2 sm:w-fit"
          >
            {enviando ? 'Enviando...' : 'Enviar solicitud'}
          </button>
        </form>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Mis préstamos</h2>
        {cargando ? (
          <p className="text-sm text-slate-500">Cargando...</p>
        ) : prestamos.length === 0 ? (
          <p className="text-sm text-slate-500">Todavía no solicitaste ningún préstamo.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {prestamos.map((p) => (
              <div key={p.id} className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-900">${p.monto_solicitado}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ESTADO_COLOR[p.estado]}`}>
                    {ESTADO_LABEL[p.estado]}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {p.cantidad_cuotas} cuotas · {p.destino}
                </p>
                {p.evaluacion && (
                  <p className="mt-2 text-sm text-slate-500">
                    Observaciones del operador: {p.evaluacion.observaciones}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
