import { Wordmark } from "./Wordmark"
import { Container } from "./ui/container"

/** Footer minimalista: wordmark, poucos links, hairline no topo. */
export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line bg-paper">
      <Container className="py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[34ch]">
            <Wordmark asText />
            <p className="mt-4 text-[14px] leading-relaxed text-stone">
              Análise de cláusulas abusivas fundamentada na lei. Sem juridiquês,
              sem achismo.
            </p>
          </div>

          <nav aria-label="Rodapé" className="flex gap-8 text-[14px]">
            <a href="#sobre" className="text-stone transition-colors duration-[250ms] hover:text-ink">
              Sobre
            </a>
            <a href="#" className="text-stone transition-colors duration-[250ms] hover:text-ink">
              Termos
            </a>
            <a href="#" className="text-stone transition-colors duration-[250ms] hover:text-ink">
              Privacidade
            </a>
          </nav>
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-line pt-6">
          <p className="font-mono text-[11px] tabular text-mute">
            © {year} Contrato Justo
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mute">
            Feito no Brasil
          </p>
        </div>
      </Container>
    </footer>
  )
}
