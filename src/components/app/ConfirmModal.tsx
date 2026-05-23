import { useEffect } from "react"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface ConfirmModalProps {
  open: boolean
  title: string
  description: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/**
 * Modal genérico de confirmação. Sem backdrop-blur, sem motion lib — só
 * fade CSS via animação de duração curta. Foco move-se pro confirm ao abrir.
 */
export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  destructive,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cm-title"
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(20, 19, 15, 0.5)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <div
        className="w-full max-w-[400px] border border-line bg-paper p-7"
        style={{ borderRadius: 4, animation: "cm-in 200ms var(--ease-editorial)" }}
      >
        <h3 id="cm-title" className="font-display text-[22px] leading-tight tracking-[-0.01em] text-ink">
          {title}
        </h3>
        <div className="mt-3 text-[14px] leading-relaxed text-stone">{description}</div>
        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-10 items-center justify-center border border-line bg-paper px-4 font-sans text-[14px] font-bold text-ink transition-colors duration-200 hover:border-stone/60"
            style={{ borderRadius: 4 }}
          >
            {cancelLabel}
          </button>
          <Button
            type="button"
            size="md"
            variant={destructive ? "primary" : "primary"}
            onClick={onConfirm}
            className="h-10"
            style={{ borderRadius: 4 }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
      <style>{`
        @keyframes cm-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
