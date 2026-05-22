import { FileText } from "lucide-react"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion"

/**
 * Mockup do produto: card de análise em vidro escuro com o semáforo em neon.
 * Decorativo (aria-hidden). Flutua sutil e inclina em 3D seguindo o mouse.
 * As cores semânticas aqui são uso legítimo (resultado de análise).
 */
export function AnalysisMockup() {
  const reduce = useReducedMotion()

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 18 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 18 })

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce) return
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  function handleLeave() {
    mx.set(0)
    my.set(0)
  }

  return (
    <div
      aria-hidden="true"
      className="relative w-full max-w-md select-none [perspective:1200px]"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {/* Glow âmbar atrás do card */}
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-glow/10 blur-3xl" />

      <motion.div
        style={{ rotateX: reduce ? 0 : rx, rotateY: reduce ? 0 : ry, transformStyle: "preserve-3d" }}
        className={!reduce ? "animate-float" : undefined}
      >
        {/* Card principal — vidro escuro */}
        <div className="rounded-2xl border border-glass-border bg-surface/80 p-6 shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_30px_60px_-25px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          {/* Cabeçalho do relatório */}
          <div className="flex items-center gap-3 border-b border-white/8 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
              <FileText className="h-5 w-5 text-glow" strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <p className="font-display text-base font-semibold leading-tight text-fg">
                Contrato de internet
              </p>
              <p className="text-xs text-fg-muted">Análise concluída</p>
            </div>
            {/* Score em semáforo: âmbar */}
            <div className="ml-auto flex items-center gap-2 rounded-full bg-signal-amber-on-dark/12 px-3 py-1">
              <span className="h-2.5 w-2.5 rounded-full bg-signal-amber-on-dark shadow-[0_0_8px_var(--color-signal-amber-on-dark)]" />
              <span className="text-xs font-medium text-fg">Atenção</span>
            </div>
          </div>

          {/* Cláusulas classificadas */}
          <ul className="mt-4 space-y-2.5">
            <ClauseRow tone="green" label="Prazo de fidelidade" verdict="Dentro da lei" />
            <ClauseRow tone="red" label="Multa por cancelamento" verdict="Abusiva" />
            <ClauseRow tone="amber" label="Renovação automática" verdict="Verifique" />
          </ul>

          {/* Citação de lei em mono */}
          <div className="mt-4 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2.5">
            <p className="font-mono text-[11px] leading-relaxed text-fg-muted">
              Art. 51, IV — Código de Defesa do Consumidor
            </p>
          </div>
        </div>

        {/* Chip flutuante "verde" com glow */}
        <div className="absolute -bottom-4 -left-4 hidden rounded-xl border border-white/10 bg-surface/90 px-4 py-3 shadow-[0_12px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:block">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-signal-green-on-dark shadow-[0_0_8px_var(--color-signal-green-on-dark)]" />
            <span className="text-xs font-medium text-fg">3 cláusulas justas</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

const toneMap = {
  green: { dot: "bg-signal-green-on-dark", text: "text-signal-green-on-dark" },
  amber: { dot: "bg-signal-amber-on-dark", text: "text-signal-amber-on-dark" },
  red: { dot: "bg-signal-red-on-dark", text: "text-signal-red-on-dark" },
} as const

function ClauseRow({
  tone,
  label,
  verdict,
}: {
  tone: keyof typeof toneMap
  label: string
  verdict: string
}) {
  const c = toneMap[tone]
  return (
    <li className="flex items-center gap-3 rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2.5">
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${c.dot} shadow-[0_0_6px_currentColor]`} />
      <span className="text-sm text-fg/90">{label}</span>
      <span className={`ml-auto text-xs font-medium ${c.text}`}>{verdict}</span>
    </li>
  )
}
