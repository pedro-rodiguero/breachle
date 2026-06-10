import { APP_NAME, SITE_URL } from './config'
import type { ShareInput } from './share'

// Draws the daily result as a 1080x1080 PNG for social feeds: terminal-style
// card with scanlines, corner brackets, the game's icon/accent and emoji grid.

const W = 1080
const H = 1080
const MONO = '"IBM Plex Mono", ui-monospace, monospace'
const DISPLAY = '"VT323", "IBM Plex Mono", monospace'

function scanlines(ctx: CanvasRenderingContext2D) {
	ctx.fillStyle = 'rgba(0, 0, 0, 0.28)'
	for (let y = 0; y < H; y += 6) ctx.fillRect(0, y + 4, W, 2)
}

function grid(ctx: CanvasRenderingContext2D) {
	ctx.strokeStyle = 'rgba(77, 255, 143, 0.05)'
	ctx.lineWidth = 1
	for (let x = 0; x <= W; x += 54) {
		ctx.beginPath()
		ctx.moveTo(x + 0.5, 0)
		ctx.lineTo(x + 0.5, H)
		ctx.stroke()
	}
	for (let y = 0; y <= H; y += 54) {
		ctx.beginPath()
		ctx.moveTo(0, y + 0.5)
		ctx.lineTo(W, y + 0.5)
		ctx.stroke()
	}
}

function vignette(ctx: CanvasRenderingContext2D) {
	const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.78)
	g.addColorStop(0, 'rgba(0, 0, 0, 0)')
	g.addColorStop(1, 'rgba(0, 0, 0, 0.55)')
	ctx.fillStyle = g
	ctx.fillRect(0, 0, W, H)
}

function brackets(ctx: CanvasRenderingContext2D, accent: string) {
	const inset = 44
	const len = 90
	ctx.strokeStyle = accent
	ctx.lineWidth = 6
	for (const [cx, cy, dx, dy] of [
		[inset, inset, 1, 1],
		[W - inset, inset, -1, 1],
		[inset, H - inset, 1, -1],
		[W - inset, H - inset, -1, -1]
	] as const) {
		ctx.beginPath()
		ctx.moveTo(cx + dx * len, cy)
		ctx.lineTo(cx, cy)
		ctx.lineTo(cx, cy + dy * len)
		ctx.stroke()
	}
}

export async function renderShareCard(share: ShareInput): Promise<Blob> {
	const accent = share.accent ?? '#4dff8f'

	// Make sure the webfonts are in before measuring/drawing text.
	try {
		await Promise.all([
			document.fonts.load(`700 44px ${MONO}`),
			document.fonts.load(`400 110px ${DISPLAY}`)
		])
	} catch {
		// Best effort. If the webfont stalls, system mono is fine.
	}

	const canvas = document.createElement('canvas')
	canvas.width = W
	canvas.height = H
	const ctx = canvas.getContext('2d')!

	// Backdrop
	ctx.fillStyle = '#05080a'
	ctx.fillRect(0, 0, W, H)
	const glow = ctx.createRadialGradient(W * 0.2, -100, 0, W * 0.2, -100, 900)
	glow.addColorStop(0, 'rgba(77, 255, 143, 0.16)')
	glow.addColorStop(1, 'rgba(77, 255, 143, 0)')
	ctx.fillStyle = glow
	ctx.fillRect(0, 0, W, H)
	grid(ctx)
	scanlines(ctx)
	vignette(ctx)
	brackets(ctx, accent)

	// Header: prompt + day
	ctx.textBaseline = 'middle'
	ctx.font = `700 40px ${MONO}`
	ctx.textAlign = 'left'
	ctx.fillStyle = '#4dff8f'
	ctx.fillText(`root@${APP_NAME.toLowerCase()}:~$`, 96, 140)
	ctx.textAlign = 'right'
	ctx.fillStyle = '#6dbf8c'
	ctx.fillText(`DAY #${String(share.dayNumber).padStart(3, '0')}`, W - 96, 140)

	// Game icon + name
	ctx.textAlign = 'center'
	ctx.font = `150px ${MONO}`
	ctx.fillText(share.icon ?? '🛡️', W / 2, 340)
	ctx.font = `400 110px ${DISPLAY}`
	ctx.fillStyle = accent
	ctx.shadowColor = accent
	ctx.shadowBlur = 36
	ctx.fillText(share.gameName, W / 2, 478)
	ctx.shadowBlur = 0

	// Scoreline
	if (share.scoreline) {
		ctx.font = `700 56px ${MONO}`
		ctx.fillStyle = '#c6f7d8'
		ctx.fillText(share.scoreline, W / 2, 575)
	}

	// Emoji grid (auto-shrinks for tall Triage histories)
	const lines = share.lines.filter((l) => l.length > 0)
	const size = lines.length > 5 ? 56 : lines.length > 3 ? 68 : 84
	const lineHeight = size * 1.22
	const gridTop = share.scoreline ? 660 : 620
	const gridHeight = lines.length * lineHeight
	const start = Math.min(gridTop, H - 150 - gridHeight) + lineHeight / 2
	ctx.font = `${size}px ${MONO}`
	lines.forEach((line, i) => {
		ctx.fillText(line, W / 2, start + i * lineHeight)
	})

	// Footer
	ctx.font = `600 30px ${MONO}`
	ctx.fillStyle = '#3c7a55'
	ctx.fillText(
		SITE_URL || `${APP_NAME.toLowerCase()} — daily security ops`,
		W / 2,
		H - 86
	)

	return new Promise((resolve, reject) => {
		canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('canvas toBlob failed'))), 'image/png')
	})
}

export function shareCardFilename(share: ShareInput): string {
	const slug = share.gameName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
	return `${APP_NAME.toLowerCase()}-${slug}-${String(share.dayNumber).padStart(3, '0')}.png`
}
