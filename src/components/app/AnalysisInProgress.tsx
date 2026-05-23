import { useEffect, useState } from "react"
import { Check } from "lucide-react"
import { Wordmark } from "@/components/Wordmark"
import { formatElapsed } from "@/lib/formatDate"

interface AnalysisInProgressProps {
  startedAt: number
  fileName?: string
}

const STAGES: { label: string; until: number }[] = [
  { label: "Extraindo cláusulas", until: 15_000 },
  { label: "Buscando dispositivos legais", until: 40_000 },
  { label: "Fundamentando análise", until: 80_000 },
  { label: "Gerando resumo", until: 90_000 },
]

/**
 * Estado C — pseudo-progresso por tempo. Não temos endpoint de progresso real;
 * etapas avançam pelos thresholds em STAGES. Após o último, fica em "polishing".
 */
export function AnalysisInProgress({ startedAt, fileName }: AnalysisInProgressProps) {
  const [elapsed, setElapsed] = useState(() => Date.now() - startedAt)

  useEffect(() => {
    const tick = setInterval(() => setElapsed(Date.now() - startedAt), 500)
    return () => clearInterval(tick)
  }, [startedAt])

  const currentIndex = STAGES.findIndex((s) => elapsed < s.until)
  const active = currentIndex === -1 ? STAGES.length - 1 : currentIndex
  const overtime = elapsed > 90_000

  return (
    <div className="mx-auto flex w-full max-w-[520px] flex-1 flex-col justify-center px-6 py-16">
      <Wordmark className="mb-10" />

      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
        Análise em andamento
      </p>
      <h1 className="mt-3 font-display text-[clamp(2rem,3.5vw,2.5rem)] font-medium leading-[1.06] tracking-[-0.01em] text-ink">
        Analisando seu contrato
      </h1>
      {fileName && (
        <p className="mt-2 max-w-full truncate font-mono text-[12px] text-mute">
          {fileName}
        </p>
      )}

      <ol className="mt-10 space-y-5">
        {STAGES.map((stage, i) => {
          const done = i < active
          const running = i === active
          return (
            <li key={stage.label} className="flex items-center gap-3.5">
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center border ${
                  done
                    ? "border-accent bg-accent text-white"
                    : running
                      ? "border-accent text-accent"
                      : "border-line text-mute"
                }`}
                style={{ borderRadius: "50%" }}
              >
                {done ? (
                  <Check className="h-3.5 w-3.5" strokeWidth={2} />
                ) : running ? (
                  <span className="relative grid h-2 w-2 place-items-center">
                    <span
                      className="absolute inset-0 bg-accent"
                      style={{
                        borderRadius: "50%",
                        animation: "cj-pulse 1.6s ease-in-out infinite",
                      }}
                    />
                  </span>
                ) : (
                  <span className="font-mono text-[10px] tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                )}
              </span>
              <span
                className={`font-sans text-[14px] ${
                  done ? "text-stone line-through decoration-line" : running ? "text-ink" : "text-mute"
                }`}
              >
                {stage.label}
              </span>
              {running && (
                <span className="ml-auto font-mono text-[11px] text-mute">…</span>
              )}
            </li>
          )
        })}
      </ol>

      <div className="mt-10 border-t border-line pt-5">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-mute">
            Decorridos
          </span>
          <span className="font-mono text-[13px] tabular-nums text-ink">
            {formatElapsed(elapsed)}
          </span>
        </div>
        <p className="mt-3 max-w-[42ch] text-[13px] leading-relaxed text-stone">
          {overtime
            ? "Estamos finalizando. Contratos longos podem levar até 2 minutos."
            : "Análises de contratos longos podem levar até 2 minutos."}
        </p>
      </div>

      <style>{`
        @keyframes cj-pulse {
          0%, 100% { opacity: 0.35; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.15); }
        }
      `}</style>
    </div>
  )
}
