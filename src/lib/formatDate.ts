/**
 * Data relativa enxuta pro sidebar. "agora", "5m", "3h", "2d", "12/03".
 * Sempre em mono — assumimos numérico no callsite.
 */
export function relativeShort(iso: string): string {
  const date = new Date(iso)
  const now = Date.now()
  const diff = now - date.getTime()
  const min = 60_000
  const hour = 60 * min
  const day = 24 * hour

  if (diff < min) return "agora"
  if (diff < hour) return `${Math.floor(diff / min)}m`
  if (diff < day) return `${Math.floor(diff / hour)}h`
  if (diff < 7 * day) return `${Math.floor(diff / day)}d`

  const dd = String(date.getDate()).padStart(2, "0")
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  return `${dd}/${mm}`
}

export function formatElapsed(ms: number): string {
  const total = Math.floor(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}
