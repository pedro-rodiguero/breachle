import { EPOCH_UTC, type GameId } from './config'
import { dayNumber, utcDateKey } from './seed'
import { completeToday, loadToday, saveProgress, type GameStats } from './storage'

/**
 * The daily-game state machine every game shares (Svelte 5 runes class):
 *  - restores today's in-progress state / final result on construction
 *  - persists progress on demand (refresh-safe)
 *  - locks in a result exactly once and rolls the streak forward
 *
 * P = the game's serializable in-progress state, R = its final result.
 *
 * ARCHIVE MODE: constructed with a valid past date, the game becomes a
 * casual replay — same deterministic puzzle for that day, but nothing is
 * persisted and streaks/stats are never touched.
 */

/**
 * Read the `?d=YYYY-MM-DD` archive param from the hash route
 * (e.g. "#/cvedle?d=2026-06-05"). The hash router keeps the query inside
 * the fragment, so it must be parsed from location.hash, not the page URL.
 */
export function archiveDateFromHash(): string | null {
	const query = location.hash.split('?')[1]
	return query ? new URLSearchParams(query).get('d') : null
}

/** Valid archive key: well-formed date between the epoch and yesterday. */
function resolveDateKey(requested: string | null | undefined): { key: string; archive: boolean } {
	const today = utcDateKey()
	if (
		requested &&
		/^\d{4}-\d{2}-\d{2}$/.test(requested) &&
		!Number.isNaN(Date.parse(requested)) &&
		requested >= EPOCH_UTC &&
		requested < today
	) {
		return { key: requested, archive: true }
	}
	return { key: today, archive: false }
}

export class DailyGame<P, R> {
	readonly gameId: GameId
	readonly todayKey: string
	readonly day: number
	/** True when replaying a past puzzle — no persistence, no streaks. */
	readonly archive: boolean
	readonly savedProgress: P | undefined

	stats = $state<GameStats>({ streak: 0, maxStreak: 0, played: 0, wins: 0 })
	result = $state<R | undefined>(undefined)

	constructor(gameId: GameId, requestedDate?: string | null) {
		this.gameId = gameId
		const { key, archive } = resolveDateKey(requestedDate)
		this.todayKey = key
		this.archive = archive
		this.day = dayNumber(key)

		if (archive) {
			this.savedProgress = undefined
		} else {
			const initial = loadToday<P, R>(gameId, key)
			this.stats = initial.stats
			this.result = initial.result
			this.savedProgress = initial.inProgress
		}
	}

	get done(): boolean {
		return this.result !== undefined
	}

	save(progress: P): void {
		if (this.archive) return
		saveProgress(this.gameId, this.todayKey, progress)
	}

	complete(result: R, won: boolean): void {
		this.result = result
		if (this.archive) return
		this.stats = completeToday(this.gameId, this.todayKey, result, won)
	}
}
