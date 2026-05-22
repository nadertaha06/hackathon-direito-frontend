import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { LandingPage } from "@/pages/LandingPage"
import { LoginPage } from "@/pages/LoginPage"
import { CadastroPage } from "@/pages/CadastroPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
      </Routes>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#15151f",
            color: "#f4efe7",
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: "14px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      />
    </BrowserRouter>
  )
}

export default App
