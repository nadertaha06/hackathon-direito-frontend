import { createContext, useCallback, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"
import {
  createStandaloneChat,
  deleteChat,
  listChats,
} from "@/services/chats"
import { handleAuthError } from "@/lib/handleAuthError"
import type { ChatListItem, ChatResponse } from "@/types/domain"

interface ChatsContextValue {
  chats: ChatListItem[]
  archived: ChatListItem[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  refreshArchived: () => Promise<void>
  createStandalone: () => Promise<ChatResponse | null>
  remove: (id: string) => Promise<void>
  /** Insere/atualiza um chat local (usado após /analisar retornar). */
  upsertLocal: (chat: ChatListItem) => void
}

const ChatsContext = createContext<ChatsContextValue | null>(null)

export function ChatsProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<ChatListItem[]>([])
  const [archived, setArchived] = useState<ChatListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const data = await listChats(false)
      setChats(sortChats(data))
      setError(null)
    } catch (err) {
      const msg = handleAuthError(err)
      if (msg) setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshArchived = useCallback(async () => {
    try {
      const data = await listChats(true)
      setArchived(sortChats(data.filter((c) => c.deletado_em !== null)))
    } catch (err) {
      handleAuthError(err)
    }
  }, [])

  const createStandalone = useCallback(async (): Promise<ChatResponse | null> => {
    try {
      const chat = await createStandaloneChat()
      const item: ChatListItem = {
        id: chat.id,
        analise_id: chat.analise_id,
        titulo: chat.titulo,
        criado_em: chat.criado_em,
        atualizado_em: chat.atualizado_em,
        deletado_em: null,
        ultima_mensagem_preview: null,
      }
      setChats((prev) => sortChats([item, ...prev]))
      return chat
    } catch (err) {
      const msg = handleAuthError(err)
      if (msg) setError(msg)
      return null
    }
  }, [])

  const remove = useCallback(async (id: string): Promise<void> => {
    let snapshot: ChatListItem[] = []
    setChats((prev) => {
      snapshot = prev
      return prev.filter((c) => c.id !== id)
    })
    try {
      await deleteChat(id)
    } catch (err) {
      setChats(snapshot)
      handleAuthError(err)
    }
  }, [])

  const upsertLocal = useCallback((chat: ChatListItem): void => {
    setChats((prev) => {
      const exists = prev.some((c) => c.id === chat.id)
      const next = exists
        ? prev.map((c) => (c.id === chat.id ? chat : c))
        : [chat, ...prev]
      return sortChats(next)
    })
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return (
    <ChatsContext.Provider
      value={{
        chats,
        archived,
        loading,
        error,
        refresh,
        refreshArchived,
        createStandalone,
        remove,
        upsertLocal,
      }}
    >
      {children}
    </ChatsContext.Provider>
  )
}

export function useChats(): ChatsContextValue {
  const ctx = useContext(ChatsContext)
  if (!ctx) throw new Error("useChats deve ser usado dentro de <ChatsProvider>")
  return ctx
}

function sortChats(chats: ChatListItem[]): ChatListItem[] {
  return [...chats].sort(
    (a, b) =>
      new Date(b.atualizado_em).getTime() - new Date(a.atualizado_em).getTime(),
  )
}
