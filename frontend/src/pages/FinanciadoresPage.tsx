import { useEffect, useState, type FormEvent } from 'react'
import { api, apiErrorMessage } from '../lib/api'
import type { Financiador, Financiera } from '../types'

interface FormState {
  financiera_id: string
  nombre: string
  contacto: string
  capital_aportado: string
  capital_disponible: string
  rendimiento_acordado: string
  observaciones: string
}

const FORM_VACIO: FormState = {
  financiera_id: '',
  nombre: '',
  contacto: '',
  capital_aportado: '',
  capital_disponible: '',
  rendimiento_acordado: '',
  observaciones: '',
}

export function FinanciadoresPage() {
  const [financiadores, setFinanciadores] = useState<Financiador[]>([])
  const [financieras, setFinancieras] = useState<Financiera[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [mostrarForm, setMostrarForm] = useState(false)
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [form, setForm] = useState<FormState>(FORM_VACIO)
  const [enviando, setEnviando] = useState(false)

  async function cargar() {
    setCargando(true)
    const [financiadoresRes, financierasRes] = await Promise.all([
      api.get<Financiador[]>('/financiadores'),
      api.get<Financiera[]>('/financieras'),
    ])
    setFinanciadores(financiadoresRes.data)
    setFinancieras(financierasRes.data)
    setCargando(false)
  }

  useEffect(() => {
    cargar()
  }, [])

  function nombreFinanciera(id: number): string {
    return financieras.find((f) => f.id === id)?.nombre ?? `Financiera #${id}`
  }

  function abrirAlta() {
    setEditandoId(null)
    setForm(FORM_VACIO)
    setError(null)
    setMostrarForm(true)
  }

  function abrirEdicion(f: Financiador) {
    setEditandoId(f.id)
    setForm({
      financiera_id: String(f.financiera_id),
      nombre: f.nombre,
      contacto: f.contacto,
      capital_aportado: f.capital_aportado,
      capital_disponible: f.capital_disponible,
      rendimiento_acordado: f.rendimiento_acordado,
      observaciones: f.observaciones ?? '',
    })
    setError(null)
    setMostrarForm(true)
  }

  function cerrarForm() {
    setMostrarForm(false)
    setEditandoId(null)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setEnviando(true)
    const payload = {
      financiera_id: Number(form.financiera_id),
      nombre: form.nombre,
      contacto: form.contacto,
      capital_aportado: Number(form.capital_aportado),
      capital_disponible: Number(form.capital_disponible),
      rendimiento_acordado: Number(form.rendimiento_acordado),
      observaciones: form.observaciones || null,
    }
    try {
      if (editandoId) {
        await api.put(`/financiadores/${editandoId}`, payload)
      } else {
        await api.post('/financiadores', payload)
      }
      cerrarForm()
      await cargar()
    } catch (err) {
      setError(apiErrorMessage(err, 'No se pudo guardar el financiador'))
    } finally {
      setEnviando(false)
    }
  }

  async function darDeBaja(id: number) {
    setError(null)
    try {
      await api.delete(`/financiadores/${id}`)
      await cargar()
    } catch (err) {
      setError(apiErrorMessage(err, 'No se pudo dar de baja el financiador'))
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-navy-900">Financiadores</h1>
        <button
          onClick={abrirAlta}
          className="rounded-md bg-emerald-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-accent-700"
        >
          Nuevo financiador
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {mostrarForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-3"
        >
          <select
            required
            value={form.financiera_id}
            onChange={(e) => setForm({ ...form, financiera_id: e.target.value })}
            className="rounded-md border border-slate-300 px-2 py-2 text-sm"
          >
            <option value="">Financiera</option>
            {financieras.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nombre}
              </option>
            ))}
          </select>
          <input
            placeholder="Nombre"
            required
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-accent-500 focus:outline-none"
          />
          <input
            placeholder="Contacto"
            required
            value={form.contacto}
            onChange={(e) => setForm({ ...form, contacto: e.target.value })}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-accent-500 focus:outline-none"
          />
          <div>
            <label className="mb-1 block text-xs text-slate-500">Capital aportado</label>
            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={form.capital_aportado}
              onChange={(e) => setForm({ ...form, capital_aportado: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-accent-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Capital disponible</label>
            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={form.capital_disponible}
              onChange={(e) => setForm({ ...form, capital_disponible: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-accent-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Rendimiento acordado (%)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={form.rendimiento_acordado}
              onChange={(e) => setForm({ ...form, rendimiento_acordado: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-accent-500 focus:outline-none"
            />
          </div>
          <div className="sm:col-span-3">
            <label className="mb-1 block text-xs text-slate-500">Observaciones</label>
            <textarea
              value={form.observaciones}
              onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
              rows={2}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-accent-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-2 sm:col-span-3">
            <button
              type="submit"
              disabled={enviando}
              className="rounded-md bg-emerald-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-accent-700 disabled:opacity-50"
            >
              {editandoId ? 'Guardar cambios' : 'Crear financiador'}
            </button>
            <button
              type="button"
              onClick={cerrarForm}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {cargando ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : financiadores.length === 0 ? (
        <p className="text-sm text-slate-500">Todavía no hay financiadores cargados.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Financiera</th>
                <th className="px-4 py-2">Contacto</th>
                <th className="px-4 py-2">Capital aportado</th>
                <th className="px-4 py-2">Capital disponible</th>
                <th className="px-4 py-2">Rendimiento</th>
                <th className="px-4 py-2">Fecha de alta</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {financiadores.map((f) => (
                <tr key={f.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-2 font-medium text-navy-900">{f.nombre}</td>
                  <td className="px-4 py-2 text-slate-600">{nombreFinanciera(f.financiera_id)}</td>
                  <td className="px-4 py-2 text-slate-600">{f.contacto}</td>
                  <td className="px-4 py-2 text-slate-600">${f.capital_aportado}</td>
                  <td className="px-4 py-2 text-slate-600">${f.capital_disponible}</td>
                  <td className="px-4 py-2 text-slate-600">{f.rendimiento_acordado}%</td>
                  <td className="px-4 py-2 text-slate-600">
                    {new Date(f.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        f.activo ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {f.activo ? 'Activo' : 'Baja'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => abrirEdicion(f)}
                        className="rounded-md border border-slate-300 px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-100"
                      >
                        Editar
                      </button>
                      {f.activo && (
                        <button
                          onClick={() => darDeBaja(f.id)}
                          className="rounded-md border border-red-300 px-2.5 py-1 text-xs text-red-700 hover:bg-red-50"
                        >
                          Dar de baja
                        </button>
                      )}
                    </div>
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
