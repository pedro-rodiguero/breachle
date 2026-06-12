import type { GameId } from './config'

// Fire-and-forget engagement beacon. Sends one aggregate event when a puzzle is
// completed so the owner can see how many people play each game and how they do.
// It is intentionally anonymous: only the game, win/loss, day number, and daily-
// vs-archive flag leave the browser — no identifiers, nothing from localStorage.
// Every path swallows errors; analytics must never affect gameplay.

const ENDPOINT = 'https://breachle-events.pedro-m-rodiguero.workers.dev'

export function reportCompletion(game: GameId, won: boolean, day: number, archive: boolean): void {
	if (typeof navigator === 'undefined') return
	try {
		const payload = JSON.stringify({ game, won, day, mode: archive ? 'archive' : 'daily' })
		// sendBeacon survives the tab closing and skips the CORS preflight; fall
		// back to a keepalive fetch where it isn't available.
		if (navigator.sendBeacon?.(ENDPOINT, payload)) return
		void fetch(ENDPOINT, { method: 'POST', body: payload, keepalive: true, mode: 'no-cors' }).catch(
			() => {}
		)
	} catch {
		// Never let a telemetry hiccup surface to the player.
	}
}
