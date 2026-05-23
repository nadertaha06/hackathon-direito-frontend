import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Pencil, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { relativeShort } from "@/lib/formatDate"
import type { ChatResponse } from "@/types/domain"

interface ChatListItemProps {
  chat: ChatResponse
  active: boolean
  onRename: (id: string, title: string) => void
  onAskDelete: (chat: ChatResponse) => void
}

export function ChatListItem({ chat, active, onRename, onAskDelete }: ChatListItemProps) {
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(chat.titulo)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setDraft(chat.titulo)
  }, [chat.titulo])

  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  function commit() {
    const next = draft.trim()
    setEditing(false)
    if (next && next !== chat.titulo) onRename(chat.id, next)
    else setDraft(chat.titulo)
  }

  return (
    <div
      className={cn(
        "group relative cursor-pointer px-3 py-2.5 transition-colors duration-200",
        active ? "bg-elevated" : "hover:bg-elevated/60",
      )}
      onClick={() => !editing && navigate(`/app/c/${chat.id}`)}
    >
      {active && (
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-[2px] bg-accent"
        />
      )}

      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          {editing ? (
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === "Enter") commit()
                if (e.key === "Escape") {
                  setEditing(false)
                  setDraft(chat.titulo)
                }
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-full border border-accent bg-paper px-1.5 py-0.5 font-sans text-[14px] font-medium text-ink outline-none"
              style={{ borderRadius: 2 }}
            />
          ) : (
            <div
              className="truncate font-sans text-[14px] font-bold leading-tight text-ink"
              onDoubleClick={(e) => {
                e.stopPropagation()
                setEditing(true)
              }}
            >
              {chat.titulo}
            </div>
          )}

          {chat.ultima_mensagem_preview && !editing && (
            <div className="mt-1 truncate font-sans text-[12px] leading-snug text-mute">
              {chat.ultima_mensagem_preview}
            </div>
          )}
        </div>

        <span className="font-mono text-[11px] tabular-nums leading-tight text-mute">
          {relativeShort(chat.atualizado_em)}
        </span>
      </div>

      {!editing && (
        <div className="pointer-events-none absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
          <button
            type="button"
            aria-label="Renomear chat"
            title="Renomear"
            onClick={(e) => {
              e.stopPropagation()
              setEditing(true)
            }}
            className="grid h-6 w-6 place-items-center bg-paper text-stone transition-colors duration-200 hover:text-ink"
            style={{ borderRadius: 2 }}
          >
            <Pencil className="h-3 w-3" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Arquivar chat"
            title="Arquivar"
            onClick={(e) => {
              e.stopPropagation()
              onAskDelete(chat)
            }}
            className="grid h-6 w-6 place-items-center bg-paper text-stone transition-colors duration-200 hover:text-danger"
            style={{ borderRadius: 2 }}
          >
            <Trash2 className="h-3 w-3" strokeWidth={1.5} />
          </button>
        </div>
      )}
    </div>
  )
}
