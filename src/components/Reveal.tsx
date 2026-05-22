import type { ReactNode } from "react"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { cn } from "@/lib/utils"

interface RevealProps {
  children: ReactNode
  className?: string
  /** Atraso em ms para escalonar elementos numa mesma seção. */
  delay?: number
}

/** Envolve conteúdo com um fade-up discreto ao entrar na viewport. */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const { ref, visible } = useScrollReveal()

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={cn(
        "transition-all duration-700 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className,
      )}
    >
      {children}
    </div>
  )
}
