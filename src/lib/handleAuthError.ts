import toast from "react-hot-toast"
import { ApiError } from "@/services/api"
import { logout } from "@/hooks/useAuth"

/**
 * Tratamento centralizado pós-login: 401 desloga, 503/0 toast genérico.
 * Outros 4xx retornam a mensagem do servidor. Retorna null se já foi tratado
 * (chamador não precisa exibir nada).
 */
export function handleAuthError(error: unknown): string | null {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      toast.error("Sua sessão expirou.")
      logout()
      return null
    }
    if (error.status === 503 || error.status === 0) {
      toast.error("Sistema temporariamente indisponível.")
      return null
    }
    return error.message
  }
  return "Algo deu errado. Tente novamente."
}
