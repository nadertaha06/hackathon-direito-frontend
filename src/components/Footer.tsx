import { Wordmark } from "./Wordmark"

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/8 bg-ink-2">
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <Wordmark asText />
            <p className="mt-3 text-sm leading-relaxed text-fg-muted">
              Entenda seus contratos como se um amigo te explicasse na mesa da
              cozinha.
            </p>
          </div>

          <nav aria-label="Rodapé" className="flex gap-8 text-sm">
            <a href="#" className="text-fg-muted transition-colors hover:text-fg">
              Termos de uso
            </a>
            <a href="#" className="text-fg-muted transition-colors hover:text-fg">
              Privacidade
            </a>
            <a href="#" className="text-fg-muted transition-colors hover:text-fg">
              Contato
            </a>
          </nav>
        </div>

        <p className="mt-10 text-xs text-fg-muted/70">
          © {year} Contrato Justo. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
