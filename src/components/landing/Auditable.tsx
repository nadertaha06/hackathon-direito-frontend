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

/**
 * Seção técnica (diferencial): anti-alucinação por construção.
 * Faixa navy de autoridade — cores explícitas sobre o fundo escuro (sem
 * inversão de tokens), garantindo legibilidade.
 */
export function Auditable() {
  return (
    <section className="bg-accent text-white">
      <Container className="grid gap-x-16 gap-y-12 py-20 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:py-28">
        <div className="max-w-[58ch]">
          <span className="font-sans text-[12px] font-bold uppercase tracking-[0.16em] text-gold-light">
            Por construção
          </span>
          <h2 className="mt-4 font-display text-[clamp(2.25rem,4.5vw,3.25rem)] font-medium leading-[1.04] tracking-[-0.01em] text-white">
            Auditável. Sem alucinação.
          </h2>
          <p className="mt-6 max-w-[52ch] text-[18px] leading-[1.6] text-white/75">
            Um modelo que “acha” que uma cláusula é abusiva não serve para
            decisão jurídica. O nosso é construído para o contrário: não afirma o
            que não consegue fundamentar.
          </p>

          <dl className="mt-12 divide-y divide-white/15 border-y border-white/15">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="py-6">
                <dt className="font-display text-[21px] font-medium text-white">
                  {p.title}
                </dt>
                <dd className="mt-2.5 max-w-[56ch] text-[15.5px] leading-[1.6] text-white/70">
                  {p.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Painel de métricas (slots — preenchidos com avaliação real) */}
        <aside className="self-start rounded-[var(--radius-card)] border border-white/20 bg-white/[0.04]">
          <p className="border-b border-white/15 px-5 py-3 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-white/60">
            Avaliação
          </p>
          <div className="divide-y divide-white/15">
            {METRICS.map((m) => (
              <div key={m.label} className="px-5 py-5">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-white/70">
                    {m.label}
                  </span>
                  <span className="font-mono text-[24px] tabular font-medium text-gold-light">
                    {m.value}
                  </span>
                </div>
                <p className="mt-1.5 text-[12.5px] leading-snug text-white/55">{m.note}</p>
              </div>
            ))}
          </div>
          <p className="border-t border-white/15 px-5 py-3 font-mono text-[10.5px] leading-relaxed text-white/45">
            // valores do conjunto de avaliação — a publicar
          </p>
        </aside>
      </Container>
    </section>
  )
}
