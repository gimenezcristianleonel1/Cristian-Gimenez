import { Building2 } from 'lucide-react'

// Placeholders: en producción se reemplazan por los logos reales de cada financiera aliada.
const FINANCIERAS_PLACEHOLDER = [
  'Financiera Norte',
  'Capital Sur',
  'Crédito Andino',
  'Fondo Alfa',
  'Inversiones del Plata',
  'Financiera Delta',
]

export function Partners() {
  return (
    <section className="bg-slate-50 py-16 sm:py-20" aria-labelledby="alianzas-titulo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          id="alianzas-titulo"
          className="text-center text-sm font-semibold uppercase tracking-wide text-slate-500"
        >
          Trabajamos con las instituciones más seguras
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {FINANCIERAS_PLACEHOLDER.map((nombre) => (
            <div
              key={nombre}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-6 grayscale transition-all hover:grayscale-0"
            >
              <Building2 className="h-7 w-7 text-slate-400" aria-hidden="true" />
              <span className="text-center text-xs font-medium text-slate-500">{nombre}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
