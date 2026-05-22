import { cn } from "@/lib/utils"

interface GridBackgroundProps {
  className?: string
  /** Pulso de opacidade sutil. Desligado por padrão para fundos densos. */
  animated?: boolean
}

/**
 * Grade de linhas finas com máscara radial (some nas bordas). Dá textura tech.
 * Decorativo (aria-hidden), atrás do conteúdo (-z-10).
 */
export function GridBackground({ className, animated = false }: GridBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10",
        "bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]",
        "bg-[size:56px_56px]",
        "[mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,#000_50%,transparent_100%)]",
        animated && "animate-grid-fade",
        className,
      )}
    />
  )
}
