import { config } from "@/config/config"

/**
 * Erro padronizado de chamadas à API.
 * `status` é o HTTP status (0 quando a rede falha).
 * `data` é o corpo já parseado (quando houver).
 */
export class ApiError extends Error {
  status: number
  data: unknown

  constructor(message: string, status: number, data?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}

interface RequestOptions {
  method?: string
  body?: unknown
  token?: string | null
}

/**
 * Wrapper fino sobre fetch. Adiciona JSON headers, Bearer token e
 * tradução de erros para ApiError. Não lança em rede sem internet
 * sem antes embrulhar numa ApiError com status 0.
 */
export async function apiRequest<T>(
  path: string,
  { method = "GET", body, token }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {}
  if (body !== undefined) headers["Content-Type"] = "application/json"
  if (token) headers["Authorization"] = `Bearer ${token}`

  let response: Response
  try {
    response = await fetch(`${config.apiBaseUrl}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError("Falha de conexão com o servidor.", 0)
  }

  // 204 / corpo vazio
  const text = await response.text()
  const data = text ? safeJsonParse(text) : null

  if (!response.ok) {
    throw new ApiError(extractMessage(data), response.status, data)
  }

  return data as T
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

/** Extrai a mensagem do servidor (FastAPI usa `detail`). */
function extractMessage(data: unknown): string {
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>
    if (typeof obj.detail === "string") return obj.detail
    if (typeof obj.message === "string") return obj.message
  }
  return "Algo deu errado. Tente novamente."
}
