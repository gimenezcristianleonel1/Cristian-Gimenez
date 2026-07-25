import { Building2, Landmark, Users } from 'lucide-react'
import nosotrosFoto from '../../assets/nosotros-foto.jpg'

export function QuienesSomos() {
  return (
    <section id="nosotros" className="bg-textured py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <img
            src={nosotrosFoto}
            alt="Fundadores de Nexo Préstamos"
            className="mx-auto w-full max-w-md rounded-2xl object-cover shadow-lg shadow-navy-900/10 lg:max-w-none"
          />

          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-accent-50 px-4 py-1.5 text-xs font-semibold text-emerald-accent-700">
              Desde 2006
            </span>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
              ¿Quiénes somos?
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Somos una comercializadora que opera desde el 2006 en el mercado de créditos para
              trabajadores, jubilados y pensionados, empleados públicos y privados con relación de
              dependencia bancarizados, entre otros.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Contamos con varias financieras de alta trayectoria en nuestro país para satisfacer las
              necesidades de nuestros clientes. Estamos convencidos de que con nuestras acciones le
              damos continuidad a la idea que nos dio origen: dar soluciones económicas rápidas y
              fáciles a las necesidades actuales de nuestra comunidad.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
            <Landmark className="mx-auto h-6 w-6 text-emerald-accent-600" aria-hidden="true" />
            <p className="mt-2 text-sm font-medium text-navy-900">+20 años en el mercado</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
            <Users className="mx-auto h-6 w-6 text-emerald-accent-600" aria-hidden="true" />
            <p className="mt-2 text-sm font-medium text-navy-900">
              Trabajadores, jubilados y pensionados
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
            <Building2 className="mx-auto h-6 w-6 text-emerald-accent-600" aria-hidden="true" />
            <p className="mt-2 text-sm font-medium text-navy-900">Financieras de trayectoria</p>
          </div>
        </div>
      </div>
    </section>
  )
}
