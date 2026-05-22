import { Container } from "@/components/ui/container"

/**
 * Em vez de um "número de dispositivos cobertos" inventado, cada tipo cita o
 * diploma legal real que o fundamenta — verificável e coerente com o
 * posicionamento "auditável".
 */
const TYPES = [
  {
    title: "Academia",
    body: "Fidelidade, multa por cancelamento e renovação automática.",
    law: "CDC · Lei 8.078/90, art. 51",
  },
  {
    title: "Plano de saúde",
    body: "Carências, reajustes por faixa etária e negativa de cobertura.",
    law: "Lei 9.656/98",
  },
  {
    title: "Financiamento",
    body: "Juros, encargos embutidos e cobrança por liquidação antecipada.",
    law: "CDC · Lei 8.078/90, art. 52",
  },
  {
    title: "Telecom",
    body: "Fidelidade, cobrança indevida e fim unilateral de plano.",
    law: "LGT · Lei 9.472/97",
  },
  {
    title: "E-commerce",
    body: "Direito de arrependimento e informação obrigatória na compra.",
    law: "Decreto 7.962/13 · CDC art. 49",
  },
  {
    title: "Locação",
    body: "Garantias, multas proporcionais e devolução de caução.",
    law: "Lei 8.245/91",
  },
]

/** O que detectamos: grade de tipos de contrato, cada um com seu fundamento legal real. */
export function WhatWeDetect() {
  return (
    <section id="sobre" className="border-b border-line">
      <Container className="py-20 md:py-28">
        <div className="max-w-[62ch]">
          <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-accent">
            O que detectamos
          </span>
          <h2 className="mt-5 font-display text-[clamp(2.25rem,4.5vw,3.25rem)] font-medium leading-[1.02] tracking-tight text-ink">
            Os contratos que você assina no{" "}
            <span className="italic-display">piloto automático.</span>
          </h2>
          <p className="dropcap mt-7 max-w-[58ch] text-[17px] leading-relaxed text-stone">
            Letra miúda existe para não ser lida. A gente lê — e confronta cada
            cláusula com a lei que deveria proteger você. Veja onde costumam se
            esconder as armadilhas.
          </p>
        </div>

        <div className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {TYPES.map((t, i) => (
            <article
              key={t.title}
              className="group relative bg-paper p-7 transition-colors duration-[250ms] hover:bg-surface"
            >
              {/* Régua terracota que aparece no hover (topo do card) */}
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-accent transition-transform duration-[250ms] ease-[var(--ease-editorial)] group-hover:scale-x-100"
              />
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-[24px] font-medium text-ink">{t.title}</h3>
                <span className="font-mono text-[12px] tabular text-mute">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-3 max-w-[34ch] text-[15px] leading-relaxed text-stone">
                {t.body}
              </p>
              <p className="mt-6 border-t border-line pt-4 font-mono text-[11px] tabular tracking-[0.04em] text-stone transition-colors duration-[250ms] group-hover:text-accent">
                {t.law}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
