import { cn } from "@/lib/utils"

export type LogoVariant = "ligature" | "seal" | "stamp"

interface LogoMarkProps {
  variant?: LogoVariant
  className?: string
  /** Rótulo acessível; o mark é decorativo por padrão. */
  title?: string
}

/**
 * Symbol mark do Contrato Justo. Três construções, todas em `currentColor`
 * — o consumidor define a cor (normalmente `text-accent`). Stroke 2px,
 * geometria reta, sem preenchimento decorativo.
 */
export function LogoMark({ variant = "seal", className, title }: LogoMarkProps) {
  const common = {
    viewBox: "0 0 32 32",
    className: cn("h-8 w-8", className),
    role: title ? "img" : "presentation",
    "aria-hidden": title ? undefined : true,
    "aria-label": title,
  } as const

  if (variant === "ligature") {
    // "CJ" ligado: o C abre à direita e o J nasce do seu terminal inferior,
    // compartilhando a vertical. Traço médio, registro de wordmark editorial.
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth={2}>
        {title && <title>{title}</title>}
        {/* C — arco aberto à direita, ocupando a esquerda */}
        <path d="M20 8.5A8 8 0 1 0 20 23.5" strokeLinecap="round" />
        {/* J — desce do terminal superior do C (traço compartilhado) e curva
            abaixo da linha de base, deixando o rabo legível */}
        <path d="M20 8v13.5a4.5 4.5 0 0 1-8.4 2.3" strokeLinecap="round" />
      </svg>
    )
  }

  if (variant === "stamp") {
    // Carimbo abstrato: círculo com linha horizontal cortando ao meio.
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth={2}>
        {title && <title>{title}</title>}
        <circle cx="16" cy="16" r="13" />
        <line x1="5" y1="16" x2="27" y2="16" />
      </svg>
    )
  }

  // "seal" (default) — selo cortado: quadrado com canto inferior-direito
  // chanfrado a 8px, iniciais CJ em mono no interior.
  return (
    <svg {...common} fill="none" stroke="currentColor" strokeWidth={2}>
      {title && <title>{title}</title>}
      <path d="M2 2h28v20l-8 8H2z" strokeLinejoin="miter" />
      <text
        x="15"
        y="20.5"
        textAnchor="middle"
        fontFamily="'Geist Mono', monospace"
        fontSize="11"
        fontWeight="500"
        fill="currentColor"
        stroke="none"
        letterSpacing="0.5"
      >
        CJ
      </text>
    </svg>
  )
}
