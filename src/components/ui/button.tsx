import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Botão editorial. Rótulo em Geist Mono caixa-alta com tracking (registro de
 * dossiê) — sem "fonte básica". Variantes sólidas ganham o canto chanfrado do
 * "selo cortado": silhueta de marca, não retângulo padrão. Hover: tinta →
 * terracota. Sem glow, sem gradiente.
 */
const buttonVariants = cva(
  "group inline-flex items-center justify-center gap-2.5 font-mono font-medium uppercase tracking-[0.12em] whitespace-nowrap transition-colors duration-[250ms] ease-[var(--ease-editorial)] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  {
    variants: {
      variant: {
        // Sólido tinta com canto chanfrado → terracota no hover.
        primary: "cut-corner bg-ink text-paper hover:bg-accent",
        // Sólido terracota chanfrado (uso pontual, ex: fundo escuro).
        accent: "cut-corner bg-accent text-paper hover:bg-[#73221a]",
        // Texto sublinhado por hairline — ação secundária, sem caixa.
        secondary:
          "border-b-[1.5px] border-ink pb-0.5 text-ink hover:border-accent hover:text-accent",
        // Texto puro.
        ghost: "text-stone hover:text-ink",
      },
      size: {
        sm: "h-9 px-4 text-[11px]",
        md: "h-11 px-5 text-[12px]",
        lg: "h-12 px-6 text-[12.5px]",
      },
    },
    compoundVariants: [
      // A secundária é texto, não caixa: descarta altura/padding fixos.
      { variant: "secondary", size: "sm", className: "h-auto px-0" },
      { variant: "secondary", size: "md", className: "h-auto px-0" },
      { variant: "secondary", size: "lg", className: "h-auto px-0" },
    ],
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

/** Seta funcional que desliza no hover (afeta o pai `group`). */
function ButtonArrow() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="h-3.5 w-3.5 transition-transform duration-[250ms] ease-[var(--ease-editorial)] group-hover:translate-x-0.5"
    >
      <path
        d="M3 8h9m0 0L8.5 4.5M12 8l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export { Button, ButtonArrow, buttonVariants }
