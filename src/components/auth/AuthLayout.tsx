import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { Wordmark } from "@/components/Wordmark"
import { AuroraBackground } from "@/components/fx/AuroraBackground"
import { GridBackground } from "@/components/fx/GridBackground"
import { Spotlight } from "@/components/fx/Spotlight"
import { BorderBeam } from "@/components/fx/BorderBeam"

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
  /** Rodapé com link de troca (ex: "Já tem conta? Entrar"). */
  footer: ReactNode
}

/** Layout escuro centrado para /login e /cadastro. Cartão de vidro com border-beam. */
export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  const reduce = useReducedMotion()

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-ink">
      <AuroraBackground />
      <GridBackground />
      <Spotlight />

      <header className="relative mx-auto flex w-full max-w-md items-center justify-between px-6 py-6">
        <Wordmark />
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-fg"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          Início
        </Link>
      </header>

      <main className="relative flex flex-1 items-center justify-center px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 18, scale: reduce ? 1 : 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <div className="text-center">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-fg">
              {title}
            </h1>
            <p className="mt-2 text-fg-muted">{subtitle}</p>
          </div>

          <div className="relative mt-8 overflow-hidden rounded-2xl border border-glass-border bg-glass p-6 shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_30px_60px_-25px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-8">
            <BorderBeam />
            <div className="relative">{children}</div>
          </div>

          <p className="mt-6 text-center text-sm text-fg-muted">{footer}</p>
        </motion.div>
      </main>
    </div>
  )
}
