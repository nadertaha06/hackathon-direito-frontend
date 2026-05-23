import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ChevronLeft, Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import { ChatInput } from "./ChatInput"
import { ConfirmModal } from "./ConfirmModal"
import { Message } from "./Message"
import { useChats } from "@/hooks/useChats"
import { useChatMessages } from "@/hooks/useChatMessages"
import { relativeShort } from "@/lib/formatDate"

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

  // Tem análise inicial? então não permite upload novo nem regenerar a 1ª msg.
  const hasInitialAnalysis = messages.some(
    (m) => m.role === "assistant" && m.payload_json,
  )
  const allowUpload = !hasInitialAnalysis

  function handleRegenerate(id: string) {
    // O back retorna 422 pra regenerar a análise inicial. Bloqueamos visualmente
    // via canRegenerate=false em Message; aqui só catch defensivo.
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
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-mute">
          Chat não encontrado
        </p>
        <h2 className="mt-3 font-display text-[26px] font-medium text-ink">
          Essa conversa não existe ou foi arquivada.
        </h2>
        <button
          type="button"
          onClick={() => navigate("/app")}
          className="mt-6 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent transition-colors duration-200 hover:text-accent-soft"
        >
          <ChevronLeft className="h-3 w-3" strokeWidth={1.5} />
          Voltar
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col">
      {/* Header do chat */}
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex w-full max-w-[820px] items-center gap-3 px-6 py-4 md:px-10">
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-[clamp(1.25rem,2vw,1.5rem)] font-medium leading-tight tracking-[-0.01em] text-ink">
              {chat?.titulo ?? "Carregando…"}
            </h1>
            {chat && (
              <p className="mt-1 font-mono text-[11px] text-mute">
                Atualizado {relativeShort(chat.atualizado_em)} ·{" "}
                {hasInitialAnalysis ? "com análise de contrato" : "conversa pontual"}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setToDelete(true)}
              aria-label="Arquivar chat"
              title="Arquivar"
              className="grid h-8 w-8 place-items-center text-stone transition-colors duration-200 hover:text-danger"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Mensagens */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[820px] px-6 py-6 md:px-10">
          {loading && (
            <p className="py-10 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-mute">
              Carregando conversa…
            </p>
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

      {/* Input fixo */}
      <div className="border-t border-line bg-paper">
        <div className="mx-auto w-full max-w-[820px] px-6 py-4 md:px-10">
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
        title="Arquivar este chat?"
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
