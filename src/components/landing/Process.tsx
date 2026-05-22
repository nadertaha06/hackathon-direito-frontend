import { Reveal } from "@/components/Reveal"

const steps = [
  {
    k: "01",
    title: "Suba o PDF",
    body: "Telecom, academia, plano de saúde, aluguel. Qualquer contrato que você assinou — ou está prestes a assinar.",
  },
  {
    k: "02",
    title: "A IA lê cada linha",
    body: "Toda cláusula recebe um sinal — verde, âmbar ou vermelho — e o artigo da lei que a sustenta. Ou que ela viola.",
  },
  {
    k: "03",
    title: "Pergunte à vontade",
    body: "Converse sobre o resultado em linguagem normal. As respostas citam a lei de verdade, nunca chutam.",
  },
]

/** "Como funciona" como trilho vertical com números gigantes — não 3 cards. */
export function Process() {
  return (
    <section className="relative border-y border-white/8 bg-ink-2">
      <div className="mx-auto max-w-[88rem] px-5 py-24 md:px-10 md:py-32">
        <Reveal>
          <header className="flex items-baseline gap-4">
            <span className="font-mono text-sm text-glow">(04)</span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">
              Do PDF ao veredito em segundos
            </h2>
          </header>
        </Reveal>

        <div className="relative mt-16 pl-0 md:pl-4">
          {/* trilho vertical */}
          <span
            aria-hidden
            className="absolute left-[7px] top-2 bottom-2 hidden w-px bg-gradient-to-b from-glow/50 via-white/12 to-transparent md:block"
          />

          <ol className="space-y-14 md:space-y-20">
            {steps.map((s, i) => (
              <Reveal key={s.k} delay={i * 90}>
                <li className="relative grid grid-cols-1 gap-4 md:grid-cols-[auto_1fr] md:gap-12 md:pl-10">
                  {/* nó no trilho */}
                  <span
                    aria-hidden
                    className="absolute left-0 top-2.5 hidden h-3.5 w-3.5 -translate-x-[5px] rounded-full border-2 border-glow bg-ink md:block"
                  />

                  <div className="font-display text-6xl font-bold leading-none text-white/[0.07] md:text-8xl md:[writing-mode:vertical-rl] md:rotate-180">
                    {s.k}
                  </div>

                  <div className="max-w-xl md:pt-2">
                    <h3 className="font-display text-2xl font-semibold text-fg sm:text-3xl">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-lg leading-relaxed text-fg-muted">{s.body}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
