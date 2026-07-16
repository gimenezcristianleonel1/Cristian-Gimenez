import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'
import { CreditSimulator } from './CreditSimulator'

interface HeroProps {
  onVerOfertas: (monto: number, cuotas: number) => void
}

export function Hero({ onVerOfertas }: HeroProps) {
  return (
    <section id="inicio" className="relative overflow-hidden bg-navy-950">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_theme(colors.navy.700),_transparent_55%)]"
      />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-emerald-accent-400">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Conectamos con financieras reguladas
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            El crédito que necesitás, con las mejores financieras del país
          </h1>
          <p className="mt-5 max-w-xl text-lg text-navy-100">
            No otorgamos créditos directamente: comparamos tu perfil contra nuestra red de financieras
            aliadas y te acercamos la mejor oferta disponible, sin costo por la evaluación.
          </p>
          <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8 text-white">
            <div>
              <dt className="text-2xl font-bold text-emerald-accent-400">+15</dt>
              <dd className="text-sm text-navy-200">Financieras aliadas</dd>
            </div>
            <div>
              <dt className="text-2xl font-bold text-emerald-accent-400">2 min</dt>
              <dd className="text-sm text-navy-200">Para solicitar</dd>
            </div>
            <div>
              <dt className="text-2xl font-bold text-emerald-accent-400">100%</dt>
              <dd className="text-sm text-navy-200">Online</dd>
            </div>
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
        >
          <CreditSimulator onVerOfertas={onVerOfertas} />
        </motion.div>
      </div>
    </section>
  )
}
