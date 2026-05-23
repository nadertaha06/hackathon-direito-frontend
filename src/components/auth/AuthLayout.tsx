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
 * Auth em split-screen no desktop, só formulário no mobile.
 *
 * - **md+**: 50/50. Painel editorial à esquerda (wordmark + citação) com bloco
 *   centralizado vertical e horizontalmente (largura controlada — não colado
 *   na borda). Formulário à direita.
 * - **<md**: o painel editorial some completamente — só o wordmark no topo e
 *   o formulário, conforme pedido.
 */
export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen md:grid md:grid-cols-2">
      {/* Painel editorial — só desktop */}
      <aside className="hidden border-r border-line bg-surface md:flex md:items-center md:justify-center md:px-12 md:py-16">
        <div className="w-full max-w-[34ch]">
          <Wordmark />

          <blockquote className="mt-14">
            <p className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-[1.12] tracking-[-0.01em] text-ink">
              “São nulas de pleno direito as cláusulas que coloquem o consumidor
              em desvantagem exagerada.”
            </p>
            <footer className="mt-6 font-mono text-[12px] uppercase tracking-[0.12em] text-accent">
              CDC · Lei 8.078/90, art. 51
            </footer>
          </blockquote>

          <p className="mt-16 font-mono text-[12px] text-mute">
            Análise de contratos fundamentada na lei.
          </p>
        </div>
      </aside>

      {/* Formulário */}
      <main className="flex flex-col bg-paper px-6 py-8 md:px-12 md:py-12">
        {/* Topo: wordmark (só mobile) + link de volta */}
        <div className="flex items-center justify-between md:justify-end">
          <Wordmark className="md:hidden" />
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[13px] text-stone transition-colors duration-200 hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            Início
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-10 md:py-6">
          <div className="w-full max-w-[400px]">
            <h1 className="font-display text-[clamp(2rem,4vw,2.5rem)] font-medium leading-tight tracking-[-0.01em] text-ink">
              {title}
            </h1>
            <p className="mt-2 text-[15px] text-stone">{subtitle}</p>

            <div className="mt-8">{children}</div>

            <p className="mt-8 text-[14px] text-stone">{footer}</p>
          </div>
        </div>
      </main>
    </div>
  )
}
