import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { tokenStore } from "@/services/auth"

/**
 * Guarda de rota autenticada. Não decodifica JWT — confia no expiry
 * tratado pelas chamadas (401 redireciona via handleAuthError).
 * Sem token: redireciona com replace pra evitar voltar pro estado quebrado.
 */
export function useAuthGuard(): string | null {
  const navigate = useNavigate()
  const token = tokenStore.get()

  useEffect(() => {
    if (!token) navigate("/login", { replace: true })
  }, [token, navigate])

  return token
}

export function logout(): void {
  tokenStore.clear()
  window.location.assign("/login")
}
