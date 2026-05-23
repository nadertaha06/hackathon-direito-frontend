import { useEffect, useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { Menu, X } from "lucide-react"
import { Sidebar } from "./Sidebar"
import { Wordmark } from "@/components/Wordmark"
import { useChats } from "@/hooks/useChats"
import { useAuthGuard } from "@/hooks/useAuth"
import { usePendingAnalyses } from "@/hooks/usePendingAnalyses"

/**
 * Shell autenticado: sidebar fixa + Outlet. NÃO mantém estado de análise em
 * andamento — isso vive no PendingAnalysisProvider para sobreviver a navegações
 * entre rotas (o usuário deve poder abrir outro chat enquanto o PDF processa).
 */
export function AppLayout() {
  const token = useAuthGuard()
  const navigate = useNavigate()
  const location = useLocation()
  const { createStandalone } = useChats()
  const { startAnalysis } = usePendingAnalyses()
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Drawer fecha ao navegar (mobile).
  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!drawerOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [drawerOpen])

  if (!token) return null

  function handlePdfSelected(file: File) {
    if (file.type !== "application/pdf") {
      toast.error("Envie um PDF.")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Arquivo acima de 10MB.")
      return
    }
    const tempId = startAnalysis(file)
    navigate(`/app/analyzing/${tempId}`)
  }

  async function handleAskQuestion() {
    const chat = await createStandalone()
    if (chat) navigate(`/app/c/${chat.id}`)
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-paper">
      {/* Sidebar desktop */}
      <div className="hidden h-full w-[280px] shrink-0 border-r border-line md:block">
        <Sidebar onAnalyzePdf={triggerUpload} onAskQuestion={handleAskQuestion} />
      </div>

      {/* Sidebar drawer mobile */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0"
            style={{ background: "rgba(20, 19, 15, 0.5)" }}
            onClick={() => setDrawerOpen(false)}
          />
          <div
            className="absolute inset-y-0 left-0 w-[280px] border-r border-line bg-surface"
            style={{ animation: "drawer-in 240ms var(--ease-editorial)" }}
          >
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Fechar menu"
              className="absolute right-3 top-5 grid h-8 w-8 place-items-center text-stone transition-colors duration-200 hover:text-ink"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <Sidebar onAnalyzePdf={triggerUpload} onAskQuestion={handleAskQuestion} />
          </div>
        </div>
      )}

      {/* Área principal */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* Topbar mobile com hamburguer */}
        <div className="flex items-center justify-between border-b border-line bg-paper px-4 py-3 md:hidden">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menu"
            className="grid h-9 w-9 place-items-center text-stone transition-colors duration-200 hover:text-ink"
          >
            <Menu className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <Wordmark className="text-[16px]" />
          <span className="h-9 w-9" aria-hidden />
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <Outlet
            context={{
              onPdfSelected: handlePdfSelected,
              onAskQuestion: handleAskQuestion,
            }}
          />
        </div>
      </main>

      {/* Input file global — disparado pelo botão "Analisar contrato" da sidebar */}
      <input
        id="cj-global-pdf-input"
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) handlePdfSelected(f)
          e.target.value = ""
        }}
      />

      <style>{`
        @keyframes drawer-in {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}

function triggerUpload() {
  const el = document.getElementById("cj-global-pdf-input") as HTMLInputElement | null
  el?.click()
}
