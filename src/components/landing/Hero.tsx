import { useNavigate } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { motion, useReducedMotion, type Variants } from "framer-motion"
import { Button } from "@/components/ui/button"
import { GridBackground } from "@/components/fx/GridBackground"
import { Spotlight } from "@/components/fx/Spotlight"
import { ExhibitDocument } from "./ExhibitDocument"

const tags = ["Grátis", "Sem juridiquês", "Fundamentado no CDC"]

export function Hero() {
  const navigate = useNavigate()
  const reduce = useReducedMotion()

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.09 } },
  }
  const up: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <section className="relative overflow-hidden">
      <GridBackground />
      <Spotlight />
      {/* vinheta superior fria + brilho âmbar único (sem blobs genéricos) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_50%_at_80%_-5%,rgba(232,179,117,0.10),transparent_55%)]"
      />

      <div className="mx-auto grid max-w-[88rem] grid-cols-1 items-center gap-y-16 px-5 pb-24 pt-32 md:px-10 md:pt-40 lg:grid-cols-12 lg:gap-x-10 lg:pb-32">
        {/* Bloco editorial — colunas 1–6 */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="lg:col-span-6 lg:pr-4 xl:pr-8"
        >
          <motion.div variants={up} className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-fg-muted">
            <span className="text-glow">§</span>
            cláusulas abusivas, expostas
            <span className="h-px w-10 bg-white/20" />
            <span className="text-fg-muted/50">01</span>
          </motion.div>

          <motion.h1
            variants={up}
            className="mt-7 font-display text-[2.7rem] font-bold leading-[0.98] tracking-[-0.02em] text-fg sm:text-6xl lg:text-[5.4rem]"
          >
            Tem cláusula
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">abusiva</span>
              {/* tarja vermelha sob a palavra */}
              <motion.span
                aria-hidden
                initial={{ scaleX: reduce ? 1 : 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1], delay: reduce ? 0 : 0.7 }}
                className="absolute inset-x-[-2px] bottom-[0.12em] z-0 h-[0.5em] origin-left -rotate-1 bg-signal-red-on-dark/30"
              />
            </span>{" "}
            escondida
            <br />
            no seu contrato.
          </motion.h1>

          <motion.p variants={up} className="mt-7 max-w-md text-lg leading-relaxed text-fg-muted">
            Suba o PDF. A gente lê as letras miúdas, marca o que é ilegal e
            explica em português — citando o artigo exato da lei.
          </motion.p>

          <motion.div variants={up} className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Button size="lg" onClick={() => navigate("/cadastro")}>
              Analisar meu contrato
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2} />
            </Button>
            <button
              onClick={() => navigate("/login")}
              className="font-mono text-xs uppercase tracking-widest text-fg-muted underline-offset-4 transition-colors hover:text-fg hover:underline"
            >
              ↳ já tenho conta
            </button>
          </motion.div>

          {/* régua de posicionamento — mono, sem métricas inventadas */}
          <motion.ul
            variants={up}
            className="mt-14 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/10 pt-7 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-muted"
          >
            {tags.map((t, i) => (
              <li key={t} className="flex items-center gap-5">
                {i > 0 && <span className="text-white/15">/</span>}
                <span className={i === 0 ? "text-fg" : undefined}>{t}</span>
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Exhibit — colunas 7–12, centralizado na metade direita */}
        <div className="flex justify-center lg:col-span-6">
          <ExhibitDocument />
        </div>
      </div>
    </section>
  )
}
