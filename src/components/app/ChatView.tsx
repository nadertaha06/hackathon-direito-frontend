import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ChevronLeft, Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import { ChatInput } from "./ChatInput"
import { ConfirmModal } from "./ConfirmModal"
import { Message } from "./Message"
import { useChats } from "@/hooks/useChats"
import { useChatMessages } from "@/hooks/useChatMessages"

interface ChatViewProps {
  onPdfDropped: (file: File) => void
}

export function ChatView({ onPdfDropped }: ChatViewProps) {
  const { chatId = "" } = useParams<{ chatId: string }>()
  const navigate = useNavigate()
  const { chats, remove, refresh } = useChats()
  const chat = chats.find((c) => c.id === chatId)
  const { messages, loading, error, streaming, send, regenerate, stop } =
    useChatMessages(chatId || null)

  const [toDelete, setToDelete] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const lastContent = messages[messages.length - 1]?.content

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages.length, lastContent])

  const hasInitialAnalysis = messages.some(
    (m) => m.role === "assistant" && m.payload_json,
  )
  const allowUpload = !hasInitialAnalysis

  function handleRegenerate(id: string) {
    const target = messages.find((m) => m.id === id)
    if (target?.payload_json) {
      toast.error("A análise inicial não pode ser regenerada.")
      return
    }
    regenerate(id)
  }

  if (!chat && !loading) {
    return (
      <div className="mx-auto flex w-full max-w-[680px] flex-1 flex-col items-center justify-center px-6 text-center">
        <p className="text-[13px] text-mute">Conversa não encontrada</p>
        <h2 className="mt-3 font-display text-[26px] font-medium text-ink">
          Essa conversa não existe ou foi arquivada.
        </h2>
        <button
          type="button"
          onClick={() => navigate("/app")}
          className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-accent transition-colors duration-200 hover:text-accent-soft"
        >
          <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
          Voltar
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col bg-paper">
      {/* Header bem minimal — só título + ação. */}
      <header className="shrink-0 border-b border-line/70">
        <div className="mx-auto flex h-[52px] w-full max-w-[768px] items-center gap-3 px-4 md:px-6">
          <h1 className="min-w-0 flex-1 truncate text-[15px] font-medium leading-none text-ink">
            {chat?.titulo ?? "Carregando…"}
          </h1>
          <button
            type="button"
            onClick={() => setToDelete(true)}
            aria-label="Arquivar conversa"
            title="Arquivar"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-mute transition-colors duration-200 hover:bg-surface hover:text-danger"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.6} />
          </button>
        </div>
      </header>

      {/* Mensagens — coluna centrada estilo Claude */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[768px] px-4 py-6 md:px-6 md:py-8">
          {loading && (
            <p className="py-10 text-center text-[13px] text-mute">Carregando…</p>
          )}
          {error && (
            <p className="py-10 text-center text-[13px] text-danger">{error}</p>
          )}
          {!loading &&
            messages.map((m) => (
              <Message
                key={m.id}
                message={m}
                onRegenerate={handleRegenerate}
                onRetry={
                  m.role === "assistant" && !m.payload_json
                    ? () => regenerate(m.id)
                    : undefined
                }
              />
            ))}
        </div>
      </div>

      {/* Input fixo — caixa grande arredondada estilo Claude */}
      <div className="shrink-0 bg-paper">
        <div className="mx-auto w-full max-w-[768px] px-4 pb-4 pt-2 md:px-6">
          <ChatInput
            allowUpload={allowUpload}
            streaming={streaming}
            onSend={send}
            onStop={stop}
            onPdfDropped={allowUpload ? onPdfDropped : undefined}
          />
        </div>
      </div>

      <ConfirmModal
        open={toDelete}
        title="Arquivar esta conversa?"
        description="A conversa será movida para Arquivados e pode ser restaurada depois."
        confirmLabel="Arquivar"
        destructive
        onConfirm={async () => {
          setToDelete(false)
          if (!chat) return
          await remove(chat.id)
          await refresh()
          navigate("/app", { replace: true })
        }}
        onCancel={() => setToDelete(false)}
      />
    </div>
  )
}
