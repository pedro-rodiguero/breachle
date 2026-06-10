import { EPOCH_UTC, type GameId } from '../config'

/**
 * Deterministic daily-puzzle selection. Everything derives from the current
 * UTC date so every player worldwide sees the same puzzle on the same day.
 */

/** Small, fast seeded PRNG (32-bit state, good enough for puzzle shuffles). */
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

/** FNV-1a string hash → 32-bit unsigned int, used to seed the PRNG. */
export function hashString(input: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** Today's date key in UTC, e.g. "2026-06-09". */
export function utcDateKey(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10)
}

const DAY_MS = 86_400_000

/** 1-based puzzle day number since EPOCH_UTC (clamped to ≥ 1). */
export function dayNumber(dateKey: string = utcDateKey()): number {
  const days = Math.round((Date.parse(dateKey) - Date.parse(EPOCH_UTC)) / DAY_MS)
  return Math.max(1, days + 1)
}

/** A fresh seeded PRNG for one game on one day. */
export function dailyRng(gameId: GameId, dateKey: string = utcDateKey()): () => number {
  return mulberry32(hashString(`${gameId}:${dateKey}`))
}

/** Deterministically pick today's entry from a game's dataset. */
export function dailyPick<T>(gameId: GameId, items: readonly T[], dateKey?: string): T {
  const rng = dailyRng(gameId, dateKey)
  return items[Math.floor(rng() * items.length)]
}

/** Fisher–Yates shuffle driven by a provided PRNG (does not mutate input). */
export function shuffleWith<T>(rng: () => number, items: readonly T[]): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** Deterministically sample `n` distinct entries for today's puzzle. */
export function dailySample<T>(
  gameId: GameId,
  items: readonly T[],
  n: number,
  dateKey?: string,
): T[] {
  return shuffleWith(dailyRng(gameId, dateKey), items).slice(0, Math.min(n, items.length))
}

/** Milliseconds until the next UTC midnight (when the next puzzle drops). */
export function msUntilNextPuzzle(now: Date = new Date()): number {
  const next = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
  return next - now.getTime()
}
