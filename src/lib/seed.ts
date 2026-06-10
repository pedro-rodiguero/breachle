import { EPOCH_UTC, type GameId } from './config'

// Daily-puzzle selection. Everything is derived from the UTC date so the
// puzzle is identical for everyone on a given day, no server needed.

// mulberry32 PRNG. Fine for shuffles, not for anything security-sensitive.
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// FNV-1a hash, used to turn a string into a PRNG seed.
export function hashString(input: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

// UTC date key, e.g. "2026-06-09".
export function utcDateKey(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10)
}

const DAY_MS = 86_400_000

// 1-based day number since EPOCH_UTC, clamped to at least 1.
export function dayNumber(dateKey: string = utcDateKey()): number {
  const days = Math.round((Date.parse(dateKey) - Date.parse(EPOCH_UTC)) / DAY_MS)
  return Math.max(1, days + 1)
}

// A PRNG seeded per game per day.
export function dailyRng(gameId: GameId, dateKey: string = utcDateKey()): () => number {
  return mulberry32(hashString(`${gameId}:${dateKey}`))
}

// Pick one entry from a dataset for the day.
export function dailyPick<T>(gameId: GameId, items: readonly T[], dateKey?: string): T {
  const rng = dailyRng(gameId, dateKey)
  return items[Math.floor(rng() * items.length)]
}

// Fisher-Yates shuffle with a supplied PRNG. Returns a copy.
export function shuffleWith<T>(rng: () => number, items: readonly T[]): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

// Sample n distinct entries for the day.
export function dailySample<T>(
  gameId: GameId,
  items: readonly T[],
  n: number,
  dateKey?: string,
): T[] {
  return shuffleWith(dailyRng(gameId, dateKey), items).slice(0, Math.min(n, items.length))
}

// ms until the next UTC midnight, when the new puzzle drops.
export function msUntilNextPuzzle(now: Date = new Date()): number {
  const next = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
  return next - now.getTime()
}
