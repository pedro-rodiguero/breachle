// App-wide config. Rebrand by changing APP_NAME (and SITE_URL on deploy).
export const APP_NAME = 'Breachle'

// Canonical URL used in share text.
export const SITE_URL = 'https://breachle.app'

// Day #1 of every puzzle (launch day). Earlier dates clamp to day 1.
export const EPOCH_UTC = '2026-06-12'

export const STORAGE_PREFIX = 'breachle'

export type GameId = 'cvedle' | 'triage' | 'phish' | 'malware'

export type GameMeta = {
	id: GameId
	name: string
	tagline: string
	icon: string
	path: string
	// Tailwind classes for the per-game accent.
	accentBg: string
	accentText: string
	// Hex accent for the --glow neon shadow.
	glow: string
}

export const GAMES: GameMeta[] = [
	{
		id: 'cvedle',
		name: 'CVE-dle',
		tagline: 'Guess the famous vulnerability in 6 tries',
		icon: '🐞',
		path: '/cvedle',
		accentBg: 'bg-cve',
		accentText: 'text-cve',
		glow: '#ff4d6d'
	},
	{
		id: 'triage',
		name: 'Triage',
		tagline: 'Group 16 alerts into 4 attack types',
		icon: '🚨',
		path: '/triage',
		accentBg: 'bg-triage',
		accentText: 'text-triage',
		glow: '#ffb000'
	},
	{
		id: 'phish',
		name: 'Phish or Legit',
		tagline: 'Spot the scam before it spots you',
		icon: '🎣',
		path: '/phish',
		accentBg: 'bg-phish',
		accentText: 'text-phish',
		glow: '#2fe6c0'
	},
	{
		id: 'malware',
		name: 'Malware or…?',
		tagline: 'Real malware, or a metal band?',
		icon: '👾',
		path: '/malware',
		accentBg: 'bg-malware',
		accentText: 'text-malware',
		glow: '#4dff8f'
	}
]

export const GAME_BY_ID = Object.fromEntries(GAMES.map((g) => [g.id, g])) as Record<
	GameId,
	GameMeta
>
