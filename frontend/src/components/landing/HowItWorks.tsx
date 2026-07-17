import { motion } from 'framer-motion'
import { FileEdit, Search, Wallet } from 'lucide-react'

const PASOS = [
  {
    icon: FileEdit,
    titulo: 'Completá tu solicitud en 2 minutos',
    descripcion: 'Contanos cuánto necesitás, para qué y algunos datos básicos. Sin papeleo.',
  },
  {
    icon: Search,
    titulo: 'Evaluamos tu perfil con nuestras financieras aliadas',
    descripcion: 'Tu solicitud se compara contra los criterios de cada financiera de la red.',
  },
  {
    icon: Wallet,
    titulo: 'Elegí la mejor oferta y recibí tu dinero',
    descripcion: 'Comparás condiciones y confirmás con la financiera que más te convenga.',
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-textured py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
            Cómo funciona
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Un proceso simple, pensado para que consigas la mejor opción sin perder tiempo.
          </p>
        </div>

        <ol className="mt-16 grid gap-8 sm:grid-cols-3">
          {PASOS.map((paso, index) => (
            <motion.li
              key={paso.titulo}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative rounded-2xl border border-slate-200 p-8 text-center"
            >
              <span
                className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-navy-900 px-3 py-1 text-xs font-bold text-white"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-accent-50">
                <paso.icon className="h-7 w-7 text-emerald-accent-600" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-navy-900">{paso.titulo}</h3>
              <p className="mt-2 text-sm text-slate-600">{paso.descripcion}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
