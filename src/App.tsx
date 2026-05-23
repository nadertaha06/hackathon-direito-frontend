import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { LandingPage } from "@/pages/LandingPage"
import { LoginPage } from "@/pages/LoginPage"
import { CadastroPage } from "@/pages/CadastroPage"
import { BrandPreviewPage } from "@/pages/BrandPreviewPage"
import { AppHomePage, AppChatPage } from "@/pages/AppPage"
import { AnalyzingPage } from "@/pages/AnalyzingPage"
import { AppLayout } from "@/components/app/AppLayout"
import { ChatsProvider } from "@/hooks/useChats"
import { PendingAnalysisProvider } from "@/hooks/usePendingAnalyses"

function AppRoot() {
  // Ordem dos providers: ChatsProvider primeiro (PendingAnalysisProvider
  // depende dele via useChats), depois PendingAnalysisProvider.
  return (
    <ChatsProvider>
      <PendingAnalysisProvider>
        <AppLayout />
      </PendingAnalysisProvider>
    </ChatsProvider>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/brand-preview" element={<BrandPreviewPage />} />

        <Route path="/app" element={<AppRoot />}>
          <Route index element={<AppHomePage />} />
          <Route path="c/:chatId" element={<AppChatPage />} />
          <Route path="analyzing/:tempId" element={<AnalyzingPage />} />
        </Route>
      </Routes>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#fffdf9",
            color: "#1f1b1a",
            fontFamily: "Lato, system-ui, sans-serif",
            fontSize: "14px",
            borderRadius: "4px",
            border: "1px solid #e2dace",
            padding: "10px 14px",
          },
        }}
      />
    </BrowserRouter>
  )
}

export default App
