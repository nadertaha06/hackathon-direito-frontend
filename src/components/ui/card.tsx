import * as React from "react"
import { cn } from "@/lib/utils"

/** Superfície areia com borda discreta e sombra quase imperceptível. */
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl bg-sand border border-line p-6",
        "shadow-[0_1px_2px_rgba(46,38,32,0.04)]",
        className,
      )}
      {...props}
    />
  ),
)
Card.displayName = "Card"

export { Card }
