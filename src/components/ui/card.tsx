import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Superfície definida por hairline 1px e cantos retos — sem border-radius
 * generoso, sem sombra. A separação vem da borda, não da elevação.
 */
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("border border-line bg-elevated p-6", className)}
      {...props}
    />
  ),
)
Card.displayName = "Card"

export { Card }
