import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Ícone à esquerda (ex: <Mail />). */
  icon?: React.ReactNode
  /** Elemento à direita (ex: botão de mostrar/ocultar senha). */
  trailing?: React.ReactNode
  /** Classe aplicada ao wrapper externo. */
  wrapperClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", icon, trailing, wrapperClassName, ...props }, ref) => (
    <div className={cn("group relative", wrapperClassName)}>
      {icon && (
        <span className="pointer-events-none absolute left-3.5 top-1/2 flex -translate-y-1/2 text-fg-muted transition-colors duration-200 group-focus-within:text-glow [&_svg]:h-[18px] [&_svg]:w-[18px]">
          {icon}
        </span>
      )}
      <input
        ref={ref}
        type={type}
        className={cn(
          // Vidro escuro, borda sutil, glow âmbar no focus
          "h-12 w-full rounded-lg bg-white/[0.04] px-4 text-[15px] text-fg font-sans",
          "border border-white/10 placeholder:text-fg-muted/60",
          "transition-[color,box-shadow,border-color,background-color] duration-200",
          "hover:border-white/20",
          "focus:outline-none focus:border-glow/70 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(232,179,117,0.12)]",
          "aria-[invalid=true]:border-signal-red-on-dark/70 aria-[invalid=true]:shadow-[0_0_0_3px_rgba(248,113,113,0.12)]",
          icon && "pl-11",
          trailing && "pr-11",
          className,
        )}
        {...props}
      />
      {trailing && (
        <span className="absolute right-2 top-1/2 flex -translate-y-1/2">{trailing}</span>
      )}
    </div>
  ),
)
Input.displayName = "Input"

export { Input }
