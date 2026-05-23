import type { ReactNode } from "react"

/**
 * Renderer de markdown leve para respostas de assistente. Cobre:
 * - parágrafos separados por linha em branco
 * - headings (#, ##, ###)
 * - listas (- ou *)
 * - bold **x** e italic *x* (não-greedy)
 * - inline code `x`
 * - code blocks com cerca ```
 *
 * Suficiente pra texto gerado por LLM jurídico. Tudo escapado por padrão
 * (React não interpreta HTML em strings).
 */
export function Markdown({ source }: { source: string }) {
  const blocks = splitBlocks(source)
  return <>{blocks.map((b, i) => renderBlock(b, i))}</>
}

interface Block {
  type: "p" | "h1" | "h2" | "h3" | "ul" | "ol" | "code"
  lines: string[]
  lang?: string
}

function splitBlocks(src: string): Block[] {
  const lines = src.replace(/\r\n/g, "\n").split("\n")
  const out: Block[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith("```")) {
      const lang = line.slice(3).trim()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i])
        i++
      }
      if (i < lines.length) i++ // consume closing
      out.push({ type: "code", lines: codeLines, lang })
      continue
    }

    if (/^###\s+/.test(line)) {
      out.push({ type: "h3", lines: [line.replace(/^###\s+/, "")] })
      i++
      continue
    }
    if (/^##\s+/.test(line)) {
      out.push({ type: "h2", lines: [line.replace(/^##\s+/, "")] })
      i++
      continue
    }
    if (/^#\s+/.test(line)) {
      out.push({ type: "h1", lines: [line.replace(/^#\s+/, "")] })
      i++
      continue
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ""))
        i++
      }
      out.push({ type: "ul", lines: items })
      continue
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ""))
        i++
      }
      out.push({ type: "ol", lines: items })
      continue
    }

    if (line.trim() === "") {
      i++
      continue
    }

    // Parágrafo: agrupa linhas até linha em branco.
    const para: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^(#{1,3}\s|```|\s*[-*]\s|\s*\d+\.\s)/.test(lines[i])
    ) {
      para.push(lines[i])
      i++
    }
    out.push({ type: "p", lines: para })
  }

  return out
}

function renderBlock(block: Block, key: number): ReactNode {
  switch (block.type) {
    case "h1":
      return (
        <h1
          key={key}
          className="mt-6 mb-3 font-display text-[26px] font-medium leading-tight tracking-[-0.01em] text-ink first:mt-0"
        >
          {renderInline(block.lines[0])}
        </h1>
      )
    case "h2":
      return (
        <h2
          key={key}
          className="mt-6 mb-3 font-display text-[20px] font-medium leading-tight tracking-[-0.01em] text-ink first:mt-0"
        >
          {renderInline(block.lines[0])}
        </h2>
      )
    case "h3":
      return (
        <h3
          key={key}
          className="mt-5 mb-2 font-display text-[17px] font-medium leading-snug text-ink first:mt-0"
        >
          {renderInline(block.lines[0])}
        </h3>
      )
    case "ul":
      return (
        <ul key={key} className="my-3 space-y-1.5 pl-0">
          {block.lines.map((it, i) => (
            <li
              key={i}
              className="grid grid-cols-[0.75rem_1fr] items-baseline gap-x-2 text-[15px] leading-relaxed text-ink"
            >
              <span aria-hidden className="font-mono text-[12px] text-accent">
                —
              </span>
              <span>{renderInline(it)}</span>
            </li>
          ))}
        </ul>
      )
    case "ol":
      return (
        <ol key={key} className="my-3 space-y-1.5 pl-0">
          {block.lines.map((it, i) => (
            <li
              key={i}
              className="grid grid-cols-[1.5rem_1fr] items-baseline gap-x-2 text-[15px] leading-relaxed text-ink"
            >
              <span aria-hidden className="font-mono text-[12px] tabular-nums text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{renderInline(it)}</span>
            </li>
          ))}
        </ol>
      )
    case "code":
      return (
        <pre
          key={key}
          className="my-4 overflow-x-auto border border-line bg-elevated p-4 font-mono text-[12.5px] leading-relaxed text-stone"
          style={{ borderRadius: 4 }}
        >
          <code>{block.lines.join("\n")}</code>
        </pre>
      )
    case "p":
    default:
      return (
        <p key={key} className="my-3 text-[15px] leading-relaxed text-ink first:mt-0 last:mb-0">
          {block.lines.map((line, i) => (
            <span key={i}>
              {renderInline(line)}
              {i < block.lines.length - 1 && <br />}
            </span>
          ))}
        </p>
      )
  }
}

/**
 * Inline render: code, bold, italic. Tokeniza em ordem para não conflitar
 * (** antes de *). Tudo o que não casa vira texto cru.
 */
function renderInline(text: string): ReactNode {
  const nodes: ReactNode[] = []
  let cursor = 0
  let key = 0

  while (cursor < text.length) {
    const next = findNextToken(text, cursor)
    if (!next) {
      nodes.push(text.slice(cursor))
      break
    }
    if (next.start > cursor) {
      nodes.push(text.slice(cursor, next.start))
    }
    nodes.push(<span key={key++}>{next.node}</span>)
    cursor = next.end
  }
  return nodes
}

interface Token {
  start: number
  end: number
  node: ReactNode
}

function findNextToken(text: string, from: number): Token | null {
  // Procura o primeiro delimitador entre `, **, *
  const patterns: { open: string; close: string; render: (inner: string) => ReactNode }[] = [
    {
      open: "`",
      close: "`",
      render: (inner) => (
        <code className="bg-surface px-1 py-0.5 font-mono text-[13px] text-accent" style={{ borderRadius: 2 }}>
          {inner}
        </code>
      ),
    },
    {
      open: "**",
      close: "**",
      render: (inner) => <strong className="font-bold text-ink">{inner}</strong>,
    },
    {
      open: "*",
      close: "*",
      render: (inner) => <em className="italic">{inner}</em>,
    },
  ]

  let best: Token | null = null
  for (const p of patterns) {
    const start = text.indexOf(p.open, from)
    if (start === -1) continue
    const innerStart = start + p.open.length
    const end = text.indexOf(p.close, innerStart)
    if (end === -1) continue
    const t: Token = {
      start,
      end: end + p.close.length,
      node: p.render(text.slice(innerStart, end)),
    }
    if (!best || t.start < best.start) best = t
  }
  return best
}
