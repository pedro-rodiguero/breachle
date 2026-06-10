import { STORAGE_PREFIX, type GameId } from '../config'
import { utcDateKey } from './seed'

/**
 * localStorage persistence, one record per game. Stores lifetime stats plus
 * today's in-progress state and final result. Anything saved for a previous
 * day is ignored on load (the puzzle has rotated), while stats persist.
 */

export type GameStats = {
  streak: number
  maxStreak: number
  played: number
  wins: number
}

export const EMPTY_STATS: GameStats = { streak: 0, maxStreak: 0, played: 0, wins: 0 }

type StoredGame<P, R> = {
  stats: GameStats
  /** Date key of the last completed puzzle — drives streak continuation. */
  lastCompletedDate?: string
  /** Date key that `inProgress` / `result` belong to. */
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
    // Corrupt or unavailable storage → start fresh.
  }
  return { stats: { ...EMPTY_STATS } }
}

function writeGame<P, R>(gameId: GameId, data: StoredGame<P, R>): void {
  try {
    localStorage.setItem(storageKey(gameId), JSON.stringify(data))
  } catch {
    // Storage full/blocked — the game still works, it just won't persist.
  }
}

export type TodayState<P, R> = {
  stats: GameStats
  inProgress?: P
  result?: R
}

/** Load stats plus whatever was saved for `todayKey` (stale days dropped). */
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

/**
 * Record today's final result and roll the stats forward. The streak grows
 * only if yesterday's puzzle was also completed; a skipped day resets to 1.
 */
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

/** Hub-card status for one game today. */
export function getGameStatus(gameId: GameId, todayKey: string = utcDateKey()): GameStatus {
  const stored = readGame(gameId)
  if (stored.date !== todayKey) return 'new'
  if (stored.result !== undefined) return 'done'
  if (stored.inProgress !== undefined) return 'playing'
  return 'new'
}

/** Current streak for hub display (0 if the chain is already broken). */
export function getDisplayStreak(gameId: GameId, todayKey: string = utcDateKey()): number {
  const stored = readGame(gameId)
  const alive =
    stored.lastCompletedDate === todayKey ||
    stored.lastCompletedDate === previousDayKey(todayKey)
  return alive ? stored.stats.streak : 0
}
