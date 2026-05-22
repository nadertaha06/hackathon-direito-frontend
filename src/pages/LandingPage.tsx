import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Hero } from "@/components/landing/Hero"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { WhatWeDetect } from "@/components/landing/WhatWeDetect"
import { Auditable } from "@/components/landing/Auditable"
import { ClosingCTA } from "@/components/landing/ClosingCTA"

export function LandingPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <WhatWeDetect />
        <Auditable />
        <ClosingCTA />
      </main>
      <Footer />
    </div>
  )
}
