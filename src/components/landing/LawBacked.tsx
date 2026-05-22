import { Scale } from "lucide-react"
import { Reveal } from "@/components/Reveal"

const citations = [
  "Art. 51, IV — Código de Defesa do Consumidor",
  "Súmula 302 — Superior Tribunal de Justiça",
  "Resolução 632 — Anatel",
]

export function LawBacked() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-24 md:px-12 md:py-28">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] shadow-[0_0_30px_-6px_rgba(232,179,117,0.5)]">
            <Scale className="h-6 w-6 text-glow" strokeWidth={1.6} />
          </span>
          <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            Fundamentado em lei de verdade
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-fg-muted">
            Cada veredito aponta o dispositivo exato — Código de Defesa do
            Consumidor, súmulas do STJ, resoluções de agências reguladoras.
            Isso não é chute. É a lei.
          </p>
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-3">
          {citations.map((c) => (
            <span
              key={c}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 font-mono text-xs leading-relaxed text-fg-muted transition-colors duration-200 hover:border-glow/30 hover:text-fg"
            >
              {c}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
