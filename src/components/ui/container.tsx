import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Largura de leitura editorial. `size` controla a medida máxima:
 * - prose: ~60ch para blocos de texto
 * - default: layout de página (max ~1120px)
 * - wide: seções de grade largas
 */
const widths = {
  prose: "max-w-[60ch]",
  default: "max-w-[70rem]",
  wide: "max-w-[80rem]",
} as const

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: keyof typeof widths
}

export function Container({ size = "default", className, ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full px-6 md:px-10", widths[size], className)}
      {...props}
    />
  )
}
