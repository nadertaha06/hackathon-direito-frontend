const laws = [
  "Art. 51, IV — CDC",
  "Súmula 302 — STJ",
  "Resolução 632 — ANATEL",
  "Art. 39 — CDC",
  "Lei 8.078/90",
  "Súmula 543 — STJ",
  "Art. 47 — CDC",
  "Resolução 488 — ANS",
  "Art. 6º, V — CDC",
  "Lei 9.656/98",
]

/** Ticker de citações legais rolando — fundamentação como "fita de telégrafo". */
export function LawTicker() {
  const row = [...laws, ...laws]
  return (
    <section
      aria-label="Fundamentado em lei"
      className="relative overflow-hidden border-y border-white/8 bg-ink py-5"
    >
      {/* fades laterais */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent" />

      <div className="flex w-max animate-marquee items-center gap-10 will-change-transform">
        {row.map((l, i) => (
          <div key={i} className="flex shrink-0 items-center gap-10">
            <span className="font-mono text-sm uppercase tracking-[0.14em] text-fg-muted">
              {l}
            </span>
            <span className="text-glow">✦</span>
          </div>
        ))}
      </div>
    </section>
  )
}
