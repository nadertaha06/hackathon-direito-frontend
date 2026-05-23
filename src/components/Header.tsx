import { Link, useNavigate } from "react-router-dom"
import { Wordmark } from "./Wordmark"
import { Button } from "./ui/button"
import { Container } from "./ui/container"

const NAV = [
  { label: "Sobre", href: "#sobre" },
  { label: "Como funciona", href: "#como-funciona" },
]

/** Nav superior: wordmark à esquerda, links discretos à direita. Hairline embaixo. */
export function Header() {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-sm">
      <Container className="flex h-16 items-center justify-between">
        <Wordmark />

        <nav
          className="flex items-center gap-7 font-sans text-[14px] font-medium"
          aria-label="Principal"
        >
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hidden text-stone transition-colors duration-200 hover:text-accent sm:inline"
            >
              {item.label}
            </a>
          ))}
          <Link
            to="/login"
            className="text-stone transition-colors duration-200 hover:text-accent"
          >
            Entrar
          </Link>
          <Button size="sm" onClick={() => navigate("/cadastro")}>
            Analisar contrato
          </Button>
        </nav>
      </Container>
    </header>
  )
}
