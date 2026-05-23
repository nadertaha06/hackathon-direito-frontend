import { useEffect, useRef, useState } from "react"
import { FileUp, MessageSquarePlus, Plus } from "lucide-react"

interface NewChatPopoverProps {
  onAnalyzePdf: () => void
  onAskQuestion: () => void
}

export function NewChatPopover({ onAnalyzePdf, onAskQuestion }: NewChatPopoverProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("mousedown", onClick)
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("mousedown", onClick)
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="group flex w-full items-center justify-center gap-2 border border-accent bg-transparent px-3 py-2.5 font-sans text-[13px] font-bold text-accent transition-colors duration-200 hover:bg-accent hover:text-white"
        style={{ borderRadius: 4 }}
      >
        <Plus className="h-4 w-4" strokeWidth={1.5} />
        Novo chat
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 right-0 top-full z-20 mt-2 border border-line bg-elevated shadow-[var(--shadow-card)]"
          style={{ borderRadius: 4 }}
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              onAnalyzePdf()
            }}
            className="flex w-full items-start gap-3 border-b border-line p-3 text-left transition-colors duration-200 hover:bg-surface"
          >
            <FileUp className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.5} />
            <span className="min-w-0">
              <span className="block font-sans text-[13px] font-bold text-ink">
                Analisar contrato (PDF)
              </span>
              <span className="mt-0.5 block text-[12px] leading-snug text-stone">
                Envie um PDF e receba uma análise fundamentada na lei.
              </span>
            </span>
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              onAskQuestion()
            }}
            className="flex w-full items-start gap-3 p-3 text-left transition-colors duration-200 hover:bg-surface"
          >
            <MessageSquarePlus
              className="mt-0.5 h-4 w-4 shrink-0 text-accent"
              strokeWidth={1.5}
            />
            <span className="min-w-0">
              <span className="block font-sans text-[13px] font-bold text-ink">
                Tirar dúvida sobre cláusula
              </span>
              <span className="mt-0.5 block text-[12px] leading-snug text-stone">
                Pergunta pontual sem precisar de PDF.
              </span>
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
