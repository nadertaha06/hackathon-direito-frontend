import { useEffect, useRef, useState } from "react"
import type { DragEvent, KeyboardEvent } from "react"
import toast from "react-hot-toast"
import { ArrowUp, Paperclip, Square } from "lucide-react"

interface ChatInputProps {
  /** Quando true, anexar PDF abre o fluxo de análise. Quando false, avisa que já existe análise. */
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

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = "0px"
    const h = Math.min(el.scrollHeight, 8 * 22 + 24)
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

  function handleFile(file: File | null | undefined) {
    if (!file) return
    if (!allowUpload || !onPdfDropped) {
      toast("Este processo já tem uma análise. Abra uma nova conversa para outro contrato.", {
        icon: "📄",
      })
      return
    }
    if (file.type !== "application/pdf") {
      toast.error("Envie um PDF.")
      return
    }
    onPdfDropped(file)
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className="relative"
    >
      <div
        className={`relative flex flex-col bg-elevated shadow-card transition-all duration-200 ${
          dragOver ? "ring-2 ring-accent/60" : "ring-1 ring-line/80"
        }`}
        style={{ borderRadius: 18 }}
      >
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
              : "Pergunte sobre cláusulas, prazos, multas — ou anexe um PDF"
          }
          className="min-h-[28px] w-full resize-none bg-transparent px-5 pt-4 pb-1 font-sans text-[15px] leading-relaxed text-ink placeholder:text-mute focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        />

        <div className="flex items-center justify-between gap-2 px-3 pb-3 pt-1">
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              handleFile(file)
              e.target.value = ""
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            aria-label="Anexar PDF do contrato"
            title={allowUpload ? "Anexar PDF" : "Já existe análise nesta conversa"}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-stone transition-colors duration-200 hover:bg-surface hover:text-accent"
          >
            <Paperclip className="h-4 w-4" strokeWidth={1.6} />
          </button>

          {streaming ? (
            <button
              type="button"
              onClick={onStop}
              aria-label="Parar geração"
              title="Parar"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-paper transition-colors duration-200 hover:bg-accent"
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
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-paper transition-all duration-200 hover:bg-accent-soft disabled:cursor-not-allowed disabled:bg-line disabled:text-mute"
            >
              <ArrowUp className="h-4 w-4" strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      <p className="mt-2 text-center text-[11px] text-mute">
        Contrato Justo pode cometer enganos. Confira as fontes citadas antes de decidir.
      </p>

      {dragOver && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 grid place-items-center font-mono text-[11px] uppercase tracking-[0.20em] text-accent"
          style={{
            height: "calc(100% - 28px)",
            borderRadius: 18,
            background: "rgba(255, 253, 249, 0.92)",
            border: "2px dashed var(--color-accent)",
          }}
        >
          {allowUpload ? "Soltar para analisar" : "Esta conversa já tem análise"}
        </div>
      )}
    </div>
  )
}
