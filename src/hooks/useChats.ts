import { createContext, useCallback, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"
import {
  createStandaloneChat,
  deleteChat,
  listChats,
  renameChat,
} from "@/services/chats"
import { handleAuthError } from "@/lib/handleAuthError"
import type { ChatResponse } from "@/types/domain"

interface ChatsContextValue {
  chats: ChatResponse[]
  archived: ChatResponse[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  refreshArchived: () => Promise<void>
  createStandalone: () => Promise<ChatResponse | null>
  rename: (id: string, title: string) => Promise<void>
  remove: (id: string) => Promise<void>
  /** Inserts a chat optimistically (used after /analisar returns). */
  upsertLocal: (chat: ChatResponse) => void
}

const ChatsContext = createContext<ChatsContextValue | null>(null)

export function ChatsProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<ChatResponse[]>([])
  const [archived, setArchived] = useState<ChatResponse[]>([])
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
      // Filtra só os deletados (lista completa contém ativos também).
      setArchived(sortChats(data.filter((c) => c.deletado_em !== null)))
    } catch (err) {
      handleAuthError(err)
    }
  }, [])

  const createStandalone = useCallback(async (): Promise<ChatResponse | null> => {
    try {
      const chat = await createStandaloneChat()
      setChats((prev) => sortChats([chat, ...prev]))
      return chat
    } catch (err) {
      const msg = handleAuthError(err)
      if (msg) setError(msg)
      return null
    }
  }, [])

  const rename = useCallback(async (id: string, title: string): Promise<void> => {
    // Otimista — reverte em erro.
    let snapshot: ChatResponse[] = []
    setChats((prev) => {
      snapshot = prev
      return prev.map((c) => (c.id === id ? { ...c, titulo: title } : c))
    })
    try {
      await renameChat(id, title)
    } catch (err) {
      setChats(snapshot)
      handleAuthError(err)
    }
  }, [])

  const remove = useCallback(async (id: string): Promise<void> => {
    let snapshot: ChatResponse[] = []
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

  const upsertLocal = useCallback((chat: ChatResponse): void => {
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
        rename,
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

function sortChats(chats: ChatResponse[]): ChatResponse[] {
  return [...chats].sort(
    (a, b) =>
      new Date(b.atualizado_em).getTime() - new Date(a.atualizado_em).getTime(),
  )
}
