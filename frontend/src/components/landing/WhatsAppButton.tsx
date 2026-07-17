import { MessageCircle } from 'lucide-react'
import { TELEFONOS_ASESORES, linkWhatsapp } from '../../lib/contacto'

const MENSAJE = 'Hola, quiero hablar con un asesor sobre un crédito.'

export function WhatsAppButton() {
  return (
    <a
      href={linkWhatsapp(TELEFONOS_ASESORES[0].whatsappDigits, MENSAJE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hablar con un asesor por WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-emerald-accent-600 py-3 pl-3 pr-3 text-white shadow-lg shadow-emerald-accent-600/30 transition-all hover:pr-5 hover:shadow-xl sm:bottom-6 sm:right-6"
    >
      <MessageCircle className="h-6 w-6 shrink-0" aria-hidden="true" />
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all group-hover:max-w-xs sm:inline">
        Hablar con un asesor
      </span>
    </a>
  )
}
