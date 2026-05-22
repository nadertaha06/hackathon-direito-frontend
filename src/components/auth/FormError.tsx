import { AlertCircle } from "lucide-react"

/** Mensagem de erro a nível de formulário, com role=alert para leitores de tela. */
export function FormError({ message }: { message: string }) {
  if (!message) return null
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-[var(--radius-input)] border border-danger bg-danger/[0.06] px-3 py-2.5 text-[14px] text-danger"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
      <span>{message}</span>
    </div>
  )
}
