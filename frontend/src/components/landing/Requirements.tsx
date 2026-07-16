import { CheckCircle2 } from 'lucide-react'

const REQUISITOS = [
  'Ser mayor de 18 años.',
  'DNI vigente.',
  'Ingresos demostrables (en relación de dependencia, autónomo o monotributista).',
  'Cuenta bancaria o billetera virtual a tu nombre.',
  'Residir en el país.',
]

export function Requirements() {
  return (
    <section id="requisitos" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
            Requisitos
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Estos son los requisitos generales para iniciar tu solicitud. Cada financiera aliada
            puede pedir información adicional durante la evaluación.
          </p>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {REQUISITOS.map((requisito) => (
            <li
              key={requisito}
              className="flex items-start gap-3 rounded-xl border border-slate-200 p-4"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-accent-600" aria-hidden="true" />
              <span className="text-sm text-slate-700">{requisito}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
