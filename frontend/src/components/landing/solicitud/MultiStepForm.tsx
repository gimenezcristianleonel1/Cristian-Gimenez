import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { StepIndicator } from './StepIndicator'
import { StepCreditInfo } from './StepCreditInfo'
import { StepPersonalInfo } from './StepPersonalInfo'
import { StepWorkInfo } from './StepWorkInfo'
import { StepSearching } from './StepSearching'
import { StepSuccess } from './StepSuccess'
import { FORM_DATA_INICIAL, type SolicitudFormData } from './types'

type Paso = 1 | 2 | 3 | 4 | 5

interface MultiStepFormProps {
  montoInicial: number
  cuotasInicial: number
}

function esPasoValido(paso: Paso, data: SolicitudFormData): boolean {
  switch (paso) {
    case 1:
      return data.monto >= 50000 && data.destino !== ''
    case 2:
      return (
        data.nombre.trim().length > 2 &&
        data.dni.trim().length >= 7 &&
        /^\S+@\S+\.\S+$/.test(data.email) &&
        data.telefono.trim().length >= 6
      )
    case 3:
      return data.situacionLaboral !== '' && data.ingresosMensuales !== '' && data.ingresosMensuales > 0
    default:
      return true
  }
}

export function MultiStepForm({ montoInicial, cuotasInicial }: MultiStepFormProps) {
  const [paso, setPaso] = useState<Paso>(1)
  const [data, setData] = useState<SolicitudFormData>({
    ...FORM_DATA_INICIAL,
    monto: montoInicial,
    cuotas: cuotasInicial,
  })
  const [intentoAvanzar, setIntentoAvanzar] = useState(false)

  function actualizarData(patch: Partial<SolicitudFormData>) {
    setData((prev) => ({ ...prev, ...patch }))
  }

  function siguiente() {
    if (!esPasoValido(paso, data)) {
      setIntentoAvanzar(true)
      return
    }
    setIntentoAvanzar(false)
    setPaso((p) => Math.min(p + 1, 5) as Paso)
  }

  function anterior() {
    setIntentoAvanzar(false)
    setPaso((p) => Math.max(p - 1, 1) as Paso)
  }

  function enviar() {
    if (!esPasoValido(3, data)) {
      setIntentoAvanzar(true)
      return
    }
    setPaso(4)
  }

  return (
    <div className="mx-auto w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-navy-900/5 sm:p-10">
      {paso <= 3 && (
        <div className="mb-8">
          <StepIndicator pasoActual={paso} />
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={paso}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {paso === 1 && <StepCreditInfo data={data} onChange={actualizarData} />}
          {paso === 2 && <StepPersonalInfo data={data} onChange={actualizarData} />}
          {paso === 3 && <StepWorkInfo data={data} onChange={actualizarData} />}
          {paso === 4 && <StepSearching onFinalizado={() => setPaso(5)} />}
          {paso === 5 && <StepSuccess data={data} />}
        </motion.div>
      </AnimatePresence>

      {intentoAvanzar && paso <= 3 && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          Completá todos los campos correctamente antes de continuar.
        </p>
      )}

      {paso <= 3 && (
        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={anterior}
            disabled={paso === 1}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-slate-600 disabled:opacity-0"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver
          </button>

          {paso < 3 ? (
            <button
              type="button"
              onClick={siguiente}
              className="inline-flex items-center gap-1.5 rounded-full bg-navy-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
            >
              Continuar
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={enviar}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-accent-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-accent-700"
            >
              Enviar solicitud
            </button>
          )}
        </div>
      )}
    </div>
  )
}
