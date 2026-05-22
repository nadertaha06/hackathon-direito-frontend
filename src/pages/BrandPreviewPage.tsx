import { Container } from "@/components/ui/container"
import { LogoMark, type LogoVariant } from "@/components/LogoMark"
import { Wordmark } from "@/components/Wordmark"

const VARIANTS: { id: LogoVariant; n: string; name: string; note: string }[] = [
  {
    id: "ligature",
    n: "01",
    name: "CJ ligado",
    note: "C aberto e J nascendo do mesmo traço. Registro de wordmark, mais caligráfico.",
  },
  {
    id: "seal",
    n: "02",
    name: "Selo cortado",
    note: "Quadrado com canto inferior-direito chanfrado a 8px. Iniciais em mono. Lê como carimbo de cartório.",
  },
  {
    id: "stamp",
    n: "03",
    name: "Carimbo abstrato",
    note: "Círculo bissectado por uma linha. Mínimo, abstrato, escala bem em favicon.",
  },
]

/** Página interna para escolher o symbol mark. Não linkada na navegação pública. */
export function BrandPreviewPage() {
  return (
    <div className="min-h-screen bg-paper py-20">
      <Container>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
          Brand — interno
        </p>
        <h1 className="mt-4 max-w-[18ch] font-display text-[clamp(2.5rem,6vw,3.5rem)] font-medium leading-[1.02] tracking-tight text-ink">
          Três marcas. Escolha uma.
        </h1>
        <p className="mt-4 max-w-[58ch] text-[16px] leading-relaxed text-stone">
          Cada variação do symbol mark em terracota sobre papel e, abaixo,
          invertida sobre tinta. O wordmark final combina o mark escolhido com
          “Contrato Justo” em Fraunces 500.
        </p>

        {/* Grade de variações */}
        <div className="mt-16 grid gap-px border border-line bg-line sm:grid-cols-3">
          {VARIANTS.map((v) => (
            <div key={v.id} className="bg-paper p-8">
              <span className="font-mono text-[12px] tabular text-mute">{v.n}</span>
              <div className="mt-8 flex items-center gap-8">
                <LogoMark variant={v.id} className="h-12 w-12 text-accent" />
                <div className="bg-ink p-4">
                  <LogoMark variant={v.id} className="h-10 w-10 text-paper" />
                </div>
              </div>
              <h2 className="mt-8 font-display text-[22px] font-medium text-ink">
                {v.name}
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-stone">{v.note}</p>
            </div>
          ))}
        </div>

        {/* Wordmark lockups */}
        <h3 className="mt-20 font-mono text-[12px] uppercase tracking-[0.16em] text-stone">
          Wordmark lockup
        </h3>
        <div className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-3">
          {VARIANTS.map((v) => (
            <div key={v.id} className="flex items-center bg-paper p-8">
              <Wordmark asText variant={v.id} />
            </div>
          ))}
        </div>

        {/* Escala / favicon */}
        <h3 className="mt-20 font-mono text-[12px] uppercase tracking-[0.16em] text-stone">
          Escala
        </h3>
        <div className="mt-6 flex flex-wrap items-end gap-10 border border-line bg-paper p-8">
          {VARIANTS.map((v) => (
            <div key={v.id} className="flex items-end gap-4">
              <LogoMark variant={v.id} className="h-8 w-8 text-accent" />
              <LogoMark variant={v.id} className="h-6 w-6 text-accent" />
              <LogoMark variant={v.id} className="h-4 w-4 text-accent" />
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}
