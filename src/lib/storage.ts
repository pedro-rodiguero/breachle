import { STORAGE_PREFIX, type GameId } from './config'
import { utcDateKey } from './seed'

// One localStorage record per game: lifetime stats plus today's progress and
// result. State saved for a past day is ignored on load (the puzzle rotated);
// stats carry over.

export type GameStats = {
  streak: number
  maxStreak: number
  played: number
  wins: number
}

export const EMPTY_STATS: GameStats = { streak: 0, maxStreak: 0, played: 0, wins: 0 }

type StoredGame<P, R> = {
  stats: GameStats
  // Last day completed; used to decide if the streak continues.
  lastCompletedDate?: string
  // Day that inProgress/result belong to.
  date?: string
  inProgress?: P
  result?: R
}

function storageKey(gameId: GameId): string {
  return `${STORAGE_PREFIX}.game.${gameId}`
}

function readGame<P, R>(gameId: GameId): StoredGame<P, R> {
  try {
    const raw = localStorage.getItem(storageKey(gameId))
    if (raw) {
      const parsed = JSON.parse(raw) as StoredGame<P, R>
      return { ...parsed, stats: { ...EMPTY_STATS, ...parsed.stats } }
    }
  } catch {
    // Corrupt or missing storage: start fresh.
  }
  return { stats: { ...EMPTY_STATS } }
}

function writeGame<P, R>(gameId: GameId, data: StoredGame<P, R>): void {
  try {
    localStorage.setItem(storageKey(gameId), JSON.stringify(data))
  } catch {
    // Storage full or blocked. Game still runs, just no persistence.
  }
}

export type TodayState<P, R> = {
  stats: GameStats
  inProgress?: P
  result?: R
}

// Load stats plus anything saved for todayKey. Stale days are dropped.
export function loadToday<P, R>(gameId: GameId, todayKey: string): TodayState<P, R> {
  const stored = readGame<P, R>(gameId)
  const isToday = stored.date === todayKey
  return {
    stats: stored.stats,
    inProgress: isToday ? stored.inProgress : undefined,
    result: isToday ? stored.result : undefined,
  }
}

export function saveProgress<P>(gameId: GameId, todayKey: string, progress: P): void {
  const stored = readGame(gameId)
  writeGame(gameId, {
    ...stored,
    date: todayKey,
    inProgress: progress,
    result: stored.date === todayKey ? stored.result : undefined,
  })
}

function previousDayKey(dateKey: string): string {
  return utcDateKey(new Date(Date.parse(dateKey) - 86_400_000))
}

// Save the day's result and advance stats. Streak only grows if yesterday
// was also completed; a skipped day resets it to 1.
export function completeToday<R>(
  gameId: GameId,
  todayKey: string,
  result: R,
  won: boolean,
): GameStats {
  const stored = readGame(gameId)
  if (stored.lastCompletedDate === todayKey) return stored.stats // already locked

  const continues = stored.lastCompletedDate === previousDayKey(todayKey)
  const streak = continues ? stored.stats.streak + 1 : 1
  const stats: GameStats = {
    streak,
    maxStreak: Math.max(streak, stored.stats.maxStreak),
    played: stored.stats.played + 1,
    wins: stored.stats.wins + (won ? 1 : 0),
  }
  writeGame(gameId, {
    stats,
    lastCompletedDate: todayKey,
    date: todayKey,
    inProgress: undefined,
    result,
  })
  return stats
}

export type GameStatus = 'new' | 'playing' | 'done'

// Hub-card status for a game today.
export function getGameStatus(gameId: GameId, todayKey: string = utcDateKey()): GameStatus {
  const stored = readGame(gameId)
  if (stored.date !== todayKey) return 'new'
  if (stored.result !== undefined) return 'done'
  if (stored.inProgress !== undefined) return 'playing'
  return 'new'
}

// Streak to show on the hub. 0 if the chain is already broken.
export function getDisplayStreak(gameId: GameId, todayKey: string = utcDateKey()): number {
  const stored = readGame(gameId)
  const alive =
    stored.lastCompletedDate === todayKey ||
    stored.lastCompletedDate === previousDayKey(todayKey)
  return alive ? stored.stats.streak : 0
}

// Lifetime stats for a game.
export function getStats(gameId: GameId): GameStats {
  return readGame(gameId).stats
}

// ---- Completion log ----
// One flat record of every finished puzzle (daily AND archive replays),
// separate from stats: it powers the archive checkmarks and weekly stats.

export type Outcome = 'won' | 'lost'
export type CompletionLog = Partial<Record<GameId, Record<string, Outcome>>>

const LOG_KEY = `${STORAGE_PREFIX}.done.v1`

export function getCompletionLog(): CompletionLog {
  try {
    const raw = localStorage.getItem(LOG_KEY)
    if (raw) return JSON.parse(raw) as CompletionLog
  } catch {
    // Corrupt or missing: start fresh.
  }
  return {}
}

// A win is sticky: replaying a day you already beat can't downgrade it.
export function logCompletion(gameId: GameId, dateKey: string, won: boolean): void {
  const log = getCompletionLog()
  const game = log[gameId] ?? {}
  if (game[dateKey] === 'won') return
  game[dateKey] = won ? 'won' : 'lost'
  log[gameId] = game
  try {
    localStorage.setItem(LOG_KEY, JSON.stringify(log))
  } catch {
    // Storage full or blocked.
  }
}

// ---- One-time UI flags ----
// Tiny set of "already shown this" markers — the hub intro banner and the
// first-play rules hint. Keyed by a free-form string so new hints don't need
// schema changes.

const SEEN_KEY = `${STORAGE_PREFIX}.seen.v1`

function readSeen(): Record<string, true> {
  try {
    const raw = localStorage.getItem(SEEN_KEY)
    if (raw) return JSON.parse(raw) as Record<string, true>
  } catch {
    // Corrupt or missing.
  }
  return {}
}

export function hasSeenOnce(key: string): boolean {
  return readSeen()[key] === true
}

export function markSeenOnce(key: string): void {
  const seen = readSeen()
  if (seen[key]) return
  seen[key] = true
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(seen))
  } catch {
    // Storage full or blocked.
  }
}
