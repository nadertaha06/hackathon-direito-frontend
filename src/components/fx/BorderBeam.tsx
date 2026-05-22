import { cn } from "@/lib/utils"

interface BorderBeamProps {
  className?: string
  /** Raio da borda — case com o container (default 2xl = 16px). */
  radius?: string
}

/**
 * Feixe de luz percorrendo a borda do container pai. Usa um gradiente cônico
 * cuja --beam-angle gira (animate-border-beam) e uma máscara que mantém só a
 * faixa da borda. O pai precisa ser `relative` e `overflow-hidden`.
 * Decorativo (aria-hidden); reduced-motion congela o ângulo via media query global.
 */
export function BorderBeam({ className, radius = "1rem" }: BorderBeamProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 animate-border-beam", className)}
      style={{
        borderRadius: radius,
        padding: "1.5px",
        background:
          "conic-gradient(from var(--beam-angle), transparent 0deg, transparent 300deg, var(--color-glow-strong) 340deg, var(--color-glow) 350deg, transparent 360deg)",
        WebkitMask:
          "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
      }}
    />
  )
}
