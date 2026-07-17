export interface TelefonoAsesor {
  display: string
  telHref: string
  whatsappDigits: string
}

export const TELEFONOS_ASESORES: TelefonoAsesor[] = [
  { display: '+54 9 3731 63-0470', telHref: '+5493731630470', whatsappDigits: '5493731630470' },
  { display: '+54 9 3731 65-5835', telHref: '+5493731655835', whatsappDigits: '5493731655835' },
]

export function linkWhatsapp(digits: string, mensaje: string): string {
  return `https://wa.me/${digits}?text=${encodeURIComponent(mensaje)}`
}
