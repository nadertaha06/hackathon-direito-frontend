import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface SpotlightProps {
  className?: string
  /** Cor do glow (default âmbar da marca). */
  color?: string
  /** Tamanho do halo em px. */
  size?: number
}

/**
 * Glow que segue o mouse dentro do container pai (que deve ser `relative`).
 * Atualiza CSS vars --mx/--my via requestAnimationFrame (throttle natural).
 * Some quando o ponteiro sai; decorativo (aria-hidden).
 */
export function Spotlight({
  className,
  color = "rgba(232,179,117,0.18)",
  size = 480,
}: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null)
  const frame = useRef<number | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const parent = el.parentElement
    if (!parent) return

    const onMove = (e: MouseEvent) => {
      if (frame.current != null) return
      frame.current = requestAnimationFrame(() => {
        frame.current = null
        const rect = parent.getBoundingClientRect()
        el.style.setProperty("--mx", `${e.clientX - rect.left}px`)
        el.style.setProperty("--my", `${e.clientY - rect.top}px`)
        el.style.opacity = "1"
      })
    }
    const onLeave = () => {
      el.style.opacity = "0"
    }

    parent.addEventListener("mousemove", onMove)
    parent.addEventListener("mouseleave", onLeave)
    return () => {
      parent.removeEventListener("mousemove", onMove)
      parent.removeEventListener("mouseleave", onLeave)
      if (frame.current != null) cancelAnimationFrame(frame.current)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500",
        className,
      )}
      style={{
        background: `radial-gradient(${size}px circle at var(--mx, 50%) var(--my, 0%), ${color}, transparent 70%)`,
      }}
    />
  )
}
