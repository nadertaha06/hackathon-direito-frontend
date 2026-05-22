import { Container } from "@/components/ui/container"

/**
 * Métricas reais devem vir do conjunto de avaliação — não são inventadas aqui.
 * Os valores ficam como slots ("—") até serem preenchidos com dados medidos.
 */
const METRICS = [
  { label: "Recall @ top-3", value: "—", note: "recuperação do dispositivo correto" },
  { label: "F1", value: "—", note: "precisão × cobertura na sinalização" },
  { label: "Latência média", value: "—", note: "por contrato analisado" },
]

const PRINCIPLES = [
  {
    title: "A lei não é gerada — é recuperada",
    body: "O modelo não escreve artigos de lei de memória. Cada apontamento busca o dispositivo num corpus jurídico curado e cita a fonte.",
  },
  {
    title: "Toda sinalização é rastreável",
    body: "Cláusula marcada vem com o trecho original, o artigo correspondente e o raciocínio. Você confere o porquê, não confia no palpite.",
  },
  {
    title: "Silêncio em vez de invenção",
    body: "Sem fundamento legal claro, a cláusula fica como “sem apontamento” — não fabricamos uma abusividade para preencher a tela.",
  },
]

/** Seção técnica (diferencial): anti-alucinação por construção. Bloco editorial. */
export function Auditable() {
  return (
    <section className="border-b border-line bg-ink text-paper" data-theme="dark">
      <Container className="grid gap-x-16 gap-y-12 py-20 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:py-28">
        <div className="max-w-[58ch]">
          <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-accent">
            Por construção
          </span>
          <h2 className="mt-5 font-display text-[clamp(2.25rem,4.5vw,3.25rem)] font-medium leading-[1.02] tracking-tight text-paper">
            Auditável. Sem alucinação.
          </h2>
          <p className="mt-6 max-w-[52ch] text-[17px] leading-relaxed text-stone">
            Um modelo que “acha” que uma cláusula é abusiva não serve para
            decisão jurídica. O nosso é construído para o contrário: não afirma o
            que não consegue fundamentar.
          </p>

          <dl className="mt-12 divide-y divide-line border-y border-line">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="py-6">
                <dt className="font-display text-[20px] font-medium text-paper">
                  {p.title}
                </dt>
                <dd className="mt-2 max-w-[56ch] text-[15px] leading-relaxed text-stone">
                  {p.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Painel de métricas (slots — preenchidos com avaliação real) */}
        <aside className="self-start border border-line">
          <p className="border-b border-line px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-stone">
            Avaliação
          </p>
          <div className="divide-y divide-line">
            {METRICS.map((m) => (
              <div key={m.label} className="px-5 py-5">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-stone">
                    {m.label}
                  </span>
                  <span className="font-mono text-[22px] tabular text-paper">{m.value}</span>
                </div>
                <p className="mt-1 text-[12px] text-mute">{m.note}</p>
              </div>
            ))}
          </div>
          <p className="border-t border-line px-5 py-3 font-mono text-[10px] leading-relaxed text-mute">
            // valores do conjunto de avaliação — a publicar
          </p>
        </aside>
      </Container>
    </section>
  )
}
