import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Loader2, Check, Mail, Lock, ShieldCheck, Eye, EyeOff } from "lucide-react"
import { AuthLayout } from "@/components/auth/AuthLayout"
import { FormError } from "@/components/auth/FormError"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { registerAndLogin } from "@/services/auth"
import { handleApiError } from "@/lib/handleApiError"
import { cn } from "@/lib/utils"

const MIN_PASSWORD = 8
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function CadastroPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const passwordLongEnough = password.length >= MIN_PASSWORD
  const passwordsMatch = confirm.length > 0 && password === confirm

  function validate(): string | null {
    if (!EMAIL_RE.test(email)) return "Digite um email válido."
    if (!passwordLongEnough)
      return `A senha precisa ter pelo menos ${MIN_PASSWORD} caracteres.`
    if (password !== confirm) return "As senhas não conferem."
    return null
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const clientError = validate()
    if (clientError) {
      setError(clientError)
      return
    }
    setError("")
    setLoading(true)
    try {
      // Cadastro + login automático com as mesmas credenciais.
      await registerAndLogin({ email, password })
      navigate("/dashboard")
    } catch (err) {
      setError(
        handleApiError(err, {
          409: "Este email já está cadastrado.",
        }),
      )
    } finally {
      setLoading(false)
    }
  }

  const toggle = (
    <button
      type="button"
      onClick={() => setShowPassword((v) => !v)}
      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
      className="grid h-9 w-9 place-items-center rounded-md text-fg-muted transition-colors hover:text-fg"
    >
      {showPassword ? (
        <EyeOff className="h-[18px] w-[18px]" strokeWidth={1.75} />
      ) : (
        <Eye className="h-[18px] w-[18px]" strokeWidth={1.75} />
      )}
    </button>
  )

  return (
    <AuthLayout
      title="Crie sua conta"
      subtitle="Leva menos de um minuto. É de graça."
      footer={
        <>
          Já tem conta?{" "}
          <Link to="/login" className="font-medium text-glow hover:underline">
            Entrar
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
            icon={<Mail strokeWidth={1.75} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            required
            icon={<Lock strokeWidth={1.75} />}
            trailing={toggle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-describedby="password-hint"
          />
          <p
            id="password-hint"
            className={cn(
              "mt-1.5 flex items-center gap-1.5 text-xs transition-colors",
              passwordLongEnough ? "text-signal-green-on-dark" : "text-fg-muted",
            )}
          >
            {passwordLongEnough && <Check className="h-3.5 w-3.5" strokeWidth={2.5} />}
            Pelo menos {MIN_PASSWORD} caracteres
          </p>
        </div>

        <div>
          <Label htmlFor="confirm">Confirmar senha</Label>
          <Input
            id="confirm"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            required
            icon={<ShieldCheck strokeWidth={1.75} />}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            aria-invalid={confirm.length > 0 && !passwordsMatch}
          />
          {confirm.length > 0 && !passwordsMatch && (
            <p className="mt-1.5 text-xs text-signal-red-on-dark">
              As senhas não conferem.
            </p>
          )}
          {passwordsMatch && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-signal-green-on-dark">
              <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
              As senhas conferem
            </p>
          )}
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
              Criando conta...
            </>
          ) : (
            "Criar conta"
          )}
        </Button>
      </form>
    </AuthLayout>
  )
}
