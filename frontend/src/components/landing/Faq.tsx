import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'

const PREGUNTAS = [
  {
    pregunta: '¿Nexo Préstamos me otorga el crédito directamente?',
    respuesta:
      'No. Somos un intermediario: analizamos tu solicitud y te conectamos con la financiera aliada que mejor se ajusta a tu perfil. El contrato de crédito lo firmás directamente con esa financiera.',
  },
  {
    pregunta: '¿Tiene costo solicitar y comparar ofertas?',
    respuesta: 'No, evaluar tu solicitud y comparar ofertas entre financieras aliadas no tiene costo.',
  },
  {
    pregunta: '¿Cuánto tarda la evaluación?',
    respuesta:
      'La solicitud se completa en minutos. Los tiempos de evaluación varían según la financiera asignada.',
  },
  {
    pregunta: '¿Qué pasa si ninguna financiera aprueba mi solicitud?',
    respuesta:
      'Te lo comunicamos igual, de forma transparente, y te indicamos si podés volver a intentarlo más adelante.',
  },
]

export function Faq() {
  return (
    <section id="preguntas-frecuentes" className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
          Preguntas frecuentes
        </h2>

        <Accordion.Root type="single" collapsible className="mt-10 flex flex-col gap-3">
          {PREGUNTAS.map((item) => (
            <Accordion.Item
              key={item.pregunta}
              value={item.pregunta}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-navy-900">
                  {item.pregunta}
                  <ChevronDown
                    className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-data-[state=open]:rotate-180"
                    aria-hidden="true"
                  />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="px-5 pb-4 text-sm text-slate-600 data-[state=open]:animate-[fadeIn_0.2s_ease-out]">
                {item.respuesta}
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  )
}
