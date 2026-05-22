import toast from "react-hot-toast"
import { ApiError } from "@/services/api"

const UNAVAILABLE_MSG =
  "Sistema temporariamente indisponível. Tente novamente em alguns segundos."

/**
 * Traduz um erro de chamada de auth numa mensagem para o formulário.
 * Casos de indisponibilidade (503) ou rede (0) viram toast e retornam "".
 * `overrides` mapeia status HTTP → mensagem específica da tela.
 */
export function handleApiError(
  error: unknown,
  overrides: Record<number, string> = {},
): string {
  if (error instanceof ApiError) {
    if (error.status === 503 || error.status === 0) {
      toast.error(UNAVAILABLE_MSG)
      return ""
    }
    if (overrides[error.status]) return overrides[error.status]
    return error.message
  }
  return "Algo deu errado. Tente novamente."
}
