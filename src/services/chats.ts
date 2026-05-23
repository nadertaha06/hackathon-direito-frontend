import { ApiError, apiRequest } from "./api"
import { tokenStore } from "./auth"
import { config } from "@/config/config"
import type {
  AnaliseResponse,
  ChatListItem,
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

export async function listChats(includeDeleted = false): Promise<ChatListItem[]> {
  return apiRequest<ChatListItem[]>(
    `/chats?incluir_deletados=${includeDeleted}&limit=100`,
    { token: requireToken() },
  )
}

/**
 * Cria um chat standalone. O back espera body vazio `{}` (CriarChatRequest)
 * — título é gerado depois automaticamente. Não há endpoint de rename.
 */
export async function createStandaloneChat(): Promise<ChatResponse> {
  return apiRequest<ChatResponse>("/chats", {
    method: "POST",
    body: {},
    token: requireToken(),
  })
}

export async function deleteChat(id: string): Promise<void> {
  await apiRequest<void>(`/chats/${id}`, {
    method: "DELETE",
    token: requireToken(),
  })
}

export async function getMessages(chatId: string): Promise<MessageResponse[]> {
  return apiRequest<MessageResponse[]>(`/chats/${chatId}/messages?limit=200`, {
    token: requireToken(),
  })
}

/**
 * Upload de PDF pro endpoint /analisar (multipart, campo `arquivo`).
 * Não usa apiRequest porque o wrapper força JSON. Erro 422 carrega `detail`
 * com motivo de "não é contrato de consumo".
 */
export async function analisarPdf(file: File): Promise<AnaliseResponse> {
  const token = requireToken()
  const fd = new FormData()
  fd.append("arquivo", file)

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
 * Stream SSE — protocolo do back: linhas `data: <json>\n\n` onde json é
 * `{type:"text",content:"..."}` por chunk, `{type:"done",uso:{...}}` ao final
 * ou `{type:"error",code:"..."}` em falha no meio. Callbacks são acionados:
 * onToken pra cada chunk de texto, onDone ao fim natural, onError em erro
 * (de rede, HTTP, evento error do stream, ou JSON inválido). Retorna função
 * de cancelamento.
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
  let streamErrored = false

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

    const handle = (raw: string) => {
      const ev = parseEvent(raw)
      if (!ev) return
      if (ev.type === "text" && typeof ev.content === "string") {
        opts.onToken(ev.content)
      } else if (ev.type === "error") {
        streamErrored = true
        const code = (ev.code as string | undefined) ?? "stream_error"
        opts.onError(new ApiError(`Falha no stream (${code}).`, 0, ev))
      }
      // type:"done" — ignora; o onDone é chamado quando o reader fecha.
    }

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        let sep = buffer.indexOf("\n\n")
        while (sep !== -1) {
          const rawEvent = buffer.slice(0, sep)
          buffer = buffer.slice(sep + 2)
          handle(rawEvent)
          sep = buffer.indexOf("\n\n")
        }
      }
      if (buffer.trim()) handle(buffer)
      if (!streamErrored) opts.onDone()
    } catch (err) {
      if ((err as Error).name === "AbortError") return
      opts.onError(err as Error)
    }
  })()

  return () => controller.abort()
}

/** Junta linhas `data:` de um evento SSE e tenta parsear como JSON. */
function parseEvent(raw: string): Record<string, unknown> | null {
  const lines = raw.split("\n")
  const dataLines: string[] = []
  for (const line of lines) {
    if (line.startsWith("data:")) {
      dataLines.push(line.slice(5).replace(/^ /, ""))
    }
  }
  if (dataLines.length === 0) return null
  const payload = dataLines.join("\n")
  if (payload === "[DONE]") return { type: "done" }
  try {
    return JSON.parse(payload) as Record<string, unknown>
  } catch {
    // Back não envia texto puro — mas se vier, trata como token.
    return { type: "text", content: payload }
  }
}

export function streamSendMessage(
  chatId: string,
  conteudo: string,
  callbacks: StreamCallbacks,
  replyingTo?: string,
): () => void {
  return streamRequest(`/chats/${chatId}/messages/stream`, {
    ...callbacks,
    body: {
      conteudo,
      ...(replyingTo ? { replying_to_message_id: replyingTo } : {}),
    },
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
