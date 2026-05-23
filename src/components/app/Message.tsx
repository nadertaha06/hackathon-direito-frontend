import { useState } from "react"
import { AlertTriangle, Copy, Check, RefreshCcw } from "lucide-react"
import { AnalysisCard } from "./AnalysisCard"
import { Markdown } from "./Markdown"
import type { MessageResponse } from "@/types/domain"

export interface MessageItem extends MessageResponse {
  streaming?: boolean
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
      <div className="my-6">
        <AnalysisCard payload={message.payload_json} />
      </div>
    )
  }
  return (
    <Assistant
      message={message}
      onRegenerate={onRegenerate}
      onRetry={onRetry}
    />
  )
}

/** Mensagem do usuário — bubble macio à direita, estilo Claude. */
function UserBubble({ content }: { content: string }) {
  return (
    <div className="my-4 flex justify-end">
      <div
        className="max-w-[78%] bg-surface px-4 py-3 text-[15px] leading-relaxed text-ink"
        style={{ borderRadius: 18 }}
      >
        <p className="whitespace-pre-wrap break-words">{content}</p>
      </div>
    </div>
  )
}

/** Resposta da IA — texto puro à esquerda, sem caixa nem filete. */
function Assistant({
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
      /* contexto não-https — silencioso */
    }
  }

  return (
    <article className="group my-6">
      <div className={message.failed ? "opacity-60" : undefined}>
        <Markdown source={message.content} />
        {message.streaming && <span aria-hidden className="typing-caret" />}
      </div>

      {message.failed && (
        <div
          className="mt-3 flex items-center gap-2 border border-danger/40 bg-elevated px-3 py-2"
          style={{ borderRadius: 8 }}
        >
          <AlertTriangle className="h-3.5 w-3.5 text-danger" strokeWidth={1.5} />
          <span className="text-[12px] text-danger">Resposta interrompida</span>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="ml-auto text-[12px] font-medium text-accent transition-colors duration-200 hover:text-accent-soft"
            >
              Tentar novamente
            </button>
          )}
        </div>
      )}

      {!message.streaming && !message.failed && (
        <div className="mt-1 flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            type="button"
            onClick={copy}
            aria-label="Copiar resposta"
            title="Copiar"
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] text-mute transition-colors duration-200 hover:bg-surface hover:text-ink"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" strokeWidth={1.8} />
            ) : (
              <Copy className="h-3.5 w-3.5" strokeWidth={1.8} />
            )}
            {copied ? "Copiado" : "Copiar"}
          </button>
          {canRegenerate && (
            <button
              type="button"
              onClick={() => onRegenerate?.(message.id)}
              aria-label="Regenerar resposta"
              title="Regenerar"
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] text-mute transition-colors duration-200 hover:bg-surface hover:text-accent"
            >
              <RefreshCcw className="h-3.5 w-3.5" strokeWidth={1.8} />
              Regenerar
            </button>
          )}
        </div>
      )}
    </article>
  )
}
