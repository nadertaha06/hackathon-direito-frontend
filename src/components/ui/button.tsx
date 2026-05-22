import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Botão editorial: cantos quase retos (2px), hairline em vez de sombra,
 * transição única de 250ms. Sem glow, sem scale, sem gradiente.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-sans font-medium whitespace-nowrap rounded-[var(--radius-button)] transition-colors duration-[250ms] ease-[var(--ease-editorial)] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  {
    variants: {
      variant: {
        // Sólido terracota com texto papel — único uso do acento como preenchimento
        primary: "bg-accent text-paper hover:bg-[#73221a]",
        // Hairline sobre papel
        secondary: "border border-line text-ink hover:border-ink hover:bg-surface",
        // Texto puro
        ghost: "text-stone hover:text-ink",
      },
      size: {
        sm: "h-9 px-4 text-[13px]",
        md: "h-11 px-5 text-[14px]",
        lg: "h-12 px-6 text-[15px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  ),
)
Button.displayName = "Button"

export { Button, buttonVariants }
