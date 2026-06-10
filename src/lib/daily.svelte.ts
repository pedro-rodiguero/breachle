import type { GameId } from './config'
import { dayNumber, utcDateKey } from './seed'
import { completeToday, loadToday, saveProgress, type GameStats } from './storage'

/**
 * The daily-game state machine every game shares (Svelte 5 runes class):
 *  - restores today's in-progress state / final result on construction
 *  - persists progress on demand (refresh-safe)
 *  - locks in a result exactly once and rolls the streak forward
 *
 * P = the game's serializable in-progress state, R = its final result.
 * Instantiate once per page; `todayKey` is captured at construction so a
 * UTC-midnight rollover mid-game can't mismatch state against a new puzzle.
 */
export class DailyGame<P, R> {
	readonly gameId: GameId
	readonly todayKey = utcDateKey()
	readonly day = dayNumber(this.todayKey)
	readonly savedProgress: P | undefined

	stats = $state<GameStats>({ streak: 0, maxStreak: 0, played: 0, wins: 0 })
	result = $state<R | undefined>(undefined)

	constructor(gameId: GameId) {
		this.gameId = gameId
		const initial = loadToday<P, R>(gameId, this.todayKey)
		this.stats = initial.stats
		this.result = initial.result
		this.savedProgress = initial.inProgress
	}

	get done(): boolean {
		return this.result !== undefined
	}

	save(progress: P): void {
		saveProgress(this.gameId, this.todayKey, progress)
	}

	complete(result: R, won: boolean): void {
		this.result = result
		this.stats = completeToday(this.gameId, this.todayKey, result, won)
	}
}
