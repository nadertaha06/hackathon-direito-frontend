import { Check } from "lucide-react"
import { motion, useReducedMotion, type Variants } from "framer-motion"

/**
 * "Exhibit A": uma página de contrato sendo marcada ao vivo — tarja vermelha
 * sobre a cláusula abusiva, grifo âmbar no que precisa revisar, check no que é
 * justo, com anotações de margem ligadas por linha. Decorativo (aria-hidden).
 */
export function ExhibitDocument() {
  const reduce = useReducedMotion()

  const sweep: Variants = {
    hidden: { scaleX: 0 },
    show: {
      scaleX: 1,
      transition: { duration: reduce ? 0 : 0.7, ease: [0.65, 0, 0.35, 1], delay: reduce ? 0 : 0.5 },
    },
  }
  const pop: Variants = {
    hidden: { opacity: 0, x: reduce ? 0 : 8 },
    show: (d: number) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, delay: reduce ? 0 : 0.7 + d * 0.18 },
    }),
  }

  return (
    <div aria-hidden="true" className="relative w-full max-w-[33rem] select-none lg:max-w-[35rem]">
      {/* glow frio atrás */}
      <div className="absolute -inset-10 -z-10 rounded-[2.5rem] bg-[radial-gradient(60%_50%_at_55%_35%,rgba(232,179,117,0.16),transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: reduce ? 0 : 30, rotate: reduce ? 0 : -5 }}
        whileInView={{ opacity: 1, y: 0, rotate: -2.4 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-[16px] border border-white/10 bg-[#13131b] p-8 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)] sm:p-9"
      >
        {/* carimbo diagonal */}
        <motion.span
          initial={{ opacity: 0, scale: reduce ? 1 : 1.6, rotate: 8 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 12 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 12, delay: reduce ? 0 : 1.1 }}
          className="absolute -right-3 top-8 z-20 rounded border-2 border-signal-red-on-dark/70 px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-signal-red-on-dark/90"
        >
          Revisar
        </motion.span>

        {/* cabeçalho do documento */}
        <div className="mb-5 border-b border-white/8 pb-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-muted/60">
            Exhibit A — Cláusula 7.2
          </p>
          <p className="mt-2 font-display text-[15px] font-semibold text-fg">
            Contrato de Prestação de Serviços
          </p>
        </div>

        {/* corpo do contrato */}
        <div className="space-y-3.5">
          <TextLines widths={[100, 92]} />

          {/* cláusula abusiva: tarja vermelha varrendo + anotação ancorada na linha */}
          <div className="relative">
            <TextLines widths={[96, 70]} tone="bright" />
            <motion.div
              variants={sweep}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="absolute inset-y-0 left-0 right-[38%] origin-left rounded-sm bg-signal-red-on-dark/22 ring-1 ring-inset ring-signal-red-on-dark/40"
            />
            <motion.div
              variants={sweep}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="absolute left-0 right-[38%] top-1/2 h-[2px] origin-left -translate-y-1/2 bg-signal-red-on-dark/80"
            />
            <motion.div
              custom={0}
              variants={pop}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="absolute right-0 top-1/2 hidden -translate-y-1/2 items-center gap-1.5 rounded-md border border-signal-red-on-dark/30 bg-signal-red-on-dark/10 px-2 py-1 backdrop-blur-sm sm:flex"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-signal-red-on-dark" />
              <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-signal-red-on-dark">
                Abusiva · Art. 51
              </span>
            </motion.div>
          </div>

          <TextLines widths={[88]} />

          {/* cláusula a revisar: grifo âmbar + anotação ancorada na linha */}
          <div className="relative">
            <TextLines widths={[90, 52]} tone="bright" />
            <motion.div
              variants={sweep}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="absolute inset-y-0 left-0 right-[34%] origin-left rounded-sm bg-signal-amber-on-dark/18"
            />
            <motion.div
              custom={1}
              variants={pop}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="absolute right-0 top-1/2 hidden -translate-y-1/2 items-center gap-1.5 rounded-md border border-signal-amber-on-dark/30 bg-signal-amber-on-dark/10 px-2 py-1 backdrop-blur-sm sm:flex"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-signal-amber-on-dark" />
              <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-signal-amber-on-dark">
                Verifique
              </span>
            </motion.div>
          </div>

          <TextLines widths={[100, 84]} />

          {/* cláusula justa: check verde na margem */}
          <div className="relative">
            <TextLines widths={[94, 70]} />
            <motion.span
              custom={2}
              variants={pop}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="absolute right-0 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center rounded-full bg-signal-green-on-dark/15 text-signal-green-on-dark"
            >
              <Check className="h-3 w-3" strokeWidth={3} />
            </motion.span>
          </div>

          <TextLines widths={[88, 58]} />
        </div>

        {/* rodapé do documento: legenda do semáforo + paginação */}
        <div className="mt-7 flex items-center justify-between border-t border-white/8 pt-4">
          <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.12em]">
            <span className="flex items-center gap-1.5 text-signal-green-on-dark">
              <span className="h-1.5 w-1.5 rounded-full bg-signal-green-on-dark" />justa
            </span>
            <span className="flex items-center gap-1.5 text-signal-amber-on-dark">
              <span className="h-1.5 w-1.5 rounded-full bg-signal-amber-on-dark" />revisar
            </span>
            <span className="flex items-center gap-1.5 text-signal-red-on-dark">
              <span className="h-1.5 w-1.5 rounded-full bg-signal-red-on-dark" />abusiva
            </span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-wider text-fg-muted/50">
            pág. 03 / 12
          </span>
        </div>

      </motion.div>
    </div>
  )
}

/** Linhas de "texto" do contrato como barras (skeleton). */
function TextLines({ widths, tone = "dim" }: { widths: number[]; tone?: "dim" | "bright" }) {
  return (
    <div className="space-y-2">
      {widths.map((w, i) => (
        <div
          key={i}
          className={`h-2 rounded-full ${tone === "bright" ? "bg-white/22" : "bg-white/10"}`}
          style={{ width: `${w}%` }}
        />
      ))}
    </div>
  )
}
