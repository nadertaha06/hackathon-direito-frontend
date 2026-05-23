import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Botão "Trust & Authority". Primário navy, CTA dourado, secundário em
 * contorno navy. Raio padrão (6px), transição suave. Lato semibold.
 */
const buttonVariants = cva(
  "group inline-flex items-center justify-center gap-2 font-sans font-bold whitespace-nowrap rounded-[var(--radius-button)] transition-colors duration-200 ease-[var(--ease-editorial)] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent cursor-pointer",
  {
    variants: {
      variant: {
        // Navy de autoridade — ação primária geral.
        primary: "bg-accent text-white hover:bg-accent-soft",
        // Dourado de confiança — CTA de conversão principal.
        accent: "bg-gold text-white hover:bg-gold-soft",
        // Contorno navy — ação secundária.
        secondary:
          "border border-accent text-accent bg-transparent hover:bg-accent hover:text-white",
        // Texto puro.
        ghost: "text-accent hover:text-accent-soft",
      },
      size: {
        sm: "h-9 px-4 text-[13px]",
        md: "h-11 px-5 text-[14px]",
        lg: "h-12 px-7 text-[15px]",
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

/** Seta funcional que desliza no hover (afeta o pai `group`). */
function ButtonArrow() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="h-4 w-4 transition-transform duration-200 ease-[var(--ease-editorial)] group-hover:translate-x-0.5"
    >
      <path
        d="M3 8h9m0 0L8.5 4.5M12 8l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export { Button, ButtonArrow, buttonVariants }
