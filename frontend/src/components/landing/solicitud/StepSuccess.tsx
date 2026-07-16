import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { PartyPopper } from 'lucide-react'
import { estimarCuota, formatearMonto } from '../../../lib/creditMath'
import type { OfertaPreliminar, SolicitudFormData } from './types'

const TASAS_MOCK = [
  { financiera: 'Capital Sur', tasa: 3.9 },
  { financiera: 'Financiera Norte', tasa: 4.3 },
  { financiera: 'Fondo Alfa', tasa: 4.8 },
]

interface StepSuccessProps {
  data: SolicitudFormData
}

export function StepSuccess({ data }: StepSuccessProps) {
  const ofertas: OfertaPreliminar[] = useMemo(
    () =>
      TASAS_MOCK.map(({ financiera, tasa }) => ({
        financiera,
        tasaMensualEstimada: tasa,
        cuotaEstimada: estimarCuota(data.monto, data.cuotas, tasa).cuotaMensual,
      })).sort((a, b) => a.cuotaEstimada - b.cuotaEstimada),
    [data.monto, data.cuotas],
  )

  return (
    <div className="flex flex-col items-center gap-6 py-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-accent-50">
        <PartyPopper className="h-8 w-8 text-emerald-accent-600" aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-navy-900">¡Tu solicitud fue recibida, {data.nombre.split(' ')[0]}!</h3>
        <p className="mt-1 max-w-md text-sm text-slate-600">
          {ofertas.length} financieras están evaluando tu perfil. Estas son ofertas preliminares de
          referencia: te contactaremos por email o teléfono para confirmar la definitiva.
        </p>
      </div>

      <ul className="flex w-full max-w-md flex-col gap-3 text-left">
        {ofertas.map((oferta, index) => (
          <motion.li
            key={oferta.financiera}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
          >
            <div>
              <p className="text-sm font-semibold text-navy-900">{oferta.financiera}</p>
              <p className="text-xs text-slate-500">Tasa estimada {oferta.tasaMensualEstimada}% mensual</p>
            </div>
            <p className="text-base font-bold text-emerald-accent-600">
              {formatearMonto(oferta.cuotaEstimada)}
              <span className="block text-right text-xs font-normal text-slate-400">por mes</span>
            </p>
          </motion.li>
        ))}
      </ul>

      <p className="text-xs text-slate-400">
        Oferta preliminar sujeta a evaluación final de cada financiera. No constituye un contrato de crédito.
      </p>
    </div>
  )
}
