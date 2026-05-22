import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group relative inline-flex items-center justify-center gap-2 rounded-lg font-medium font-sans transition-all duration-200 ease-out disabled:opacity-60 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glow active:scale-[0.97] whitespace-nowrap",
  {
    variants: {
      variant: {
        // Primário: CTA neon âmbar, texto escuro, glow no hover
        primary:
          "bg-cta text-cta-ink shadow-[0_4px_16px_-4px_rgba(232,179,117,0.5)] hover:bg-cta-hover hover:shadow-[0_0_28px_-2px_rgba(232,179,117,0.7)]",
        // Secundário: vidro translúcido com borda sutil
        secondary:
          "bg-white/5 text-fg border border-white/12 backdrop-blur-sm hover:bg-white/10 hover:border-white/20",
        // Ghost: sem fundo; ganha leve vidro no hover
        ghost: "bg-transparent text-fg/85 hover:bg-white/8 hover:text-fg",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-[15px]",
        lg: "h-13 px-7 text-base",
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
