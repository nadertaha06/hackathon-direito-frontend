import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Wordmark } from "@/components/Wordmark"

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
  /** Rodapé com link de troca (ex: "Já tem conta? Entrar"). */
  footer: ReactNode
}

/**
 * Split-screen 50/50. Esquerda: painel editorial (citação tipográfica sobre
 * direito do consumidor). Direita: formulário sobre papel, ≤ 400px.
 * Mobile: o painel vira uma faixa curta acima do form. Sem ilustração, sem fx.
 */
export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen md:grid md:grid-cols-2">
      {/* Painel editorial */}
      <aside className="relative flex flex-col justify-between border-b border-line bg-surface px-6 py-8 md:border-b-0 md:border-r md:px-12 md:py-12">
        <Wordmark />

        <blockquote className="my-10 max-w-[24ch] md:my-0">
          <p className="font-display text-[clamp(1.75rem,3.5vw,3rem)] font-medium leading-[1.08] tracking-tight text-ink">
            “São nulas de pleno direito as cláusulas que coloquem o consumidor em
            desvantagem exagerada.”
          </p>
          <footer className="mt-6 font-mono text-[12px] uppercase tracking-[0.12em] text-accent">
            CDC · Lei 8.078/90, art. 51
          </footer>
        </blockquote>

        <p className="hidden font-mono text-[12px] text-mute md:block">
          Análise de contratos fundamentada na lei.
        </p>
      </aside>

      {/* Formulário */}
      <main className="flex flex-col bg-paper px-6 py-8 md:px-12 md:py-12">
        <div className="flex justify-end">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[13px] text-stone transition-colors duration-[250ms] hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            Início
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[400px]">
            <h1 className="font-display text-[clamp(2rem,4vw,2.5rem)] font-medium leading-tight tracking-tight text-ink">
              {title}
            </h1>
            <p className="mt-2 text-[15px] text-stone">{subtitle}</p>

            <div className="mt-9">{children}</div>

            <p className="mt-8 text-[14px] text-stone">{footer}</p>
          </div>
        </div>
      </main>
    </div>
  )
}
