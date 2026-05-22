import { ArrowUpRight } from "lucide-react"
import { Reveal } from "@/components/Reveal"

const offenses = [
  { title: "Multas desproporcionais", where: "telecom · academia" },
  { title: "Cobranças que você nunca autorizou", where: "bancos · apps" },
  { title: "Renovação automática escondida", where: "streaming · seguros" },
  { title: "Foro de eleição em outra cidade", where: "financiamentos" },
  { title: "Reajuste de preço sem aviso", where: "planos de saúde" },
  { title: "Cancelamento dificultado de propósito", where: "internet · TV" },
  { title: "Cláusulas que limitam seus direitos", where: "qualquer contrato" },
]

/** "Lista dos procurados": padrões abusivos como um ledger numerado, não cards. */
export function RapSheet() {
  return (
    <section className="mx-auto max-w-[88rem] px-5 py-24 md:px-10 md:py-32">
      <Reveal>
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-sm text-glow">(03)</span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">
              O que entra na mira
            </h2>
          </div>
          <p className="max-w-sm font-mono text-xs uppercase leading-relaxed tracking-[0.16em] text-fg-muted md:text-right">
            os sete vícios mais comuns. se tiver, a gente acha.
          </p>
        </header>
      </Reveal>

      <ul className="mt-12 border-t border-white/10">
        {offenses.map((o, i) => (
          <Reveal key={o.title} delay={i * 55}>
            <li className="group relative flex items-center gap-5 border-b border-white/10 py-6 transition-colors duration-300 hover:bg-white/[0.025] md:gap-8 md:py-7">
              {/* faixa âmbar que cresce no hover */}
              <span className="absolute inset-y-0 left-0 w-0 bg-glow/60 transition-all duration-300 group-hover:w-[3px]" />

              <span className="w-10 shrink-0 font-mono text-sm text-fg-muted/50 transition-colors group-hover:text-glow">
                {String(i + 1).padStart(2, "0")}
              </span>

              <h3 className="flex-1 font-display text-xl font-semibold tracking-tight text-fg/90 transition-all duration-300 group-hover:translate-x-1 group-hover:text-fg sm:text-2xl md:text-[1.7rem]">
                {o.title}
              </h3>

              <span className="hidden shrink-0 font-mono text-[11px] uppercase tracking-[0.16em] text-fg-muted/60 sm:inline">
                {o.where}
              </span>

              <ArrowUpRight
                className="h-5 w-5 shrink-0 text-fg-muted/30 transition-all duration-300 group-hover:text-glow group-hover:opacity-100 md:opacity-0"
                strokeWidth={1.75}
              />
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
