import { Container } from "@/components/ui/container"

const STEPS = [
  {
    n: "01",
    title: "Cole o contrato",
    body: "Texto colado ou PDF. Academia, plano de saúde, financiamento, telecom — sem cadastro de cartão.",
  },
  {
    n: "02",
    title: "Lemos cláusula por cláusula",
    body: "Cada trecho é confrontado com a legislação de consumo. Nada de leitura por amostragem.",
  },
  {
    n: "03",
    title: "Você recebe o veredito fundamentado",
    body: "As cláusulas abusivas marcadas, o artigo de lei que sustenta cada apontamento e o que fazer a respeito.",
  },
]

/** Como funciona: 3 etapas em linha (desktop) / empilhadas (mobile). Só tipografia + hairlines. */
export function HowItWorks() {
  return (
    <section id="como-funciona" className="border-b border-line bg-surface">
      <Container className="py-20 md:py-28">
        <header className="flex items-baseline gap-4">
          <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-accent">
            Como funciona
          </span>
          <span className="h-px flex-1 bg-line" />
        </header>

        <div className="mt-12 grid gap-px border-y border-line bg-line md:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.n}
              className="group relative overflow-hidden bg-surface px-6 pb-9 pt-8 md:px-8"
            >
              {/* Numeral-fantasma gigante (marca de revista) */}
              <span className="ghost-numeral pointer-events-none absolute -right-2 -top-6 text-[8rem] font-medium transition-colors duration-[250ms] group-hover:text-accent/15">
                {step.n}
              </span>
              <span className="relative font-mono text-[12px] uppercase tracking-[0.14em] text-accent">
                Etapa {step.n}
              </span>
              <h3 className="relative mt-6 font-display text-[26px] font-medium leading-tight text-ink">
                {step.title}
              </h3>
              <p className="relative mt-3 max-w-[40ch] text-[15px] leading-relaxed text-stone">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
