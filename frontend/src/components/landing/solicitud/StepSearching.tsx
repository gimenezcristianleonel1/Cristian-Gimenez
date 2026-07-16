import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const FINANCIERAS_CONSULTADAS = ['Financiera Norte', 'Capital Sur', 'Crédito Andino', 'Fondo Alfa']
const INTERVALO_MS = 700

interface StepSearchingProps {
  onFinalizado: () => void
}

export function StepSearching({ onFinalizado }: StepSearchingProps) {
  const [indice, setIndice] = useState(0)

  useEffect(() => {
    if (indice >= FINANCIERAS_CONSULTADAS.length) {
      const timeout = setTimeout(onFinalizado, 500)
      return () => clearTimeout(timeout)
    }
    const timeout = setTimeout(() => setIndice((i) => i + 1), INTERVALO_MS)
    return () => clearTimeout(timeout)
  }, [indice, onFinalizado])

  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center gap-6 py-8 text-center">
      <Loader2 className="h-10 w-10 animate-spin text-emerald-accent-600" aria-hidden="true" />
      <div>
        <p className="text-base font-semibold text-navy-900">Buscando las mejores ofertas para vos…</p>
        <p className="mt-1 text-sm text-slate-500">Estamos consultando a nuestra red de financieras aliadas.</p>
      </div>

      <ul className="flex w-full max-w-sm flex-col gap-2">
        {FINANCIERAS_CONSULTADAS.map((nombre, i) => {
          const consultada = i < indice
          const consultando = i === indice
          return (
            <motion.li
              key={nombre}
              initial={{ opacity: 0 }}
              animate={{ opacity: consultada || consultando ? 1 : 0.35 }}
              className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-2.5 text-sm"
            >
              <span className="text-slate-700">{nombre}</span>
              {consultada && <span className="text-xs font-medium text-emerald-accent-600">Listo</span>}
              {consultando && <span className="text-xs font-medium text-navy-500">Consultando…</span>}
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}
