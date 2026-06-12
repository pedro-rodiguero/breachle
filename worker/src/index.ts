// Breachle engagement beacon.
//
// Receives fire-and-forget completion events from the game and writes
// aggregate-only data points to Analytics Engine. There is deliberately no
// identifier of any kind: no cookies, no IP storage, nothing from the player's
// localStorage. Each point is just which game, won/lost, the day number, daily
// vs archive, and the Cloudflare-provided country for a coarse geo overview.

interface AnalyticsEngineDataset {
	writeDataPoint(event: {
		indexes?: string[]
		blobs?: (string | null)[]
		doubles?: number[]
	}): void
}

export interface Env {
	EVENTS: AnalyticsEngineDataset
}

const ALLOW_ORIGIN = 'https://breachle.app'
const GAMES = new Set(['cvedle', 'triage', 'phish', 'malware'])

function corsHeaders(): Record<string, string> {
	return {
		'Access-Control-Allow-Origin': ALLOW_ORIGIN,
		'Access-Control-Allow-Methods': 'POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type'
	}
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders() })
		if (request.method !== 'POST') return new Response('not found', { status: 404 })

		let data: Record<string, unknown>
		try {
			data = JSON.parse(await request.text())
		} catch {
			return new Response('bad request', { status: 400, headers: corsHeaders() })
		}

		const game = String(data.game ?? '')
		if (!GAMES.has(game)) return new Response('bad game', { status: 400, headers: corsHeaders() })

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

		return new Response(null, { status: 204, headers: corsHeaders() })
	}
}
