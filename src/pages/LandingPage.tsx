import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Hero } from "@/components/landing/Hero"
import { LawTicker } from "@/components/landing/LawTicker"
import { ClauseReveal } from "@/components/landing/ClauseReveal"
import { RapSheet } from "@/components/landing/RapSheet"
import { Process } from "@/components/landing/Process"
import { FinalCTA } from "@/components/landing/FinalCTA"

export function LandingPage() {
  return (
    <div className="min-h-screen bg-ink">
      <Header />
      <main>
        <Hero />
        <LawTicker />
        <ClauseReveal />
        <RapSheet />
        <Process />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
