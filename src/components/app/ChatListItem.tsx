import { useNavigate } from "react-router-dom"
import { Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { relativeShort } from "@/lib/formatDate"
import type { ChatListItem as ChatListItemType } from "@/types/domain"

interface ChatListItemProps {
  chat: ChatListItemType
  active: boolean
  onAskDelete: (chat: ChatListItemType) => void
}

export function ChatListItem({ chat, active, onAskDelete }: ChatListItemProps) {
  const navigate = useNavigate()
  const title = chat.titulo ?? "Sem título"

  return (
    <div
      className={cn(
        "group relative cursor-pointer rounded-lg px-3 py-2 transition-colors duration-150",
        active ? "bg-elevated" : "hover:bg-elevated/70",
      )}
      onClick={() => navigate(`/app/c/${chat.id}`)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13.5px] font-medium leading-snug text-ink">
            {title}
          </div>
          {chat.ultima_mensagem_preview && (
            <div className="mt-0.5 truncate text-[12px] leading-snug text-mute">
              {chat.ultima_mensagem_preview}
            </div>
          )}
        </div>

        <span className="shrink-0 text-[11px] tabular-nums leading-tight text-mute">
          {relativeShort(chat.atualizado_em)}
        </span>
      </div>

      <div className="pointer-events-none absolute right-2 top-1.5 flex gap-1 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
        <button
          type="button"
          aria-label="Arquivar conversa"
          title="Arquivar"
          onClick={(e) => {
            e.stopPropagation()
            onAskDelete(chat)
          }}
          className="grid h-6 w-6 place-items-center rounded bg-paper text-mute transition-colors duration-200 hover:text-danger"
        >
          <Trash2 className="h-3 w-3" strokeWidth={1.6} />
        </button>
      </div>
    </div>
  )
}
