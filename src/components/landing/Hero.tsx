import { useNavigate } from "react-router-dom"
import { Button, ButtonArrow } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { ContractExhibit } from "./ContractExhibit"

/**
 * Hero assimétrico: coluna de texto à esquerda (≤ 60ch), exhibit do contrato à
 * direita. Navy + dourado, EB Garamond no título.
 */
export function Hero() {
  const navigate = useNavigate()

  return (
    <section className="border-b border-line">
      <Container>
        {/* Fólio superior — marca de documento */}
        <div className="flex items-center justify-between border-b border-line py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-mute">
          <span>Dossiê do consumidor</span>
          <span className="tabular">Ed. 01 · 2026</span>
        </div>

        <div className="grid items-center gap-x-16 gap-y-14 py-16 md:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] md:py-24">
          {/* Coluna editorial */}
          <div className="max-w-[60ch]">
            <p className="flex items-center gap-3 font-sans text-[12px] font-bold uppercase tracking-[0.16em] text-accent">
              <span className="h-px w-8 bg-accent" />
              Direito do consumidor
            </p>

            <h1 className="mt-7 font-display text-[clamp(3rem,6.5vw,4.75rem)] font-medium leading-[1.04] tracking-[-0.01em] text-ink">
              Sua próxima assinatura,{" "}
              <span className="italic-display text-accent">sob revisão.</span>
            </h1>

            <p className="mt-7 max-w-[52ch] text-[19px] leading-[1.6] text-stone">
              Cole o contrato — academia, plano de saúde, financiamento. Devolvemos
              cada cláusula abusiva marcada e o dispositivo legal que a sustenta.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Button size="lg" onClick={() => navigate("/cadastro")}>
                Analisar um contrato
                <ButtonArrow />
              </Button>
              <Button variant="secondary" size="lg" onClick={() => navigate("/login")}>
                Já tenho conta
              </Button>
            </div>

            <p className="mt-7 text-[13px] text-mute">
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
