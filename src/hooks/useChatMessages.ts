import { useCallback, useEffect, useRef, useState } from "react"
import { ApiError } from "@/services/api"
import {
  getMessages,
  streamRegenerate,
  streamSendMessage,
} from "@/services/chats"
import { handleAuthError } from "@/lib/handleAuthError"
import type { MessageItem } from "@/components/app/Message"

interface UseChatMessages {
  messages: MessageItem[]
  loading: boolean
  error: string | null
  streaming: boolean
  send: (content: string) => void
  regenerate: (messageId: string) => void
  stop: () => void
}

/**
 * Gerencia histórico + envio com streaming para um chat.
 * Mantém ref do cancel pra suportar stop e troca de chatId no meio do stream.
 */
export function useChatMessages(chatId: string | null): UseChatMessages {
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [streaming, setStreaming] = useState(false)
  const cancelRef = useRef<(() => void) | null>(null)
  const onRefresh = useRef<(() => void) | null>(null)

  // Carrega histórico quando o chatId muda.
  useEffect(() => {
    if (!chatId) {
      setMessages([])
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)

    void getMessages(chatId)
      .then((data) => {
        if (cancelled) return
        setMessages(data.map((m) => ({ ...m })))
      })
      .catch((err) => {
        if (cancelled) return
        const msg = handleAuthError(err)
        if (msg) setError(msg)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
      cancelRef.current?.()
      cancelRef.current = null
    }
  }, [chatId])

  const stop = useCallback(() => {
    cancelRef.current?.()
    cancelRef.current = null
    setStreaming(false)
  }, [])

  const send = useCallback(
    (content: string) => {
      if (!chatId || streaming) return
      const userTempId = `tmp-u-${Date.now()}`
      const asstTempId = `tmp-a-${Date.now() + 1}`
      const now = new Date().toISOString()

      setMessages((prev) => [
        ...prev,
        {
          id: userTempId,
          chat_id: chatId,
          role: "user",
          content,
          replying_to_message_id: null,
          dispositivos_recuperados: [],
          contexto_truncado: false,
          payload_json: null,
          criado_em: now,
        },
        {
          id: asstTempId,
          chat_id: chatId,
          role: "assistant",
          content: "",
          replying_to_message_id: null,
          dispositivos_recuperados: [],
          contexto_truncado: false,
          payload_json: null,
          criado_em: now,
          streaming: true,
        },
      ])
      setStreaming(true)

      cancelRef.current = streamSendMessage(chatId, content, {
        onToken: (token) =>
          setMessages((prev) =>
            prev.map((m) =>
              m.id === asstTempId ? { ...m, content: m.content + token } : m,
            ),
          ),
        onDone: () => {
          setMessages((prev) =>
            prev.map((m) => (m.id === asstTempId ? { ...m, streaming: false } : m)),
          )
          setStreaming(false)
          cancelRef.current = null
          onRefresh.current?.()
        },
        onError: (err) => {
          const apiErr = err instanceof ApiError ? err : null
          if (apiErr?.status === 401) {
            handleAuthError(err)
            return
          }
          setMessages((prev) =>
            prev.map((m) =>
              m.id === asstTempId ? { ...m, streaming: false, failed: true } : m,
            ),
          )
          setStreaming(false)
          cancelRef.current = null
        },
      })
    },
    [chatId, streaming],
  )

  const regenerate = useCallback(
    (messageId: string) => {
      if (!chatId || streaming) return
      const target = messages.find((m) => m.id === messageId)
      if (!target || target.role !== "assistant" || target.payload_json) return

      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, content: "", streaming: true, failed: false }
            : m,
        ),
      )
      setStreaming(true)

      cancelRef.current = streamRegenerate(chatId, messageId, {
        onToken: (token) =>
          setMessages((prev) =>
            prev.map((m) =>
              m.id === messageId ? { ...m, content: m.content + token } : m,
            ),
          ),
        onDone: () => {
          setMessages((prev) =>
            prev.map((m) => (m.id === messageId ? { ...m, streaming: false } : m)),
          )
          setStreaming(false)
          cancelRef.current = null
          onRefresh.current?.()
        },
        onError: (err) => {
          const apiErr = err instanceof ApiError ? err : null
          if (apiErr?.status === 401) {
            handleAuthError(err)
            return
          }
          setMessages((prev) =>
            prev.map((m) =>
              m.id === messageId ? { ...m, streaming: false, failed: true } : m,
            ),
          )
          setStreaming(false)
          cancelRef.current = null
        },
      })
    },
    [chatId, messages, streaming],
  )

  return { messages, loading, error, streaming, send, regenerate, stop }
}
