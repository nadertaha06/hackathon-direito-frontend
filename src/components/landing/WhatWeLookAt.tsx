import { Check } from "lucide-react"
import { Reveal } from "@/components/Reveal"

const items = [
  "Multas desproporcionais",
  "Cobranças não autorizadas",
  "Cláusulas que limitam seus direitos",
  "Renovação automática escondida",
  "Foro fora da sua cidade",
  "Reajustes de preço sem aviso",
  "Cancelamento dificultado de propósito",
]

export function WhatWeLookAt() {
  return (
    <section className="border-y border-white/8 bg-ink-2">
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-12 md:py-28">
        <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
          <Reveal>
            <div className="max-w-md">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                O que olhamos no seu contrato
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-fg-muted">
                As armadilhas mais comuns, em linguagem que você entende. Se
                tem algo torto, a gente aponta.
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-glow/15 ring-1 ring-glow/20">
                    <Check className="h-3 w-3 text-glow" strokeWidth={2.5} />
                  </span>
                  <span className="text-[15px] leading-relaxed text-fg/90">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
