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
        <p className="font-sans text-[12px] font-bold uppercase tracking-[0.16em] text-accent">
          Como funciona
        </p>
        <h2 className="mt-4 max-w-[20ch] font-display text-[clamp(2rem,4vw,2.75rem)] font-medium leading-[1.06] tracking-[-0.01em] text-ink">
          Três passos entre a dúvida e a resposta.
        </h2>

        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {STEPS.map((step) => (
            <div key={step.n}>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent font-mono text-[15px] font-medium tabular text-white">
                {step.n}
              </span>
              <h3 className="mt-6 font-display text-[24px] font-medium leading-tight text-ink">
                {step.title}
              </h3>
              <p className="mt-2.5 max-w-[40ch] text-[15.5px] leading-[1.6] text-stone">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
