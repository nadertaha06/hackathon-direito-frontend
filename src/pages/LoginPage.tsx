import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { AuthLayout } from "@/components/auth/AuthLayout"
import { FormError } from "@/components/auth/FormError"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/services/auth"
import { handleApiError } from "@/lib/handleApiError"

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login({ email, senha })
      navigate("/app")
    } catch (err) {
      // 401 genérico: não enumera se o problema foi email ou senha.
      setError(handleApiError(err, { 401: "Email ou senha inválidos." }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Entrar"
      subtitle="Acesse suas análises."
      footer={
        <>
          Não tem conta?{" "}
          <Link to="/cadastro" className="font-medium text-accent hover:underline">
            Criar conta
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <FormError message={error} />

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="voce@email.com"
            required
            icon={<Mail strokeWidth={1.5} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(error)}
          />
        </div>

        <div>
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            required
            icon={<Lock strokeWidth={1.5} />}
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                className="grid h-9 w-9 place-items-center rounded-[var(--radius-input)] text-mute transition-colors duration-[250ms] hover:text-ink"
              >
                {showPassword ? (
                  <EyeOff className="h-[18px] w-[18px]" strokeWidth={1.5} />
                ) : (
                  <Eye className="h-[18px] w-[18px]" strokeWidth={1.5} />
                )}
              </button>
            }
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            aria-invalid={Boolean(error)}
          />
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
              Entrando...
            </>
          ) : (
            "Entrar"
          )}
        </Button>
      </form>
    </AuthLayout>
  )
}
