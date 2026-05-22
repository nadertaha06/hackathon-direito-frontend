import { Upload, ScanText, MessagesSquare } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Reveal } from "@/components/Reveal"
import { GlassCard } from "@/components/fx/GlassCard"

interface Step {
  icon: LucideIcon
  title: string
  body: string
}

const steps: Step[] = [
  {
    icon: Upload,
    title: "Suba seu contrato",
    body: "Envie o PDF do contrato que você assinou ou está prestes a assinar. Telecom, academia, plano de saúde — qualquer um.",
  },
  {
    icon: ScanText,
    title: "Receba a análise",
    body: "Cada cláusula ganha um sinal: verde para justa, amarelo para revisar, vermelho para abusiva. Com resumo e pontos para negociar.",
  },
  {
    icon: MessagesSquare,
    title: "Tire dúvidas com a IA",
    body: "Converse sobre o resultado ou faça perguntas jurídicas. As respostas citam a lei de verdade, nunca chutam.",
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="mx-auto max-w-6xl px-6 py-24 md:px-12 md:py-28">
      <Reveal>
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            Como funciona
          </h2>
          <p className="mt-3 text-lg text-fg-muted">
            Três passos, alguns segundos. Sem cadastro complicado, sem advogado.
          </p>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 90}>
            <GlassCard className="group h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:border-glow/30 hover:shadow-[0_0_40px_-10px_rgba(232,179,117,0.4)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition-colors duration-300 group-hover:border-glow/40">
                <step.icon className="h-5 w-5 text-glow" strokeWidth={1.75} />
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-mono text-xs text-glow/70">0{i + 1}</span>
                <h3 className="font-display text-xl font-semibold text-fg">{step.title}</h3>
              </div>
              <p className="mt-2 text-[15px] leading-relaxed text-fg-muted">{step.body}</p>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
