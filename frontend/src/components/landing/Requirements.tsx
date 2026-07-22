import { CheckCircle2 } from 'lucide-react'

interface CategoriaRequisitos {
  titulo: string
  edad: string
  items: string[]
}

const CATEGORIAS: CategoriaRequisitos[] = [
  {
    titulo: 'Jubilados y Pensionados Nacionales',
    edad: '18 a 80 años',
    items: [
      'Argentino nativo o por opción.',
      'Cobrar los haberes en cualquier banco (consultar excluidos).',
      'Documento de Identidad.',
      'Acreditación de domicilio (factura o servicio a su nombre).',
      'Último recibo de haberes.',
      'Últimos tres meses de movimientos de la caja de ahorro donde se realizarán los débitos.',
      'Constancia original de CBU.',
    ],
  },
  {
    titulo: 'Empleados Privados (Mercado Abierto)',
    edad: '18 a 65 años',
    items: [
      'Argentino nativo o por opción.',
      'Cobrar los haberes en una entidad bancaria (consultar bancos excluidos).',
      'Documento de Identidad.',
      'Último recibo de haberes.',
      'Acreditación de domicilio (factura o servicio a su nombre).',
      'Constancia original de CBU.',
    ],
  },
  {
    titulo: 'Empleados Provinciales',
    edad: '18 a 75 años (mujeres) · 18 a 65 años (hombres)',
    items: [
      'Argentino nativo o por opción.',
      'Documento de Identidad.',
      'Acreditación de domicilio (factura o servicio a su nombre).',
      'Último recibo de haberes.',
      'Constancia original de CBU.',
    ],
  },
]

export function Requirements() {
  return (
    <section id="requisitos" className="bg-textured py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
            Requisitos
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Los requisitos varían según tu situación. Elegí la categoría que te corresponde.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {CATEGORIAS.map((categoria) => (
            <div key={categoria.titulo} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-navy-900">{categoria.titulo}</h3>
              <span className="mt-1 inline-block w-fit rounded-full bg-emerald-accent-50 px-3 py-1 text-xs font-medium text-emerald-accent-700">
                {categoria.edad}
              </span>
              <ul className="mt-4 flex flex-col gap-2.5">
                {categoria.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-accent-600" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          Cada financiera aliada puede pedir información adicional durante la evaluación.
        </p>
      </div>
    </section>
  )
}
