import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react"
import type { ReactNode } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { analisarPdf } from "@/services/chats"
import { handleAuthError } from "@/lib/handleAuthError"
import { useChats } from "@/hooks/useChats"
import type { ChatListItem } from "@/types/domain"

export type PendingStatus = "running" | "done" | "error"

export interface PendingAnalysis {
  tempId: string
  fileName: string
  startedAt: number
  status: PendingStatus
  /** id real do chat após /analisar resolver. */
  chatId?: string
  tipoContrato?: string
  errorMessage?: string
}

interface CtxValue {
  pending: PendingAnalysis[]
  /** Dispara uma nova análise em background. Retorna o tempId pro chamador
   *  navegar até /app/analyzing/:tempId. */
  startAnalysis: (file: File) => string
  dismiss: (tempId: string) => void
  getByTempId: (tempId: string) => PendingAnalysis | undefined
}

const Ctx = createContext<CtxValue | null>(null)

/**
 * Análises em andamento ficam no contexto, NÃO no estado local da página.
 * Assim o usuário navega entre chats enquanto o PDF é processado pelo back
 * (~90s); ao terminar, um toast oferece "Abrir" e a sidebar reflete a entrada
 * como concluída. Múltiplas análises simultâneas são suportadas.
 */
export function PendingAnalysisProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<PendingAnalysis[]>([])
  const navigate = useNavigate()
  const location = useLocation()
  const { upsertLocal, refresh } = useChats()

  // Ref pra location porque a navegação pode acontecer durante o stream e o
  // useCallback precisaria reidratar — guardar em ref evita closure stale.
  const locationRef = useRef(location)
  locationRef.current = location

  const startAnalysis = useCallback(
    (file: File): string => {
      const tempId = `pan-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      setPending((prev) => [
        {
          tempId,
          fileName: file.name,
          startedAt: Date.now(),
          status: "running",
        },
        ...prev,
      ])

      void (async () => {
        try {
          const result = await analisarPdf(file)

          // Sidebar otimista — o refresh logo depois pega titulo canônico/etc.
          const item: ChatListItem = {
            id: result.chat_id,
            analise_id: result.analise_id,
            titulo: `Análise — ${result.tipo_contrato}`,
            criado_em: new Date().toISOString(),
            atualizado_em: new Date().toISOString(),
            deletado_em: null,
            ultima_mensagem_preview:
              result.resumo_executivo?.slice(0, 80) ?? null,
          }
          upsertLocal(item)
          void refresh()

          setPending((prev) =>
            prev.map((p) =>
              p.tempId === tempId
                ? {
                    ...p,
                    status: "done",
                    chatId: result.chat_id,
                    tipoContrato: result.tipo_contrato,
                  }
                : p,
            ),
          )

          const onAnalyzingPage =
            locationRef.current.pathname === `/app/analyzing/${tempId}`

          if (onAnalyzingPage) {
            navigate(`/app/c/${result.chat_id}`, { replace: true })
          } else {
            // Toast persistente com ação — visível em qualquer rota.
            toast.success(
              (t) => (
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-success">
                      Análise concluída
                    </span>
                    <span className="text-[13px] text-ink">
                      {result.tipo_contrato}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      toast.dismiss(t.id)
                      navigate(`/app/c/${result.chat_id}`)
                    }}
                    className="ml-3 border border-accent px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-accent transition-colors duration-200 hover:bg-accent hover:text-white"
                    style={{ borderRadius: 2 }}
                  >
                    Abrir
                  </button>
                </div>
              ),
              { duration: 10000 },
            )
          }

          // Limpa a entrada da sidebar passado um tempo (continua na lista geral).
          setTimeout(() => {
            setPending((prev) => prev.filter((p) => p.tempId !== tempId))
          }, 20_000)
        } catch (err) {
          const msg = handleAuthError(err) ?? "Falha ao analisar o contrato."
          setPending((prev) =>
            prev.map((p) =>
              p.tempId === tempId
                ? { ...p, status: "error", errorMessage: msg }
                : p,
            ),
          )
          if (msg) toast.error(msg)
        }
      })()

      return tempId
    },
    [navigate, refresh, upsertLocal],
  )

  const dismiss = useCallback((tempId: string) => {
    setPending((prev) => prev.filter((p) => p.tempId !== tempId))
  }, [])

  const getByTempId = useCallback(
    (tempId: string) => pending.find((p) => p.tempId === tempId),
    [pending],
  )

  return (
    <Ctx.Provider value={{ pending, startAnalysis, dismiss, getByTempId }}>
      {children}
    </Ctx.Provider>
  )
}

export function usePendingAnalyses(): CtxValue {
  const v = useContext(Ctx)
  if (!v) {
    throw new Error("usePendingAnalyses fora de <PendingAnalysisProvider>")
  }
  return v
}
