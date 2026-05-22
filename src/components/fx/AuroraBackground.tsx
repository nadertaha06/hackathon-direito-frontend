import { cn } from "@/lib/utils"

interface AuroraBackgroundProps {
  className?: string
}

/**
 * Fundo escuro com "aurora": blobs de luz âmbar à deriva (transform/opacity).
 * Decorativo (aria-hidden). Posiciona-se atrás do conteúdo (-z-10).
 */
export function AuroraBackground({ className }: AuroraBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
    >
      {/* Vinheta para aprofundar as bordas */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(232,179,117,0.10),transparent_60%)]" />

      {/* Blob 1 — topo esquerda */}
      <div className="absolute -top-32 -left-24 h-[34rem] w-[34rem] rounded-full bg-glow/20 blur-3xl animate-aurora" />
      {/* Blob 2 — topo direita */}
      <div className="absolute -top-20 right-[-10rem] h-[30rem] w-[30rem] rounded-full bg-glow-strong/15 blur-3xl animate-aurora-slow" />
      {/* Blob 3 — base centro */}
      <div className="absolute bottom-[-16rem] left-1/3 h-[36rem] w-[36rem] rounded-full bg-[#7a5cff]/10 blur-3xl animate-aurora" />
    </div>
  )
}
