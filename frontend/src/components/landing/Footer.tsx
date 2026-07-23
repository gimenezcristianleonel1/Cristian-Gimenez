import { Link } from 'react-router-dom'
import { MessageCircle, Phone } from 'lucide-react'
import { TELEFONOS_ASESORES, linkWhatsapp } from '../../lib/contacto'
import nexoIcon from '../../assets/nexo-icon.png'

export function Footer() {
  const anio = new Date().getFullYear()

  return (
    <footer className="bg-navy-950 text-navy-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-white">
              <img src={nexoIcon} alt="" className="h-8 w-8" aria-hidden="true" />
              <span className="text-base font-bold">Nexo Préstamos</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-navy-300">
              Nexo Préstamos es un intermediario financiero. No otorgamos créditos directamente: conectamos
              solicitudes con financieras aliadas reguladas.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white">Hablá con un asesor</h3>
            <ul className="mt-4 flex flex-col gap-4">
              {TELEFONOS_ASESORES.map((tel) => (
                <li key={tel.display} className="flex flex-wrap items-center gap-3">
                  <a
                    href={`tel:${tel.telHref}`}
                    className="flex items-center gap-2 text-lg font-bold text-white hover:text-emerald-accent-400"
                  >
                    <Phone className="h-6 w-6 shrink-0 text-emerald-accent-400" aria-hidden="true" />
                    {tel.display}
                  </a>
                  <a
                    href={linkWhatsapp(tel.whatsappDigits, 'Hola, quiero hablar con un asesor sobre un crédito.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Escribir por WhatsApp al ${tel.display}`}
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-accent-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-accent-700"
                  >
                    <MessageCircle className="h-5 w-5" aria-hidden="true" />
                    WhatsApp
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Enlaces legales" className="flex flex-col gap-2 text-sm">
            <a href="/legal/privacidad" className="hover:text-white">
              Políticas de privacidad
            </a>
            <a href="/legal/terminos" className="hover:text-white">
              Términos y condiciones
            </a>
            <a href="/legal/tasas" className="hover:text-white">
              Información sobre tasas de interés
            </a>
            <Link to="/acceso" className="hover:text-white">
              Acceso staff / administrador
            </Link>
          </nav>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs leading-relaxed text-navy-400">
          <p>
            Nexo Préstamos actúa exclusivamente como intermediario entre solicitantes y financieras
            aliadas. Las tasas, montos y plazos finales son definidos por cada financiera según su
            propia política crediticia y pueden variar según el perfil evaluado. El simulador de esta
            página muestra valores estimados de referencia y no constituye una oferta vinculante.
          </p>
          <p className="mt-4">© {anio} Nexo Préstamos. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
