import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { LogoMark, type LogoVariant } from "@/components/LogoMark"

interface WordmarkProps {
  className?: string
  /** Quando true, renderiza como <span> em vez de <Link> (ex: header de auth). */
  asText?: boolean
  /** Symbol mark a exibir. Default: selo cortado. */
  variant?: LogoVariant
  /** Esconde o mark e mostra só o texto. */
  markHidden?: boolean
}

/**
 * Logo "Contrato Justo": symbol mark em terracota + texto em Fraunces 500.
 * "Justo" recebe um sublinhado hairline no acento — sutileza tipográfica.
 */
export function Wordmark({
  className,
  asText = false,
  variant = "seal",
  markHidden = false,
}: WordmarkProps) {
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {!markHidden && <LogoMark variant={variant} className="h-7 w-7 text-accent" />}
      <span className="font-display text-[19px] font-medium leading-none tracking-tight text-ink">
        Contrato{" "}
        <span className="border-b border-accent pb-[1px] text-ink">Justo</span>
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
