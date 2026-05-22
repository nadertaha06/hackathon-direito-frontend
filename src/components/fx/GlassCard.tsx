import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: ReactNode
  className?: string
}

/**
 * Superfície de vidro reutilizável: fundo translúcido, blur, borda sutil e
 * um realce interno no topo (luz). Base de cards e do cartão de auth.
 */
export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-glass-border bg-glass backdrop-blur-xl",
        "shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_20px_50px_-20px_rgba(0,0,0,0.6)]",
        className,
      )}
    >
      {children}
    </div>
  )
}
