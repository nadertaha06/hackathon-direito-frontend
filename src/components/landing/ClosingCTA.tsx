import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"

/**
 * Fechamento como faixa terracota full-bleed — a âncora cromática da página.
 * Texto papel sobre o acento; CTA invertido (papel com texto terracota).
 */
export function ClosingCTA() {
  const navigate = useNavigate()

  return (
    <section className="bg-accent text-paper">
      <Container className="py-20 md:py-28">
        <p className="flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.16em] text-paper/70">
          <span className="h-px w-8 bg-paper/70" />
          Antes de assinar
        </p>

        <div className="mt-7 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-[18ch] font-display text-[clamp(2.5rem,5.5vw,4.25rem)] font-medium leading-[0.98] tracking-[-0.02em] text-paper">
            Leia com a lei <span className="italic-display">do seu lado.</span>
          </h2>

          <div className="shrink-0">
            <Button
              size="lg"
              onClick={() => navigate("/cadastro")}
              className="bg-paper text-accent hover:bg-paper/90"
            >
              Analisar um contrato
            </Button>
            <p className="mt-4 font-mono text-[12px] text-paper/70">
              Grátis · sem cartão
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
