import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Ícone funcional à esquerda (Lucide stroke 1.5). */
  icon?: React.ReactNode
  /** Elemento à direita (ex: mostrar/ocultar senha). */
  trailing?: React.ReactNode
  /** Classe aplicada ao wrapper externo. */
  wrapperClassName?: string
}

/**
 * Input editorial: hairline 1px, raio 4px, fundo papel.
 * Foco marca a borda no acento — sem ring colorido difuso.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", icon, trailing, wrapperClassName, ...props }, ref) => (
    <div className={cn("group relative", wrapperClassName)}>
      {icon && (
        <span className="pointer-events-none absolute left-3.5 top-1/2 flex -translate-y-1/2 text-mute transition-colors duration-[250ms] group-focus-within:text-accent [&_svg]:h-[18px] [&_svg]:w-[18px]">
          {icon}
        </span>
      )}
      <input
        ref={ref}
        type={type}
        className={cn(
          "h-11 w-full rounded-[var(--radius-input)] bg-elevated px-3.5 text-[15px] text-ink font-sans",
          "border border-line placeholder:text-mute",
          "transition-colors duration-[250ms] ease-[var(--ease-editorial)]",
          "hover:border-stone/60",
          "focus:outline-none focus:border-accent",
          "aria-[invalid=true]:border-danger",
          icon && "pl-10",
          trailing && "pr-11",
          className,
        )}
        {...props}
      />
      {trailing && (
        <span className="absolute right-1.5 top-1/2 flex -translate-y-1/2">{trailing}</span>
      )}
    </div>
  ),
)
Input.displayName = "Input"

export { Input }
