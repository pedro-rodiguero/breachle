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

// Fisher-Yates shuffle with a supplied PRNG. Returns a copy.
export function shuffleWith<T>(rng: () => number, items: readonly T[]): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

// Per-cycle permutation of [0, n). Each cycle reshuffles with a fresh seed;
// if a reshuffle would start with the previous cycle's last index, the first
// two slots swap so the same entry never runs two days in a row.
function cyclePerm(gameId: GameId, n: number, cycle: number): number[] {
  const indices = () => Array.from({ length: n }, (_, i) => i)
  const perm = shuffleWith(mulberry32(hashString(`${gameId}:cycle:${cycle}`)), indices())
  if (cycle > 0 && n > 2) {
    const prevLast = shuffleWith(
      mulberry32(hashString(`${gameId}:cycle:${cycle - 1}`)),
      indices(),
    )[n - 1]
    if (perm[0] === prevLast) [perm[0], perm[1]] = [perm[1], perm[0]]
  }
  return perm
}

// No-repeat rotation: day d takes position d % n of its cycle's permutation,
// so every entry appears exactly once before anything repeats.
export function dailyIndex(gameId: GameId, poolSize: number, dateKey?: string): number {
  if (poolSize <= 1) return 0
  const d = dayNumber(dateKey) - 1
  return cyclePerm(gameId, poolSize, Math.floor(d / poolSize))[d % poolSize]
}

// Pick one entry from a dataset for the day (no-repeat rotation).
export function dailyPick<T>(gameId: GameId, items: readonly T[], dateKey?: string): T {
  return items[dailyIndex(gameId, items.length, dateKey)]
}

// Sample n distinct entries for the day. Consecutive days walk disjoint
// chunks of a per-cycle shuffle, so no entry repeats until the whole pool
// has been served (leftovers smaller than a chunk carry to the next cycle).
export function dailySample<T>(
  gameId: GameId,
  items: readonly T[],
  n: number,
  dateKey?: string,
): T[] {
  const k = Math.min(n, items.length)
  if (k <= 0) return []
  const daysPerCycle = Math.max(1, Math.floor(items.length / k))
  const d = dayNumber(dateKey) - 1
  const cycle = Math.floor(d / daysPerCycle)
  const pos = d % daysPerCycle
  const perm = shuffleWith(mulberry32(hashString(`${gameId}:cycle:${cycle}`)), items)
  return perm.slice(pos * k, pos * k + k)
}

// ms until the next UTC midnight, when the new puzzle drops.
export function msUntilNextPuzzle(now: Date = new Date()): number {
  const next = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
  return next - now.getTime()
}
