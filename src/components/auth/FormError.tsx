import { AlertCircle } from "lucide-react"

/** Mensagem de erro a nível de formulário, com role=alert para leitores de tela. */
export function FormError({ message }: { message: string }) {
  if (!message) return null
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-lg border border-signal-red-on-dark/30 bg-signal-red-on-dark/10 px-3 py-2.5 text-sm text-signal-red-on-dark"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
      <span>{message}</span>
    </div>
  )
}
