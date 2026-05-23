import { useRef, useState } from "react"
import type { DragEvent } from "react"
import { FileUp, MessageSquarePlus, Upload } from "lucide-react"

interface EmptyStateProps {
  onPdfSelected: (file: File) => void
  onAskQuestion: () => void
}

export function EmptyState({ onPdfSelected, onAskQuestion }: EmptyStateProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type === "application/pdf") onPdfSelected(file)
  }

  return (
    <div className="mx-auto flex w-full max-w-[820px] flex-1 flex-col justify-center px-6 py-16">
      <div className="mb-12 max-w-[36ch]">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
          Contrato Justo
        </p>
        <h1 className="mt-4 font-display text-[clamp(2.25rem,4vw,3rem)] font-medium leading-[1.04] tracking-[-0.015em] text-ink">
          Por onde começar?
        </h1>
        <p className="mt-3 max-w-[42ch] text-[15px] leading-relaxed text-stone">
          Envie um contrato para uma análise fundamentada na lei, ou tire uma dúvida
          pontual sobre cláusulas.
        </p>
      </div>

      <div className="grid gap-px bg-line md:grid-cols-2">
        {/* Card 1 — drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`group relative flex flex-col bg-paper p-8 transition-colors duration-200 ${
            dragOver ? "bg-surface" : ""
          }`}
        >
          <div className="mb-6 flex items-center gap-3">
            <span
              className="grid h-9 w-9 place-items-center border border-line bg-elevated text-accent"
              style={{ borderRadius: 4 }}
            >
              <FileUp className="h-4 w-4" strokeWidth={1.5} />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">
              01 · análise
            </span>
          </div>

          <h2 className="font-display text-[24px] font-medium leading-tight tracking-[-0.01em] text-ink">
            Analisar contrato
          </h2>
          <p className="mt-2 max-w-[38ch] text-[14px] leading-relaxed text-stone">
            PDF de até 5MB. A análise extrai cláusulas, identifica abusivas e
            fundamenta cada uma com dispositivos legais.
          </p>

          <div className="mt-auto pt-8">
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) onPdfSelected(file)
                e.target.value = ""
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 border border-accent bg-accent px-4 py-2.5 font-sans text-[13px] font-bold text-white transition-colors duration-200 hover:bg-accent-soft"
              style={{ borderRadius: 4 }}
            >
              <Upload className="h-4 w-4" strokeWidth={1.5} />
              Enviar PDF
            </button>
            <p className="mt-3 font-mono text-[11px] text-mute">
              ou solte o arquivo nesta área
            </p>
          </div>

          {dragOver && (
            <div className="pointer-events-none absolute inset-3 flex items-center justify-center border-2 border-dashed border-accent bg-surface/80 font-mono text-[12px] uppercase tracking-[0.12em] text-accent">
              Soltar para enviar
            </div>
          )}
        </div>

        {/* Card 2 — standalone chat */}
        <div className="flex flex-col bg-paper p-8">
          <div className="mb-6 flex items-center gap-3">
            <span
              className="grid h-9 w-9 place-items-center border border-line bg-elevated text-accent"
              style={{ borderRadius: 4 }}
            >
              <MessageSquarePlus className="h-4 w-4" strokeWidth={1.5} />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">
              02 · dúvida
            </span>
          </div>

          <h2 className="font-display text-[24px] font-medium leading-tight tracking-[-0.01em] text-ink">
            Tirar dúvida
          </h2>
          <p className="mt-2 max-w-[38ch] text-[14px] leading-relaxed text-stone">
            Pergunte sobre uma cláusula específica, multa, prazo de fidelidade,
            cobrança indevida. Sem precisar enviar o contrato inteiro.
          </p>

          <div className="mt-auto pt-8">
            <button
              type="button"
              onClick={onAskQuestion}
              className="inline-flex items-center gap-2 border border-accent bg-paper px-4 py-2.5 font-sans text-[13px] font-bold text-accent transition-colors duration-200 hover:bg-accent hover:text-white"
              style={{ borderRadius: 4 }}
            >
              Começar conversa
            </button>
            <p className="mt-3 font-mono text-[11px] text-mute">
              cita o artigo, cobra a fonte
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
