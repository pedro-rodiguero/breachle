// Breachle engagement beacon.
//
// Receives fire-and-forget completion events from the game and writes
// aggregate-only data points to Analytics Engine. There is deliberately no
// identifier of any kind: no cookies, no IP storage, nothing from the player's
// localStorage. Each point is just which game, won/lost, the day number, daily
// vs archive, and the Cloudflare-provided country for a coarse geo overview.
//
// Two light guards keep the dataset honest: requests must come from the game's
// own origin, and each client IP is rate limited. Neither stops a determined
// attacker (an Origin header can be forged), but both stop casual cross-site
// abuse and accidental floods.

interface AnalyticsEngineDataset {
	writeDataPoint(event: {
		indexes?: string[]
		blobs?: (string | null)[]
		doubles?: number[]
	}): void
}

interface RateLimit {
	limit(options: { key: string }): Promise<{ success: boolean }>
}

export interface Env {
	EVENTS: AnalyticsEngineDataset
	RATE_LIMIT: RateLimit
}

const ALLOWED_ORIGINS = new Set(['https://breachle.app', 'https://breachle.pages.dev'])
const GAMES = new Set(['cvedle', 'triage', 'phish', 'malware'])

function corsHeaders(origin: string | null): Record<string, string> {
	const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://breachle.app'
	return {
		'Access-Control-Allow-Origin': allow,
		'Access-Control-Allow-Methods': 'POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type'
	}
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const origin = request.headers.get('Origin')
		const cors = corsHeaders(origin)

		if (request.method === 'OPTIONS') return new Response(null, { headers: cors })
		if (request.method !== 'POST') return new Response('not found', { status: 404 })

		// Guard 1: only the game's own origin may post. The browser sets Origin
		// on cross-origin requests, so this blocks other sites and casual bots.
		if (!origin || !ALLOWED_ORIGINS.has(origin)) {
			return new Response('forbidden', { status: 403, headers: cors })
		}

		// Guard 2: per-IP rate limit so a single source can't flood the dataset.
		const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown'
		const { success } = await env.RATE_LIMIT.limit({ key: ip })
		if (!success) return new Response('rate limited', { status: 429, headers: cors })

		let data: Record<string, unknown>
		try {
			data = JSON.parse(await request.text())
		} catch {
			return new Response('bad request', { status: 400, headers: cors })
		}

		const game = String(data.game ?? '')
		if (!GAMES.has(game)) return new Response('bad game', { status: 400, headers: cors })

		const won = data.won === true
		const mode = data.mode === 'archive' ? 'archive' : 'daily'
		const dayRaw = Number(data.day)
		const day = Number.isFinite(dayRaw) ? Math.trunc(dayRaw) : 0
		const country = (request as { cf?: { country?: string } }).cf?.country ?? 'XX'

		env.EVENTS.writeDataPoint({
			// Sampling key — keeps per-game distributions intact under sampling.
			indexes: [game],
			blobs: [game, won ? 'won' : 'lost', mode, country],
			doubles: [won ? 1 : 0, day]
		})

		return new Response(null, { status: 204, headers: cors })
	}
}
