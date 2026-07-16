import { MultiStepForm } from './solicitud/MultiStepForm'

interface SolicitudSectionProps {
  montoInicial: number
  cuotasInicial: number
}

export function SolicitudSection({ montoInicial, cuotasInicial }: SolicitudSectionProps) {
  return (
    <section id="solicitud" className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
            Solicitá tu crédito
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Completá estos tres pasos. Sin costo, sin compromiso.
          </p>
        </div>

        <div className="mt-12">
          <MultiStepForm montoInicial={montoInicial} cuotasInicial={cuotasInicial} />
        </div>
      </div>
    </section>
  )
}
