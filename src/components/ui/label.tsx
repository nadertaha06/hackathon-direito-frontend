import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cn } from "@/lib/utils"

/** Label acima do campo, mono em caixa-alta discreta — registro editorial. */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "mb-2 block font-mono text-[11px] uppercase tracking-[0.14em] text-stone",
      className,
    )}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
