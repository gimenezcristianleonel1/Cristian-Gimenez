import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api, apiErrorMessage } from '../lib/api'
import type { SimulacionResponse } from '../types'

export function SimuladorPage() {
  const [monto, setMonto] = useState('')
  const [tasa, setTasa] = useState('')
  const [cuotas, setCuotas] = useState('')
  const [resultado, setResultado] = useState<SimulacionResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setEnviando(true)
    try {
      const { data } = await api.post<SimulacionResponse>('/simulador/prestamos', {
        monto: Number(monto),
        tasa: Number(tasa),
        cantidad_cuotas: Number(cuotas),
      })
      setResultado(data)
    } catch (err) {
      setError(apiErrorMessage(err, 'No se pudo calcular la simulación'))
      setResultado(null)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-semibold text-slate-900">
            Nexo Préstamos
          </Link>
          <span className="text-sm text-slate-500">Simulador de préstamos</span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-1 text-2xl font-semibold text-slate-900">Simulador (sistema francés)</h1>
        <p className="mb-6 text-sm text-slate-500">
          Solo calcula valores de referencia. No solicita ni guarda ningún préstamo.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mb-8 grid gap-4 rounded-lg border border-slate-200 bg-white p-6 sm:grid-cols-3"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Monto</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              required
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Tasa por cuota (%)</label>
            <input
              type="number"
              min="0"
              step="0.0001"
              required
              value={tasa}
              onChange={(e) => setTasa(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Cantidad de cuotas</label>
            <input
              type="number"
              min="1"
              max="600"
              step="1"
              required
              value={cuotas}
              onChange={(e) => setCuotas(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          {error && <p className="text-sm text-red-600 sm:col-span-3">{error}</p>}
          <button
            type="submit"
            disabled={enviando}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 sm:col-span-3 sm:w-fit"
          >
            {enviando ? 'Calculando...' : 'Calcular'}
          </button>
        </form>

        {resultado && (
          <div className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase text-slate-500">Valor de cuota</p>
                <p className="text-xl font-semibold text-slate-900">${resultado.valor_cuota}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase text-slate-500">Interés total</p>
                <p className="text-xl font-semibold text-slate-900">${resultado.interes_total}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase text-slate-500">Monto final</p>
                <p className="text-xl font-semibold text-slate-900">${resultado.monto_final}</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-2">Cuota</th>
                    <th className="px-4 py-2">Valor cuota</th>
                    <th className="px-4 py-2">Interés</th>
                    <th className="px-4 py-2">Amortización</th>
                    <th className="px-4 py-2">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {resultado.tabla_amortizacion.map((c) => (
                    <tr key={c.numero_cuota} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-2 text-slate-600">{c.numero_cuota}</td>
                      <td className="px-4 py-2 text-slate-900">${c.cuota}</td>
                      <td className="px-4 py-2 text-slate-600">${c.interes}</td>
                      <td className="px-4 py-2 text-slate-600">${c.amortizacion}</td>
                      <td className="px-4 py-2 text-slate-600">${c.saldo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
