import { useNavigate } from "react-router-dom"
import { Button, ButtonArrow } from "@/components/ui/button"
import { Container } from "@/components/ui/container"

/** Fechamento editorial em superfície clara, com CTA dourado de conversão. */
export function ClosingCTA() {
  const navigate = useNavigate()

  return (
    <section className="border-t border-line bg-surface">
      <Container className="py-20 md:py-24">
        <p className="flex items-center gap-3 font-sans text-[12px] font-bold uppercase tracking-[0.16em] text-accent">
          <span className="h-px w-8 bg-accent" />
          Antes de assinar
        </p>

        <div className="mt-6 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-[18ch] font-display text-[clamp(2.5rem,5vw,4rem)] font-medium leading-[1.02] tracking-[-0.01em] text-ink">
            Leia com a lei <span className="italic-display text-accent">do seu lado.</span>
          </h2>

          <div className="shrink-0">
            <Button size="lg" onClick={() => navigate("/cadastro")}>
              Analisar um contrato
              <ButtonArrow />
            </Button>
            <p className="mt-4 text-[13px] text-mute">Grátis · sem cartão</p>
          </div>
        </div>
      </Container>
    </section>
  )
}
