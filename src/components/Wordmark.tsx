import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

interface WordmarkProps {
  className?: string
  /** Quando true, não envolve em <Link> (útil no header de páginas de auth). */
  asText?: boolean
}

/** Mark SVG: balança da justiça estilizada com gradiente âmbar e glow no hover. */
function LogoMark() {
  return (
    <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] shadow-[0_0_18px_-6px_rgba(232,179,117,0.6)] transition-all duration-300 group-hover:border-glow/40 group-hover:shadow-[0_0_24px_-4px_rgba(232,179,117,0.85)]">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5"
        aria-hidden="true"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <defs>
          <linearGradient id="cj-mark" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffcf8f" />
            <stop offset="1" stopColor="#d99a5b" />
          </linearGradient>
        </defs>
        <g stroke="url(#cj-mark)" strokeWidth="1.6">
          {/* haste central */}
          <path d="M12 3.5v17" />
          <path d="M6.5 20.5h11" />
          {/* travessa */}
          <path d="M5 7.5h14" />
          {/* pratos da balança */}
          <path d="M5 7.5 2.6 13a2.4 2.4 0 0 0 4.8 0L5 7.5Z" />
          <path d="M19 7.5 16.6 13a2.4 2.4 0 0 0 4.8 0L19 7.5Z" />
        </g>
        <circle cx="12" cy="5" r="1.6" fill="url(#cj-mark)" />
      </svg>
    </span>
  )
}

/**
 * Logo "Contrato Justo": mark da balança + texto. "Justo" recebe gradiente
 * âmbar com shimmer animado (efeito tech sutil).
 */
export function Wordmark({ className, asText = false }: WordmarkProps) {
  const content = (
    <span className={cn("group inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="font-display text-xl font-semibold tracking-tight text-fg">
        Contrato{" "}
        <span className="bg-[linear-gradient(110deg,#d99a5b,45%,#ffcf8f,55%,#d99a5b)] bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer">
          Justo
        </span>
      </span>
    </span>
  )

  if (asText) return content

  return (
    <Link to="/" aria-label="Contrato Justo — página inicial" className="inline-block">
      {content}
    </Link>
  )
}
