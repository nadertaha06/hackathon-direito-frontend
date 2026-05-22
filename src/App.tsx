import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { LandingPage } from "@/pages/LandingPage"
import { LoginPage } from "@/pages/LoginPage"
import { CadastroPage } from "@/pages/CadastroPage"
import { BrandPreviewPage } from "@/pages/BrandPreviewPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/brand-preview" element={<BrandPreviewPage />} />
      </Routes>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#ffffff",
            color: "#1a1a1a",
            fontFamily: "Geist, system-ui, sans-serif",
            fontSize: "14px",
            borderRadius: "2px",
            border: "1px solid #e5e3dc",
          },
        }}
      />
    </BrowserRouter>
  )
}

export default App
