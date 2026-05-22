import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Wordmark } from "./Wordmark"
import { Button } from "./ui/button"

/** Header fixo, estilo "dossiê": hairline superior + nav mono. Vira vidro ao rolar. */
export function Header() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300 " +
        (scrolled
          ? "bg-ink/80 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent border-b border-transparent")
      }
    >
      <div className="mx-auto flex h-16 max-w-[88rem] items-center justify-between px-5 md:px-10">
        <div className="flex items-center gap-4">
          <Wordmark />
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted/60 lg:inline">
            / análise de contratos
          </span>
        </div>

        <nav className="flex items-center gap-1.5 sm:gap-3" aria-label="Acesso">
          <button
            onClick={() => navigate("/login")}
            className="font-mono text-xs uppercase tracking-widest text-fg-muted transition-colors hover:text-fg"
          >
            entrar
          </button>
          <Button size="sm" onClick={() => navigate("/cadastro")}>
            Analisar contrato
          </Button>
        </nav>
      </div>
    </header>
  )
}
