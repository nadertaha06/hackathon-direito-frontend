import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { ContractExhibit } from "./ContractExhibit"

/**
 * Hero assimétrico: coluna de texto à esquerda (medida ≤ 60ch), exhibit
 * tipográfico à direita. Régua-grid de papel ao fundo + ênfase em itálico
 * de Fraunces no acento — drama editorial, sem ilustração nem fx.
 */
export function Hero() {
  const navigate = useNavigate()

  return (
    <section className="relative overflow-hidden border-b border-line">
      {/* Textura de papel pautado, sutil, atrás de tudo */}
      <div aria-hidden className="paper-grid pointer-events-none absolute inset-0" />

      <Container className="relative">
        {/* Fólio superior — marca de documento */}
        <div className="flex items-center justify-between border-b border-line py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-mute">
          <span>Dossiê do consumidor</span>
          <span className="tabular">Ed. 01 · 2026</span>
        </div>

        <div className="grid items-center gap-x-16 gap-y-14 py-16 md:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] md:py-24">
          {/* Coluna editorial */}
          <div className="max-w-[60ch]">
            <p className="flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.16em] text-accent">
              <span className="h-px w-8 bg-accent" />
              Direito do consumidor
            </p>

            <h1 className="mt-7 font-display text-[clamp(3rem,6.5vw,5rem)] font-medium leading-[0.98] tracking-[-0.025em] text-ink">
              Sua próxima assinatura,{" "}
              <span className="italic-display text-accent">sob revisão.</span>
            </h1>

            <p className="mt-8 max-w-[50ch] text-[19px] leading-relaxed text-stone">
              Cole o contrato — academia, plano de saúde, financiamento. Devolvemos
              cada cláusula abusiva marcada e o dispositivo legal que a sustenta.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button size="lg" onClick={() => navigate("/cadastro")}>
                Analisar um contrato
              </Button>
              <Button size="lg" variant="secondary" onClick={() => navigate("/login")}>
                Já tenho conta
              </Button>
            </div>

            <p className="mt-8 font-mono text-[12px] text-mute">
              Sem cartão. Primeira análise gratuita.
            </p>
          </div>

          {/* Exhibit à direita */}
          <ContractExhibit />
        </div>
      </Container>
    </section>
  )
}
