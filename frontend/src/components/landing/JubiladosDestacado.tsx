import { CheckCircle2, MessageCircle } from 'lucide-react'
import { TELEFONOS_ASESORES, linkWhatsapp } from '../../lib/contacto'
import jubiladosDniFoto from '../../assets/jubilados-dni-foto.jpg'

const BENEFICIOS = ['Solo necesitás tu DNI', 'Acreditación rápida', 'Atención personalizada para tu caso']

const MENSAJE = 'Hola, quiero consultar por el crédito para jubilados y pensionados de ANSES.'

export function JubiladosDestacado() {
  return (
    <section className="bg-emerald-accent-700 py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <img
          src={jubiladosDniFoto}
          alt="Jubilados y pensionados sonriendo"
          className="order-1 mx-auto w-full max-w-md rounded-2xl object-cover shadow-lg shadow-navy-950/20 lg:order-2 lg:max-w-none"
        />

        <div className="order-2 text-center lg:order-1 lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-white">
            Nuevo
          </span>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Créditos para Jubilados y Pensionados de ANSES
          </h2>
          <p className="mt-4 text-lg text-emerald-accent-50">
            Comercializamos en todo el país. Si sos jubilado o pensionado de ANSES, podés acceder a
            tu crédito presentando solamente tu DNI.
          </p>
          <ul className="mt-6 flex flex-col items-center gap-3 lg:items-start">
            {BENEFICIOS.map((beneficio) => (
              <li key={beneficio} className="flex items-center gap-2.5 text-white">
                <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
                {beneficio}
              </li>
            ))}
          </ul>
          <a
            href={linkWhatsapp(TELEFONOS_ASESORES[1].whatsappDigits, MENSAJE)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-base font-semibold text-emerald-accent-700 shadow-sm transition-colors hover:bg-emerald-accent-50"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
