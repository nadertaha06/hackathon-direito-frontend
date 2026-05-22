import { useNavigate } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { Reveal } from "@/components/Reveal"
import { Button } from "@/components/ui/button"
import { Spotlight } from "@/components/fx/Spotlight"

/** Fecho com tipografia gigante — uma pergunta direta + CTA único. */
export function FinalCTA() {
  const navigate = useNavigate()

  return (
    <section className="relative overflow-hidden">
      <Spotlight color="rgba(232,179,117,0.16)" size={640} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_120%,rgba(232,179,117,0.12),transparent_60%)]"
      />

      <div className="mx-auto max-w-[88rem] px-5 py-28 text-center md:px-10 md:py-40">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-glow">
            §  o veredito
          </p>
          <h2 className="mx-auto mt-6 max-w-4xl font-display text-[2.6rem] font-bold leading-[1.02] tracking-[-0.02em] text-fg sm:text-6xl lg:text-7xl">
            O seu contrato é justo?
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-lg text-fg-muted">
            Descubra em menos de um minuto. É de graça e não precisa de advogado.
          </p>

          <div className="mt-10 flex justify-center">
            <Button size="lg" onClick={() => navigate("/cadastro")}>
              Analisar meu contrato agora
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2} />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
