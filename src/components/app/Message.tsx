import { useState } from "react"
import { AlertTriangle, Copy, Check, RefreshCcw } from "lucide-react"
import { AnalysisCard } from "./AnalysisCard"
import { Markdown } from "./Markdown"
import type { MessageResponse } from "@/types/domain"

export interface MessageItem extends MessageResponse {
  /** Mensagem em construção via stream (mostra cursor pulsante). */
  streaming?: boolean
  /** Falha ocorrida durante streaming — exibe alerta + retry. */
  failed?: boolean
}

interface MessageProps {
  message: MessageItem
  onRegenerate?: (messageId: string) => void
  onRetry?: () => void
}

export function Message({ message, onRegenerate, onRetry }: MessageProps) {
  if (message.role === "user") {
    return <UserBubble content={message.content} />
  }
  if (message.payload_json) {
    return (
      <div className="my-8">
        <AnalysisCard payload={message.payload_json} />
      </div>
    )
  }
  return (
    <AssistantBubble
      message={message}
      onRegenerate={onRegenerate}
      onRetry={onRetry}
    />
  )
}

function UserBubble({ content }: { content: string }) {
  return (
    <div className="my-6 flex justify-end">
      <div
        className="max-w-[70%] border border-line bg-surface px-4 py-2.5 text-[14.5px] leading-relaxed text-ink"
        style={{ borderRadius: 4 }}
      >
        {content.split("\n").map((l, i) => (
          <span key={i}>
            {l}
            {i < content.split("\n").length - 1 && <br />}
          </span>
        ))}
      </div>
    </div>
  )
}

function AssistantBubble({
  message,
  onRegenerate,
  onRetry,
}: {
  message: MessageItem
  onRegenerate?: (id: string) => void
  onRetry?: () => void
}) {
  const [copied, setCopied] = useState(false)

  const canRegenerate = !message.streaming && !message.failed && Boolean(onRegenerate)

  async function copy() {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard pode falhar silenciosamente em http inseguro */
    }
  }

  return (
    <div className="group my-6 flex justify-start">
      <div className="w-full max-w-[680px] border-l-2 border-accent pl-5">
        <div className={message.failed ? "opacity-60" : undefined}>
          <Markdown source={message.content} />
          {message.streaming && (
            <span
              aria-hidden
              className="ml-0.5 inline-block h-[1.1em] w-[6px] -translate-y-[2px] align-middle bg-accent"
              style={{ animation: "cj-blink 0.9s steps(2) infinite" }}
            />
          )}
        </div>

        {message.failed && (
          <div className="mt-3 flex items-center gap-2 border border-danger/40 bg-paper px-3 py-2" style={{ borderRadius: 4 }}>
            <AlertTriangle className="h-3.5 w-3.5 text-danger" strokeWidth={1.5} />
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-danger">
              Resposta interrompida
            </span>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="ml-auto font-mono text-[11px] uppercase tracking-[0.14em] text-accent transition-colors duration-200 hover:text-accent-soft"
              >
                Tentar novamente
              </button>
            )}
          </div>
        )}

        {!message.streaming && !message.failed && (
          <div className="mt-2 flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <button
              type="button"
              onClick={copy}
              aria-label="Copiar resposta"
              title="Copiar"
              className="inline-flex items-center gap-1 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-stone transition-colors duration-200 hover:text-ink"
            >
              {copied ? (
                <Check className="h-3 w-3" strokeWidth={1.5} />
              ) : (
                <Copy className="h-3 w-3" strokeWidth={1.5} />
              )}
              {copied ? "copiado" : "copiar"}
            </button>
            {canRegenerate && (
              <button
                type="button"
                onClick={() => onRegenerate?.(message.id)}
                aria-label="Regenerar resposta"
                title="Regenerar"
                className="inline-flex items-center gap-1 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-stone transition-colors duration-200 hover:text-accent"
              >
                <RefreshCcw className="h-3 w-3" strokeWidth={1.5} />
                regenerar
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes cj-blink {
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
