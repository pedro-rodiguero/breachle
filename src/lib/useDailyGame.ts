import { useCallback, useMemo, useState } from 'react'
import type { GameId } from '../config'
import { dayNumber, utcDateKey } from './seed'
import {
  completeToday,
  loadToday,
  saveProgress,
  type GameStats,
} from './storage'

/**
 * The daily-game state machine every game shares:
 *  - restores today's in-progress state / final result on mount
 *  - persists progress on every update (refresh-safe)
 *  - locks in a result exactly once and rolls the streak forward
 *
 * P = the game's serializable in-progress state, R = its final result.
 */
export type DailyGame<P, R> = {
  todayKey: string
  day: number
  stats: GameStats
  /** Present once the player finished today — render the locked view. */
  result: R | undefined
  /** Restored in-progress state, if any. */
  savedProgress: P | undefined
  save: (progress: P) => void
  complete: (result: R, won: boolean) => void
}

export function useDailyGame<P, R>(gameId: GameId): DailyGame<P, R> {
  const todayKey = utcDateKey()
  const initial = useMemo(() => loadToday<P, R>(gameId, todayKey), [gameId, todayKey])

  const [stats, setStats] = useState<GameStats>(initial.stats)
  const [result, setResult] = useState<R | undefined>(initial.result)

  const save = useCallback(
    (progress: P) => saveProgress(gameId, todayKey, progress),
    [gameId, todayKey],
  )

  const complete = useCallback(
    (res: R, won: boolean) => {
      setResult(res)
      setStats(completeToday(gameId, todayKey, res, won))
    },
    [gameId, todayKey],
  )

  return {
    todayKey,
    day: dayNumber(todayKey),
    stats,
    result,
    savedProgress: initial.inProgress,
    save,
    complete,
  }
}
