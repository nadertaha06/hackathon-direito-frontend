import { ApiError, apiRequest } from "./api"
import { tokenStore } from "./auth"
import { config } from "@/config/config"
import type {
  AnaliseResponse,
  ChatResponse,
  MessageResponse,
} from "@/types/domain"

/** Bearer autenticado ou erro de domínio claro pra UI tratar. */
function requireToken(): string {
  const token = tokenStore.get()
  if (!token) {
    throw new ApiError("Sessão expirada. Entre novamente.", 401)
  }
  return token
}

export async function listChats(includeDeleted = false): Promise<ChatResponse[]> {
  return apiRequest<ChatResponse[]>(
    `/chats?incluir_deletados=${includeDeleted}`,
    { token: requireToken() },
  )
}

export async function createStandaloneChat(titulo?: string): Promise<ChatResponse> {
  return apiRequest<ChatResponse>("/chats", {
    method: "POST",
    body: { titulo },
    token: requireToken(),
  })
}

export async function deleteChat(id: string): Promise<void> {
  await apiRequest<void>(`/chats/${id}`, {
    method: "DELETE",
    token: requireToken(),
  })
}

export async function renameChat(id: string, titulo: string): Promise<ChatResponse> {
  return apiRequest<ChatResponse>(`/chats/${id}`, {
    method: "PATCH",
    body: { titulo },
    token: requireToken(),
  })
}

export async function getMessages(chatId: string): Promise<MessageResponse[]> {
  return apiRequest<MessageResponse[]>(`/chats/${chatId}/messages`, {
    token: requireToken(),
  })
}

/**
 * Upload de PDF pro endpoint /analisar (multipart). Não usa apiRequest porque
 * o wrapper força JSON. Erro 422 carrega o `detail` do FastAPI.
 */
export async function analisarPdf(file: File): Promise<AnaliseResponse> {
  const token = requireToken()
  const fd = new FormData()
  fd.append("file", file)

  let response: Response
  try {
    response = await fetch(`${config.apiBaseUrl}/analisar`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    })
  } catch {
    throw new ApiError("Falha de conexão com o servidor.", 0)
  }

  const text = await response.text()
  const data = text ? safeParse(text) : null
  if (!response.ok) {
    const detail = extractDetail(data) ?? "Não foi possível analisar este PDF."
    throw new ApiError(detail, response.status, data)
  }
  return data as AnaliseResponse
}

function safeParse(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function extractDetail(data: unknown): string | null {
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>
    if (typeof obj.detail === "string") return obj.detail
    if (typeof obj.message === "string") return obj.message
  }
  return null
}

/**
 * Stream SSE — protocolo: linhas `data: <token>` separadas por `\n\n`.
 * Aceita também eventos JSON `data: {"delta": "..."}` se o server emitir.
 * Chama `onToken` para cada chunk de texto, `onDone` ao fim, `onError` em falha.
 * Retorna função pra cancelar (abort fetch).
 */
export interface StreamCallbacks {
  onToken: (token: string) => void
  onDone: () => void
  onError: (err: Error) => void
}

interface StreamOptions extends StreamCallbacks {
  body?: unknown
}

function streamRequest(path: string, opts: StreamOptions): () => void {
  const token = requireToken()
  const controller = new AbortController()

  void (async () => {
    let res: Response
    try {
      res = await fetch(`${config.apiBaseUrl}${path}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
        signal: controller.signal,
      })
    } catch (err) {
      if ((err as Error).name === "AbortError") return
      opts.onError(new ApiError("Falha de conexão com o servidor.", 0))
      return
    }

    if (!res.ok) {
      const text = await res.text().catch(() => "")
      const data = text ? safeParse(text) : null
      opts.onError(
        new ApiError(extractDetail(data) ?? `Erro ${res.status}`, res.status, data),
      )
      return
    }

    if (!res.body) {
      opts.onError(new Error("Resposta sem corpo"))
      return
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ""

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        // Eventos SSE separados por linha em branco.
        let sep = buffer.indexOf("\n\n")
        while (sep !== -1) {
          const rawEvent = buffer.slice(0, sep)
          buffer = buffer.slice(sep + 2)
          processEvent(rawEvent, opts.onToken)
          sep = buffer.indexOf("\n\n")
        }
      }
      // Flush trailing event (sem \n\n final)
      if (buffer.trim()) processEvent(buffer, opts.onToken)
      opts.onDone()
    } catch (err) {
      if ((err as Error).name === "AbortError") return
      opts.onError(err as Error)
    }
  })()

  return () => controller.abort()
}

function processEvent(raw: string, onToken: (t: string) => void): void {
  // Coleta todas as linhas `data:` do evento (SSE permite múltiplas).
  const lines = raw.split("\n")
  const dataLines: string[] = []
  for (const line of lines) {
    if (line.startsWith("data:")) {
      dataLines.push(line.slice(5).replace(/^ /, ""))
    }
  }
  if (dataLines.length === 0) return
  const payload = dataLines.join("\n")
  if (payload === "[DONE]") return

  // Tenta JSON {"delta": "..."} ou {"content": "..."}; caso contrário, texto cru.
  if (payload.startsWith("{")) {
    try {
      const obj = JSON.parse(payload) as Record<string, unknown>
      const token =
        (typeof obj.delta === "string" && obj.delta) ||
        (typeof obj.content === "string" && obj.content) ||
        (typeof obj.token === "string" && obj.token) ||
        ""
      if (token) onToken(token)
      return
    } catch {
      // não era JSON válido — cai pro texto cru
    }
  }
  onToken(payload)
}

export function streamSendMessage(
  chatId: string,
  content: string,
  callbacks: StreamCallbacks,
): () => void {
  return streamRequest(`/chats/${chatId}/messages/stream`, {
    ...callbacks,
    body: { content },
  })
}

export function streamRegenerate(
  chatId: string,
  messageId: string,
  callbacks: StreamCallbacks,
): () => void {
  return streamRequest(
    `/chats/${chatId}/messages/${messageId}/regenerate/stream`,
    callbacks,
  )
}
