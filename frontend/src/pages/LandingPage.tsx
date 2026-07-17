import { useState } from 'react'
import { Navbar } from '../components/landing/Navbar'
import { Hero } from '../components/landing/Hero'
import { HowItWorks } from '../components/landing/HowItWorks'
import { Partners } from '../components/landing/Partners'
import { Requirements } from '../components/landing/Requirements'
import { Faq } from '../components/landing/Faq'
import { SolicitudSection } from '../components/landing/SolicitudSection'
import { Footer } from '../components/landing/Footer'
import { WhatsAppButton } from '../components/landing/WhatsAppButton'

export function LandingPage() {
  const [montoInicial, setMontoInicial] = useState(500_000)
  const [cuotasInicial, setCuotasInicial] = useState(12)

  function handleVerOfertas(monto: number, cuotas: number) {
    setMontoInicial(monto)
    setCuotasInicial(cuotas)
    document.getElementById('solicitud')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-textured">
      <Navbar />
      <main>
        <Hero onVerOfertas={handleVerOfertas} />
        <HowItWorks />
        <Partners />
        <Requirements />
        <SolicitudSection montoInicial={montoInicial} cuotasInicial={cuotasInicial} />
        <Faq />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
