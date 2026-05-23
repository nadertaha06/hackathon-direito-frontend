import { useEffect, useRef, useState } from "react"
import { LogOut, User2 } from "lucide-react"
import { emailStore } from "@/services/auth"
import { logout } from "@/hooks/useAuth"

export function UserMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const email = emailStore.get() ?? "usuário"
  const initials = email.slice(0, 2).toUpperCase()

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener("mousedown", onClick)
    return () => window.removeEventListener("mousedown", onClick)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex w-full items-center gap-2.5 border border-line bg-paper px-2.5 py-2 text-left transition-colors duration-200 hover:border-stone/60"
        style={{ borderRadius: 4 }}
      >
        <span
          className="grid h-7 w-7 shrink-0 place-items-center bg-accent font-mono text-[10px] font-medium tracking-wider text-white"
          style={{ borderRadius: 2 }}
        >
          {initials}
        </span>
        <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-stone">{email}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute bottom-full left-0 mb-2 w-full border border-line bg-elevated shadow-[var(--shadow-card)]"
          style={{ borderRadius: 4 }}
        >
          <a
            href="/app"
            role="menuitem"
            className="flex items-center gap-2 px-3 py-2.5 text-[13px] text-stone transition-colors duration-200 hover:bg-surface hover:text-ink"
          >
            <User2 className="h-3.5 w-3.5" strokeWidth={1.5} />
            Minha conta
          </a>
          <button
            type="button"
            role="menuitem"
            onClick={logout}
            className="flex w-full items-center gap-2 border-t border-line px-3 py-2.5 text-left text-[13px] text-accent transition-colors duration-200 hover:bg-surface"
          >
            <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
            Sair
          </button>
        </div>
      )}
    </div>
  )
}
