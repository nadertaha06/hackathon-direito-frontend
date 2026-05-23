import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AlertTriangle, Check, X } from "lucide-react"
import { formatElapsed } from "@/lib/formatDate"
import { cn } from "@/lib/utils"
import type { PendingAnalysis } from "@/hooks/usePendingAnalyses"

interface Props {
  entry: PendingAnalysis
  onDismiss: (tempId: string) => void
}

/**
 * Item da seção "Em análise" da Sidebar. Mostra estado em tempo real:
 * - running: spinner discreto + cronômetro mono
 * - done: check verde, navega pro chat ao clicar
 * - error: alerta vermelho + botão dispensar
 */
export function PendingAnalysisItem({ entry, onDismiss }: Props) {
  const navigate = useNavigate()
  const { tempId: routeTempId } = useParams<{ tempId: string }>()
  const isActive = routeTempId === entry.tempId

  const [elapsed, setElapsed] = useState(() => Date.now() - entry.startedAt)
  useEffect(() => {
    if (entry.status !== "running") return
    const tick = setInterval(() => setElapsed(Date.now() - entry.startedAt), 1000)
    return () => clearInterval(tick)
  }, [entry.status, entry.startedAt])

  function handleClick() {
    if (entry.status === "done" && entry.chatId) {
      navigate(`/app/c/${entry.chatId}`)
    } else if (entry.status === "running") {
      navigate(`/app/analyzing/${entry.tempId}`)
    }
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "group relative cursor-pointer px-3 py-2.5 transition-colors duration-200",
        isActive ? "bg-elevated" : "hover:bg-elevated/60",
      )}
    >
      {isActive && (
        <span aria-hidden className="absolute inset-y-0 left-0 w-[2px] bg-accent" />
      )}

      <div className="flex items-start gap-2.5">
        <StatusBadge status={entry.status} />

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
              {entry.status === "running"
                ? "Analisando"
                : entry.status === "done"
                  ? "Concluído"
                  : "Falhou"}
            </span>
            {entry.status === "running" && (
              <span className="ml-auto font-mono text-[11px] tabular-nums text-mute">
                {formatElapsed(elapsed)}
              </span>
            )}
          </div>
          <div className="mt-1 truncate font-sans text-[13px] leading-tight text-ink">
            {entry.fileName}
          </div>
          {entry.status === "error" && entry.errorMessage && (
            <div className="mt-1 line-clamp-2 text-[11px] leading-snug text-danger">
              {entry.errorMessage}
            </div>
          )}
        </div>

        {entry.status === "error" && (
          <button
            type="button"
            aria-label="Dispensar"
            onClick={(e) => {
              e.stopPropagation()
              onDismiss(entry.tempId)
            }}
            className="grid h-6 w-6 shrink-0 place-items-center text-stone transition-colors duration-200 hover:text-ink"
            style={{ borderRadius: 2 }}
          >
            <X className="h-3 w-3" strokeWidth={1.5} />
          </button>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: PendingAnalysis["status"] }) {
  if (status === "done") {
    return (
      <span
        aria-hidden
        className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center border border-success/40 bg-success/10 text-success"
        style={{ borderRadius: "50%" }}
      >
        <Check className="h-3 w-3" strokeWidth={2} />
      </span>
    )
  }
  if (status === "error") {
    return (
      <span
        aria-hidden
        className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center border border-danger/40 bg-danger/10 text-danger"
        style={{ borderRadius: "50%" }}
      >
        <AlertTriangle className="h-3 w-3" strokeWidth={1.5} />
      </span>
    )
  }
  // running — anel pulsante hairline
  return (
    <span
      aria-hidden
      className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center"
      style={{ borderRadius: "50%" }}
    >
      <span
        className="block h-2.5 w-2.5 bg-accent"
        style={{
          borderRadius: "50%",
          animation: "cj-pulse 1.6s ease-in-out infinite",
        }}
      />
      <style>{`
        @keyframes cj-pulse {
          0%, 100% { opacity: 0.35; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </span>
  )
}
