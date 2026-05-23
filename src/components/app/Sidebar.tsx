import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Archive, ChevronDown } from "lucide-react"
import { Wordmark } from "@/components/Wordmark"
import { ChatListItem } from "./ChatListItem"
import { ConfirmModal } from "./ConfirmModal"
import { NewChatPopover } from "./NewChatPopover"
import { PendingAnalysisItem } from "./PendingAnalysisItem"
import { UserMenu } from "./UserMenu"
import { useChats } from "@/hooks/useChats"
import { usePendingAnalyses } from "@/hooks/usePendingAnalyses"
import type { ChatListItem as ChatListItemType } from "@/types/domain"

interface SidebarProps {
  onAnalyzePdf: () => void
  onAskQuestion: () => void
}

export function Sidebar({ onAnalyzePdf, onAskQuestion }: SidebarProps) {
  const { chatId } = useParams<{ chatId: string }>()
  const { chats, archived, loading, remove, refreshArchived } = useChats()
  const { pending, dismiss } = usePendingAnalyses()
  const [toDelete, setToDelete] = useState<ChatListItemType | null>(null)
  const [archivedOpen, setArchivedOpen] = useState(false)

  useEffect(() => {
    if (archivedOpen) void refreshArchived()
  }, [archivedOpen, refreshArchived])

  return (
    <aside className="flex h-full w-full flex-col bg-surface">
      {/* Header — wordmark + ação primária */}
      <div className="px-5 pb-3 pt-6">
        <Wordmark className="mb-5" />
        <NewChatPopover onAnalyzePdf={onAnalyzePdf} onAskQuestion={onAskQuestion} />
      </div>

      {/* Lista — única região com scroll */}
      <div className="min-h-0 flex-1 overflow-y-auto pb-2">
        {/* Em análise (pending) — sobe ao topo */}
        {pending.length > 0 && (
          <>
            <div className="px-5 pb-2 pt-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
                Em análise · {pending.length}
              </div>
            </div>
            <ul className="px-2 pb-2">
              {pending.map((entry) => (
                <li key={entry.tempId}>
                  <PendingAnalysisItem entry={entry} onDismiss={dismiss} />
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="px-5 pb-2 pt-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">
            Conversas
          </div>
        </div>

        {loading && chats.length === 0 && (
          <div className="px-5 py-3 font-mono text-[11px] text-mute">Carregando…</div>
        )}
        {!loading && chats.length === 0 && pending.length === 0 && (
          <div className="px-5 py-3 text-[13px] leading-relaxed text-stone">
            Nenhuma conversa ainda.
            <br />
            Comece analisando um contrato ou tirando uma dúvida.
          </div>
        )}

        <ul className="px-2">
          {chats.map((chat) => (
            <li key={chat.id}>
              <ChatListItem
                chat={chat}
                active={chat.id === chatId}
                onAskDelete={setToDelete}
              />
            </li>
          ))}
        </ul>

        {/* Arquivados */}
        <div className="mt-3 border-t border-line">
          <button
            type="button"
            onClick={() => setArchivedOpen((v) => !v)}
            aria-expanded={archivedOpen}
            className="flex w-full items-center gap-2 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-mute transition-colors duration-200 hover:text-stone"
          >
            <Archive className="h-3 w-3" strokeWidth={1.5} />
            Arquivados
            <ChevronDown
              className={`ml-auto h-3 w-3 transition-transform duration-200 ${archivedOpen ? "rotate-180" : ""}`}
              strokeWidth={1.5}
            />
          </button>

          {archivedOpen && (
            <ul className="px-2 pb-3">
              {archived.length === 0 && (
                <li className="px-3 py-2 text-[12px] text-mute">Nada arquivado.</li>
              )}
              {archived.map((chat) => (
                <li key={chat.id} className="px-3 py-1.5 opacity-60">
                  <div className="truncate font-sans text-[13px] text-stone">
                    {chat.titulo ?? "Sem título"}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Footer fixo — usuário */}
      <div className="border-t border-line p-3">
        <UserMenu />
      </div>

      <ConfirmModal
        open={Boolean(toDelete)}
        title="Arquivar este chat?"
        description={
          <>
            A conversa será movida para <span className="font-mono text-[12px] text-stone">Arquivados</span>{" "}
            e pode ser restaurada depois.
          </>
        }
        confirmLabel="Arquivar"
        destructive
        onConfirm={() => {
          if (toDelete) void remove(toDelete.id)
          setToDelete(null)
        }}
        onCancel={() => setToDelete(null)}
      />
    </aside>
  )
}
