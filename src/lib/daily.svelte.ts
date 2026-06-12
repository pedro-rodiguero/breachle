import { reportCompletion } from './analytics'
import { EPOCH_UTC, type GameId } from './config'
import { isWarmupDay } from './data/warmup'
import { dayNumber, utcDateKey } from './seed'
import { completeToday, loadToday, logCompletion, saveProgress, type GameStats } from './storage'

// Shared per-game state (Svelte 5 runes). Restores today's progress/result on
// construction, persists on demand, and locks the result in once while rolling
// the streak forward. P = in-progress state, R = final result.
//
// Pass a valid past date and it becomes an archive replay: same puzzle for that
// day, but nothing is saved and streaks/stats stay untouched.

// Archive param lives in the hash route, e.g. "#/cvedle?d=2026-06-05". The hash
// router keeps the query in the fragment, so read it off location.hash.
export function archiveDateFromHash(): string | null {
	const query = location.hash.split('?')[1]
	return query ? new URLSearchParams(query).get('d') : null
}

// Valid archive key: a real date from the epoch up to yesterday, or one of
// the pre-launch warm-up days.
function resolveDateKey(requested: string | null | undefined): { key: string; archive: boolean } {
	const today = utcDateKey()
	if (
		requested &&
		/^\d{4}-\d{2}-\d{2}$/.test(requested) &&
		!Number.isNaN(Date.parse(requested)) &&
		(requested >= EPOCH_UTC || isWarmupDay(requested)) &&
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
	// True when replaying a past puzzle: no persistence, no streaks.
	readonly archive: boolean
	readonly savedProgress: P | undefined

	stats = $state<GameStats>({ streak: 0, maxStreak: 0, played: 0, wins: 0 })
	result = $state<R | undefined>(undefined)

	constructor(gameId: GameId, requestedDate?: string | null) {
		this.gameId = gameId
		const { key, archive } = resolveDateKey(requestedDate)
		this.todayKey = key
		this.archive = archive
		// Warm-up days sit before day 1; 0 renders as the warm-up badge.
		this.day = isWarmupDay(key) ? 0 : dayNumber(key)

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
		// Archive runs land in the completion log too; stats stay daily-only.
		logCompletion(this.gameId, this.todayKey, won)
		// Anonymous engagement beacon — fires once per completion (this method
		// only runs on the transition to done, never on restore).
		reportCompletion(this.gameId, won, this.day, this.archive)
		if (this.archive) return
		this.stats = completeToday(this.gameId, this.todayKey, result, won)
	}
}
