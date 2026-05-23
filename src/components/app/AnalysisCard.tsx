import { useMemo, useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import type {
  AnaliseClausula,
  AnalisePayload,
  ClausulaExtraida,
  GravidadeAbusividade,
  ScoreRisco,
  TipoContrato,
} from "@/types/domain"

interface AnalysisCardProps {
  payload: AnalisePayload
}

export function AnalysisCard({ payload }: AnalysisCardProps) {
  // Indexa cláusulas extraídas por índice pra anexar o título nas análises.
  const indexClausulas = useMemo(() => {
    const map = new Map<number, ClausulaExtraida>()
    for (const c of payload.clausulas_extraidas ?? []) map.set(c.indice, c)
    return map
  }, [payload.clausulas_extraidas])

  return (
    <article className="w-full border border-line bg-paper">
      <Header score={payload.score_risco} tipoContrato={payload.tipo_contrato} />

      {payload.resumo_executivo && (
        <section className="border-t border-line px-6 py-7 md:px-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
            Resumo executivo
          </p>
          <p className="mt-4 font-display text-[clamp(1.1rem,1.5vw,1.25rem)] italic leading-[1.5] text-ink">
            {payload.resumo_executivo}
          </p>
        </section>
      )}

      <ClausesList
        analyses={payload.analises_clausulas ?? []}
        clausulas={indexClausulas}
      />

      {(payload.pontos_negociacao ?? []).length > 0 && (
        <NegotiationPoints points={payload.pontos_negociacao} />
      )}
    </article>
  )
}

// ── Score (verde/amarelo/vermelho) ─────────────────────────────────────────
type ScoreMeta = { dot: string; label: string; ring: string }

const SCORE_META: Record<ScoreRisco, ScoreMeta> = {
  verde: { dot: "bg-success", label: "Baixo risco", ring: "text-success" },
  amarelo: { dot: "bg-warning", label: "Risco moderado", ring: "text-warning" },
  vermelho: { dot: "bg-danger", label: "Alto risco", ring: "text-danger" },
}

const SCORE_FALLBACK: ScoreMeta = {
  dot: "bg-stone",
  label: "Risco indeterminado",
  ring: "text-stone",
}

function resolveScore(score: ScoreRisco | string | null | undefined): ScoreMeta {
  if (!score) return SCORE_FALLBACK
  const key = String(score).toLowerCase().trim() as ScoreRisco
  return SCORE_META[key] ?? SCORE_FALLBACK
}

// ── Tipo de contrato (nome humanizado) ─────────────────────────────────────
const TIPO_CONTRATO_LABEL: Record<TipoContrato, string> = {
  academia: "Academia",
  plano_saude: "Plano de saúde",
  financiamento: "Financiamento",
  telecom: "Telecom",
  ecommerce: "E-commerce",
  geral: "Contrato geral",
  nao_aplicavel: "Documento avulso",
}

function labelTipo(tipo: TipoContrato | string): string {
  return TIPO_CONTRATO_LABEL[tipo as TipoContrato] ?? String(tipo)
}

function Header({
  score,
  tipoContrato,
}: {
  score: ScoreRisco
  tipoContrato: TipoContrato
}) {
  const meta = resolveScore(score)
  return (
    <header className="flex flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-10">
      <div className="flex items-center gap-3">
        <ScoreDot score={score} />
        <div>
          <p className={`font-mono text-[10px] uppercase tracking-[0.18em] ${meta.ring}`}>
            {meta.label}
          </p>
          <h2 className="mt-1 font-display text-[clamp(1.5rem,2.5vw,1.875rem)] font-medium leading-tight tracking-[-0.01em] text-ink">
            Análise: <span className="italic">{labelTipo(tipoContrato)}</span>
          </h2>
        </div>
      </div>

      <ScoreBadge score={score} />
    </header>
  )
}

function ScoreDot({ score }: { score: ScoreRisco }) {
  const meta = resolveScore(score)
  return (
    <span
      aria-hidden
      className={`inline-block h-3 w-3 ${meta.dot}`}
      style={{ borderRadius: "50%" }}
    />
  )
}

export function ScoreBadge({ score }: { score: ScoreRisco }) {
  const meta = resolveScore(score)
  return (
    <span
      className={`inline-flex items-center gap-2 border border-line px-3 py-1.5 ${meta.ring}`}
      style={{ borderRadius: 4 }}
    >
      <span
        className={`inline-block h-2 w-2 ${meta.dot}`}
        style={{ borderRadius: "50%" }}
      />
      <span className="font-mono text-[10px] uppercase tracking-[0.16em]">
        {meta.label}
      </span>
    </span>
  )
}

// ── Cláusulas ──────────────────────────────────────────────────────────────
type GravidadeMeta = { label: string; tone: string }

const GRAVIDADE_META: Record<GravidadeAbusividade, GravidadeMeta> = {
  abusiva: { label: "Abusiva", tone: "text-danger border-danger/30" },
  potencialmente_abusiva: {
    label: "Potencialmente abusiva",
    tone: "text-warning border-warning/30",
  },
  nao_abusiva: { label: "Não abusiva", tone: "text-success border-success/30" },
}

const GRAVIDADE_FALLBACK: GravidadeMeta = {
  label: "Não classificada",
  tone: "text-stone border-line",
}

function resolveGravidade(
  g: GravidadeAbusividade | string | null | undefined,
): GravidadeMeta {
  if (!g) return GRAVIDADE_FALLBACK
  const key = String(g).toLowerCase().trim() as GravidadeAbusividade
  return GRAVIDADE_META[key] ?? GRAVIDADE_FALLBACK
}

function ClausesList({
  analyses,
  clausulas,
}: {
  analyses: AnaliseClausula[]
  clausulas: Map<number, ClausulaExtraida>
}) {
  if (analyses.length === 0) return null
  return (
    <section className="border-t border-line px-6 py-7 md:px-10">
      <header className="mb-5 flex items-baseline justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
          Cláusulas analisadas
        </p>
        <span className="font-mono text-[11px] tabular-nums text-mute">
          {String(analyses.length).padStart(2, "0")} no total
        </span>
      </header>

      <ol className="divide-y divide-line">
        {analyses.map((a) => (
          <ClauseItem
            key={a.clausula_indice}
            analysis={a}
            clausula={clausulas.get(a.clausula_indice)}
          />
        ))}
      </ol>
    </section>
  )
}

function ClauseItem({
  analysis,
  clausula,
}: {
  analysis: AnaliseClausula
  clausula?: ClausulaExtraida
}) {
  const [open, setOpen] = useState(false)
  const meta = resolveGravidade(analysis.gravidade)
  const fundamentos = analysis.fundamentos_usados ?? []
  const hasGrounds = fundamentos.length > 0
  // Índice começa em 0 no back — exibimos 1-based.
  const numero = analysis.clausula_indice + 1
  const titulo = clausula?.titulo_curto ?? `Cláusula ${numero}`
  const explicacao = analysis.explicacao
  const trecho = clausula?.texto_resumido

  return (
    <li className="py-5">
      <div className="grid grid-cols-[3rem_1fr] gap-x-4">
        <span className="pt-0.5 font-mono text-[12px] tabular-nums text-mute">
          {String(numero).padStart(2, "0")}
        </span>

        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="font-display text-[17px] font-medium leading-snug tracking-[-0.005em] text-ink">
              {titulo}
            </h3>
            <span
              className={`inline-flex items-center border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${meta.tone}`}
              style={{ borderRadius: 2 }}
            >
              {meta.label}
            </span>
          </div>

          {trecho && (
            <p className="mt-2 max-w-[68ch] text-[13px] italic leading-relaxed text-mute">
              “{trecho}”
            </p>
          )}

          {explicacao && (
            <p className="mt-2 max-w-[68ch] text-[14px] leading-relaxed text-stone">
              {explicacao}
            </p>
          )}

          {hasGrounds && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.14em] text-accent transition-colors duration-200 hover:text-accent-soft"
            >
              {open ? (
                <ChevronDown className="h-3 w-3" strokeWidth={1.5} />
              ) : (
                <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
              )}
              {open
                ? "Ocultar fundamentos"
                : `Ver ${fundamentos.length} fundamento${fundamentos.length > 1 ? "s" : ""}`}
            </button>
          )}

          {open && hasGrounds && (
            <ul className="mt-4 space-y-3 border-l border-accent pl-4">
              {fundamentos.map((f, i) => (
                <li key={i} className="grid grid-cols-[4rem_1fr] gap-x-3">
                  <span className="font-mono text-[11px] tabular-nums text-mute">
                    {f.similaridade != null
                      ? `${(f.similaridade * 100).toFixed(0)}%`
                      : "—"}
                  </span>
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
                      {f.referencia}
                      {f.fonte && (
                        <span className="ml-2 text-mute normal-case tracking-normal">
                          {f.fonte}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </li>
  )
}

// ── Pontos de negociação ───────────────────────────────────────────────────
function NegotiationPoints({ points }: { points: string[] }) {
  return (
    <section className="border-t border-line bg-surface/40 px-6 py-7 md:px-10">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
        Pontos de negociação
      </p>
      <ul className="mt-5 space-y-3">
        {points.map((point, i) => (
          <li
            key={i}
            className="grid grid-cols-[1.5rem_1fr] items-baseline gap-x-3 border-b border-line pb-3 last:border-b-0 last:pb-0"
          >
            <span className="font-mono text-[11px] tabular-nums text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-[14px] leading-relaxed text-ink">{point}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
