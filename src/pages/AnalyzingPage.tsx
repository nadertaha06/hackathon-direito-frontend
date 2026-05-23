import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import { AnalysisInProgress } from "@/components/app/AnalysisInProgress"
import { usePendingAnalyses } from "@/hooks/usePendingAnalyses"

/**
 * /app/analyzing/:tempId — tela do progresso de uma análise em andamento.
 * O processamento real está no PendingAnalysisProvider; aqui só lemos o estado
 * pelo tempId. Quando vira `done`, redireciona pro chat criado.
 */
export function AnalyzingPage() {
  const { tempId = "" } = useParams<{ tempId: string }>()
  const navigate = useNavigate()
  const { getByTempId, dismiss } = usePendingAnalyses()
  const entry = getByTempId(tempId)

  // Auto-redirect quando a análise termina.
  useEffect(() => {
    if (entry?.status === "done" && entry.chatId) {
      navigate(`/app/c/${entry.chatId}`, { replace: true })
    }
  }, [entry?.status, entry?.chatId, navigate])

  if (!entry) {
    return (
      <div className="mx-auto flex w-full max-w-[520px] flex-1 flex-col items-center justify-center px-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-mute">
          Análise não encontrada
        </p>
        <h2 className="mt-3 font-display text-[26px] font-medium text-ink">
          Essa análise já foi concluída ou expirou.
        </h2>
        <button
          type="button"
          onClick={() => navigate("/app", { replace: true })}
          className="mt-6 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent transition-colors duration-200 hover:text-accent-soft"
        >
          <ArrowLeft className="h-3 w-3" strokeWidth={1.5} />
          Voltar ao início
        </button>
      </div>
    )
  }

  if (entry.status === "error") {
    return (
      <div className="mx-auto flex w-full max-w-[520px] flex-1 flex-col justify-center px-6 py-16">
        <span
          className="grid h-10 w-10 place-items-center border border-danger/40 bg-paper text-danger"
          style={{ borderRadius: "50%" }}
        >
          <AlertTriangle className="h-4 w-4" strokeWidth={1.5} />
        </span>

        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-danger">
          Análise não pôde ser concluída
        </p>
        <h1 className="mt-3 font-display text-[clamp(1.75rem,3vw,2.25rem)] font-medium leading-[1.06] tracking-[-0.01em] text-ink">
          {entry.errorMessage ?? "Algo deu errado."}
        </h1>
        <p className="mt-3 font-mono text-[12px] text-mute">{entry.fileName}</p>

        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              dismiss(entry.tempId)
              navigate("/app", { replace: true })
            }}
            className="inline-flex items-center gap-2 border border-accent bg-accent px-4 py-2.5 font-sans text-[13px] font-bold text-white transition-colors duration-200 hover:bg-accent-soft"
            style={{ borderRadius: 4 }}
          >
            Voltar e tentar outro PDF
          </button>
          <button
            type="button"
            onClick={() => dismiss(entry.tempId)}
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-mute transition-colors duration-200 hover:text-stone"
          >
            Dispensar
          </button>
        </div>
      </div>
    )
  }

  // status === "running" ou "done" (transição — o redirect já está em rota)
  return (
    <AnalysisInProgress startedAt={entry.startedAt} fileName={entry.fileName} />
  )
}
