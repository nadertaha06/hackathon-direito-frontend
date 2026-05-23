import { useEffect, useRef, useState } from "react"
import type { DragEvent, KeyboardEvent } from "react"
import { ArrowUp, Paperclip, Square } from "lucide-react"

interface ChatInputProps {
  /** Quando true, mostra paperclip de upload (chat standalone). */
  allowUpload: boolean
  /** Streaming em andamento — desabilita envio, botão vira "parar". */
  streaming: boolean
  onSend: (content: string) => void
  onStop?: () => void
  onPdfDropped?: (file: File) => void
}

export function ChatInput({
  allowUpload,
  streaming,
  onSend,
  onStop,
  onPdfDropped,
}: ChatInputProps) {
  const [value, setValue] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const ref = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // Auto-resize: 1 linha mínimo, ~6 linhas máximo.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = "0px"
    const h = Math.min(el.scrollHeight, 6 * 22 + 24)
    el.style.height = `${h}px`
  }, [value])

  function submit() {
    const next = value.trim()
    if (!next || streaming) return
    onSend(next)
    setValue("")
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragOver(false)
    if (!allowUpload || !onPdfDropped) return
    const file = e.dataTransfer.files?.[0]
    if (file && file.type === "application/pdf") onPdfDropped(file)
  }

  return (
    <div
      onDragOver={(e) => {
        if (!allowUpload) return
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`relative border border-line bg-surface transition-colors duration-200 ${
        dragOver ? "border-accent bg-elevated" : ""
      }`}
      style={{ borderRadius: 4 }}
    >
      <div className="flex items-end gap-2 p-3">
        {allowUpload && (
          <>
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file && onPdfDropped) onPdfDropped(file)
                e.target.value = ""
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              aria-label="Anexar PDF"
              title="Anexar PDF para analisar"
              className="grid h-9 w-9 shrink-0 place-items-center text-stone transition-colors duration-200 hover:text-accent"
            >
              <Paperclip className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </>
        )}

        <textarea
          ref={ref}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={streaming}
          placeholder={
            streaming
              ? "Aguardando resposta…"
              : allowUpload
                ? "Pergunte sobre uma cláusula ou solte um PDF aqui"
                : "Pergunte algo sobre esta análise"
          }
          className="min-h-[24px] flex-1 resize-none bg-transparent py-1.5 font-sans text-[15px] leading-relaxed text-ink placeholder:text-mute focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        />

        {streaming ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Parar geração"
            title="Parar"
            className="grid h-9 w-9 shrink-0 place-items-center bg-ink text-paper transition-colors duration-200 hover:bg-accent"
            style={{ borderRadius: 2 }}
          >
            <Square className="h-3.5 w-3.5" strokeWidth={1.5} fill="currentColor" />
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={!value.trim()}
            aria-label="Enviar"
            title="Enviar (Enter)"
            className="grid h-9 w-9 shrink-0 place-items-center bg-accent text-white transition-colors duration-200 hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-40"
            style={{ borderRadius: 2 }}
          >
            <ArrowUp className="h-4 w-4" strokeWidth={1.5} />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-line px-3 py-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
          {allowUpload ? "Enter envia · Shift+Enter quebra linha · arraste PDF" : "Enter envia · Shift+Enter quebra linha"}
        </span>
      </div>

      {dragOver && allowUpload && (
        <div
          className="pointer-events-none absolute inset-1 grid place-items-center border-2 border-dashed border-accent bg-elevated/80 font-mono text-[12px] uppercase tracking-[0.14em] text-accent"
          style={{ borderRadius: 4 }}
        >
          Soltar para analisar
        </div>
      )}
    </div>
  )
}
