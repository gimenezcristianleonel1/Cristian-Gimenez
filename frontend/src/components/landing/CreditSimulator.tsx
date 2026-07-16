import { useMemo, useState } from 'react'
import * as Slider from '@radix-ui/react-slider'
import { estimarCuota, formatearMonto } from '../../lib/creditMath'

const MONTO_MIN = 50_000
const MONTO_MAX = 3_000_000
const MONTO_PASO = 10_000

const PLAZO_MIN = 3
const PLAZO_MAX = 48

interface CreditSimulatorProps {
  onVerOfertas: (monto: number, cuotas: number) => void
}

export function CreditSimulator({ onVerOfertas }: CreditSimulatorProps) {
  const [monto, setMonto] = useState(500_000)
  const [cuotas, setCuotas] = useState(12)

  const estimacion = useMemo(() => estimarCuota(monto, cuotas), [monto, cuotas])

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-navy-900/5 sm:p-8">
      <h2 className="text-base font-semibold text-navy-900">Simulá tu crédito</h2>

      <div className="mt-6 flex flex-col gap-6">
        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="slider-monto" className="text-sm font-medium text-slate-600">
              Monto
            </label>
            <span className="text-lg font-bold text-navy-900">{formatearMonto(monto)}</span>
          </div>
          <Slider.Root
            id="slider-monto"
            className="relative mt-3 flex h-5 w-full touch-none items-center"
            min={MONTO_MIN}
            max={MONTO_MAX}
            step={MONTO_PASO}
            value={[monto]}
            onValueChange={([v]) => setMonto(v)}
            aria-label="Monto del crédito"
          >
            <Slider.Track className="relative h-1.5 w-full grow rounded-full bg-slate-200">
              <Slider.Range className="absolute h-full rounded-full bg-emerald-accent-600" />
            </Slider.Track>
            <Slider.Thumb className="block h-5 w-5 rounded-full border-2 border-emerald-accent-600 bg-white shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-accent-100" />
          </Slider.Root>
          <div className="mt-1 flex justify-between text-xs text-slate-400">
            <span>{formatearMonto(MONTO_MIN)}</span>
            <span>{formatearMonto(MONTO_MAX)}</span>
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="slider-plazo" className="text-sm font-medium text-slate-600">
              Plazo
            </label>
            <span className="text-lg font-bold text-navy-900">{cuotas} meses</span>
          </div>
          <Slider.Root
            id="slider-plazo"
            className="relative mt-3 flex h-5 w-full touch-none items-center"
            min={PLAZO_MIN}
            max={PLAZO_MAX}
            step={1}
            value={[cuotas]}
            onValueChange={([v]) => setCuotas(v)}
            aria-label="Plazo en cuotas"
          >
            <Slider.Track className="relative h-1.5 w-full grow rounded-full bg-slate-200">
              <Slider.Range className="absolute h-full rounded-full bg-emerald-accent-600" />
            </Slider.Track>
            <Slider.Thumb className="block h-5 w-5 rounded-full border-2 border-emerald-accent-600 bg-white shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-accent-100" />
          </Slider.Root>
          <div className="mt-1 flex justify-between text-xs text-slate-400">
            <span>{PLAZO_MIN} meses</span>
            <span>{PLAZO_MAX} meses</span>
          </div>
        </div>

        <div className="rounded-xl bg-navy-900 p-5 text-white">
          <p className="text-xs font-medium uppercase tracking-wide text-navy-200">Pago mensual estimado</p>
          <p className="mt-1 text-3xl font-extrabold text-emerald-accent-400">
            {formatearMonto(estimacion.cuotaMensual)}
          </p>
          <p className="mt-2 text-xs text-navy-200">
            Estimación de referencia. La tasa y cuota final dependen de la financiera que te asigne.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onVerOfertas(monto, cuotas)}
          className="w-full rounded-full bg-emerald-accent-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-emerald-accent-700"
        >
          Ver ofertas disponibles
        </button>
      </div>
    </div>
  )
}
