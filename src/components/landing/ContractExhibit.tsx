/**
 * Mockup tipográfico: um excerpt de contrato com cláusulas marcadas.
 * Linhas riscadas no acento = redline. Margem com fundamento legal em mono.
 * Puramente tipográfico — sem ilustração, sem imagem.
 */
export function ContractExhibit() {
  return (
    <figure className="border border-line bg-elevated">
      {/* Cabeçalho do documento */}
      <figcaption className="flex items-center justify-between border-b border-line px-5 py-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-stone">
          Contrato de prestação de serviços
        </span>
        <span className="font-mono text-[11px] tabular text-mute">fl. 03</span>
      </figcaption>

      <div className="space-y-5 px-5 py-6 font-mono text-[12.5px] leading-relaxed text-ink">
        <Clause n="5.1">
          O CONTRATANTE declara ciência das condições de uso e adesão integral.
        </Clause>

        {/* Cláusula sinalizada — redline */}
        <Clause n="5.2" flagged>
          <Strike>
            A multa por cancelamento corresponde a 100% das parcelas vincendas,
            sem direito a qualquer restituição.
          </Strike>
          <Margin code="CDC art. 51, IV">
            Onerosa em excesso — multa abusiva.
          </Margin>
        </Clause>

        <Clause n="5.3">
          O reajuste seguirá o índice contratado, comunicado com 30 dias de
          antecedência.
        </Clause>

        {/* Segunda sinalização */}
        <Clause n="5.4" flagged>
          <Strike>
            Fica eleito o foro da sede da CONTRATADA, renunciando o CONTRATANTE a
            qualquer outro.
          </Strike>
          <Margin code="CDC art. 51, I">
            Restringe o acesso do consumidor à Justiça.
          </Margin>
        </Clause>
      </div>

      {/* Rodapé: veredito */}
      <div className="flex items-center justify-between border-t border-line px-5 py-3">
        <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          2 cláusulas abusivas
        </span>
        <span className="font-mono text-[11px] tabular text-mute">2 fundamentos citados</span>
      </div>
    </figure>
  )
}

function Clause({
  n,
  flagged = false,
  children,
}: {
  n: string
  flagged?: boolean
  children: React.ReactNode
}) {
  return (
    <p className="grid grid-cols-[2.5rem_1fr] gap-x-3">
      <span className={flagged ? "tabular text-accent" : "tabular text-mute"}>{n}</span>
      <span className={flagged ? "text-ink" : "text-stone"}>{children}</span>
    </p>
  )
}

/** Linha riscada no acento — a cláusula marcada para revisão. */
function Strike({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-accent/[0.06] decoration-accent decoration-[1.5px] [text-decoration-line:line-through]">
      {children}
    </span>
  )
}

/** Anotação de margem com o dispositivo legal. */
function Margin({ code, children }: { code: string; children: React.ReactNode }) {
  return (
    <span className="mt-2 flex flex-col gap-0.5 border-l-2 border-accent pl-3">
      <span className="text-[11px] uppercase tracking-[0.1em] text-accent">{code}</span>
      <span className="text-[12px] not-italic text-stone">{children}</span>
    </span>
  )
}
