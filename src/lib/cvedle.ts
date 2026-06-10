import type { Cve } from './data/cves'

// Gamedle-style guess comparison for CVE-dle. Each guessed CVE is scored
// against the answer per attribute: hit (exact), near (close), or miss.

export type Cmp = 'hit' | 'near' | 'miss'

export const COLUMNS = ['Severity', 'Vector', 'Vendor', 'Year', 'Type'] as const

export type Cell = {
	status: Cmp
	text: string
	full: string
	// Year only: which way the answer sits relative to the guess.
	arrow?: 'up' | 'down'
}

export type GuessRow = {
	name: string
	cveId?: string
	correct: boolean
	cells: Cell[]
}

export const SHARE_EMOJI: Record<Cmp, string> = { hit: '🟩', near: '🟨', miss: '🟥' }

// Map a product string to a coarse vendor/ecosystem. First match wins; an
// unknown product falls back to its first word.
const VENDOR_RULES: [RegExp, string][] = [
	[/openssl/i, 'OpenSSL'],
	[/openssh/i, 'OpenSSH'],
	[/microsoft|windows|exchange|netlogon|msdt|spooler/i, 'Microsoft'],
	[/apache|log4j|tomcat|struts|commons/i, 'Apache'],
	[/spring/i, 'Spring'],
	[/citrix|netscaler/i, 'Citrix'],
	[/android|stagefright/i, 'Google'],
	[/\bgnu\b|glibc|bash/i, 'GNU'],
	[/linux|polkit|pkexec|sudo|\bxz\b|liblzma/i, 'Linux'],
	[/intel|amd|\barm\b|cpu/i, 'CPUs'],
	[/wpa|wi-?fi/i, 'Wi-Fi'],
	[/ssl|tls/i, 'SSL/TLS'],
	[/moveit|progress/i, 'Progress']
]

export function vendorOf(product: string): string {
	for (const [re, v] of VENDOR_RULES) if (re.test(product)) return v
	return product.split(/[\s/(]/)[0]
}

const BANDS = [
	{ min: 9, label: 'Critical', rank: 3 },
	{ min: 7, label: 'High', rank: 2 },
	{ min: 4, label: 'Medium', rank: 1 },
	{ min: 0, label: 'Low', rank: 0 }
]
function band(cvss: number) {
	return BANDS.find((b) => cvss >= b.min)!
}

function vectorClass(v: string): 'local' | 'adjacent' | 'network' {
	const s = v.toLowerCase()
	if (s.includes('local')) return 'local'
	if (s.includes('adjacent')) return 'adjacent'
	return 'network'
}

const STOP = new Set(['with', 'from', 'that', 'this', 'code'])
function typeTokens(cwe: string): Set<string> {
	return new Set(cwe.toLowerCase().split(/[^a-z]+/).filter((w) => w.length >= 4 && !STOP.has(w)))
}

function cmp(hit: boolean, near: boolean): Cmp {
	return hit ? 'hit' : near ? 'near' : 'miss'
}

export function compareGuess(guess: Cve, answer: Cve): GuessRow {
	const gb = band(guess.cvss)
	const ab = band(answer.cvss)
	const severity: Cell = {
		status: cmp(gb.rank === ab.rank, Math.abs(gb.rank - ab.rank) === 1),
		text: gb.label,
		full: `${gb.label} (CVSS ${guess.cvss.toFixed(1)})`
	}

	const gv = vectorClass(guess.vector)
	const av = vectorClass(answer.vector)
	const vector: Cell = {
		status: cmp(gv === av, gv !== 'local' && av !== 'local'),
		text: guess.vector,
		full: guess.vector
	}

	const gVendor = vendorOf(guess.product)
	const aVendor = vendorOf(answer.product)
	const vendor: Cell = {
		status: gVendor === aVendor ? 'hit' : 'miss',
		text: gVendor,
		full: guess.product
	}

	const dy = Math.abs(guess.year - answer.year)
	const year: Cell = {
		status: cmp(dy === 0, dy <= 3),
		text: String(guess.year),
		full: String(guess.year),
		arrow: guess.year === answer.year ? undefined : answer.year > guess.year ? 'up' : 'down'
	}

	const shared = [...typeTokens(guess.cwe)].some((t) => typeTokens(answer.cwe).has(t))
	const type: Cell = {
		status: cmp(guess.cwe.toLowerCase() === answer.cwe.toLowerCase(), shared),
		text: guess.cwe,
		full: guess.cwe
	}

	return {
		name: guess.id,
		cveId: guess.cveId,
		correct: guess.id === answer.id,
		cells: [severity, vector, vendor, year, type]
	}
}
