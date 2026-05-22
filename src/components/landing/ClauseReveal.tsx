import { motion, useReducedMotion } from "framer-motion"
import { ArrowDown } from "lucide-react"
import { Reveal } from "@/components/Reveal"

/**
 * Seção-assinatura: pega UMA cláusula real em juridiquês e a "traduz" para o
 * português, com o veredito e o artigo da lei. Mostra o valor do produto sem
 * cards genéricos — é uma peça editorial de comparação.
 */
export function ClauseReveal() {
  const reduce = useReducedMotion()

  return (
    <section className="relative border-y border-white/8 bg-ink-2">
      <div className="mx-auto max-w-[88rem] px-5 py-24 md:px-10 md:py-32">
        <Reveal>
          <header className="flex items-baseline gap-4">
            <span className="font-mono text-sm text-glow">(02)</span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">
              Do juridiquês ao português
            </h2>
          </header>
          <p className="mt-3 max-w-xl font-mono text-xs uppercase tracking-[0.18em] text-fg-muted">
            exemplo real · contrato de telecom · cláusula de fidelidade
          </p>
        </Reveal>

        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
          {/* ORIGINAL — denso, cinza, juridiquês */}
          <Reveal>
            <figure className="flex h-full flex-col rounded-xl border border-white/10 bg-[#0c0c11] p-7">
              <figcaption className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted/60">
                — Como está no contrato
              </figcaption>
              <p className="font-mono text-[13px] leading-[1.85] text-fg-muted">
                "Em caso de rescisão antecipada pelo CONTRATANTE antes do decurso
                do prazo de fidelização de 12 (doze) meses, será devida{" "}
                <mark className="bg-signal-red-on-dark/20 px-1 text-signal-red-on-dark decoration-signal-red-on-dark/60">
                  multa equivalente à integralidade das mensalidades vincendas
                </mark>{" "}
                até o termo final do período de permanência mínima, sem prejuízo
                dos valores já faturados."
              </p>
            </figure>
          </Reveal>

          {/* conector */}
          <div className="flex items-center justify-center">
            <motion.span
              initial={{ opacity: 0, scale: reduce ? 1 : 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.2 }}
              className="grid h-12 w-12 place-items-center rounded-full border border-glow/40 bg-glow/10 text-glow"
            >
              <ArrowDown className="h-5 w-5 lg:-rotate-90" strokeWidth={2} />
            </motion.span>
          </div>

          {/* TRADUÇÃO — grande, legível, com veredito */}
          <Reveal delay={120}>
            <figure className="flex h-full flex-col rounded-xl border border-glow/20 bg-gradient-to-b from-glow/[0.06] to-transparent p-7">
              <figcaption className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-glow/80">
                — O que isso significa
              </figcaption>
              <p className="font-display text-xl font-medium leading-snug text-fg sm:text-2xl">
                Se cancelar antes de 12 meses, querem cobrar{" "}
                <span className="text-signal-red-on-dark">todas as mensalidades que faltam de uma vez</span>.
                A multa tinha que ser proporcional ao tempo restante.
              </p>
              <div className="mt-auto flex flex-wrap items-center gap-3 pt-7">
                <span className="inline-flex items-center gap-2 rounded-md bg-signal-red-on-dark/15 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-signal-red-on-dark">
                  ● Abusiva
                </span>
                <span className="font-mono text-xs text-fg-muted">
                  Art. 51, IV e §1º — CDC
                </span>
              </div>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
