#!/usr/bin/env node
// Breachle engagement overview. Queries the Analytics Engine dataset written by
// the events Worker and prints a terminal summary: plays + win rate per game
// (today and last 7 days), daily vs archive split, and top countries.
//
// Usage (just run it — it reuses your `wrangler login` session):
//   npm run insights
//
// For CI / a headless box, pass a token scoped to "Account Analytics: Read":
//   CLOUDFLARE_API_TOKEN=xxx npm run insights

import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID ?? '15b384514770152bbe31297fe40aab17'
const DATASET = 'breachle_events'

// Prefer an explicit token; otherwise reuse the wrangler OAuth session so there
// is nothing to set up after `wrangler login`.
function wranglerToken() {
  const base = process.env.XDG_CONFIG_HOME || join(homedir(), '.config')
  const path = join(base, '.wrangler', 'config', 'default.toml')
  const read = () => {
    try {
      return readFileSync(path, 'utf8')
    } catch {
      return ''
    }
  }
  let toml = read()
  if (!toml) return undefined
  // OAuth access tokens are short-lived. If the stored one is expired (or about
  // to be), let wrangler refresh it the way it would on any normal command.
  const expiry = toml.match(/^expiration_time\s*=\s*"([^"]+)"/m)?.[1]
  if (!expiry || Date.parse(expiry) - Date.now() < 60_000) {
    try {
      execSync('npx wrangler whoami', { stdio: 'ignore' })
      toml = read()
    } catch {
      // Refresh failed (e.g. login fully expired); fall through and let the
      // query surface a clear auth error below.
    }
  }
  return toml.match(/^oauth_token\s*=\s*"([^"]+)"/m)?.[1]
}

const TOKEN = process.env.CLOUDFLARE_API_TOKEN || wranglerToken()

if (!TOKEN) {
  console.error('No credentials. Run `wrangler login`, or set CLOUDFLARE_API_TOKEN')
  console.error('(Account Analytics: Read). See the header of this file.')
  process.exit(1)
}

async function sql(query) {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/analytics_engine/sql`,
    { method: 'POST', headers: { Authorization: `Bearer ${TOKEN}` }, body: query }
  )
  const text = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`)
  return JSON.parse(text).data ?? []
}

const GAME_LABEL = { cvedle: 'CVE-dle', triage: 'Triage', phish: 'Phish or Legit', malware: 'Malware or…?' }
const pct = (w, p) => (p > 0 ? Math.round((w / p) * 100) : 0)

// blob1=game, blob2=outcome, blob3=mode, blob4=country, double1=won, double2=day.
// _sample_interval makes counts correct even when Analytics Engine samples.
async function perGame(sinceHours) {
  const rows = await sql(`
    SELECT blob1 AS game,
           SUM(_sample_interval) AS plays,
           SUM(_sample_interval * double1) AS wins
    FROM ${DATASET}
    WHERE timestamp >= NOW() - INTERVAL '${sinceHours}' HOUR AND blob3 = 'daily'
    GROUP BY game ORDER BY plays DESC`)
  return rows.map((r) => ({ game: r.game, plays: +r.plays, wins: +r.wins }))
}

async function totals(sinceHours) {
  const rows = await sql(`
    SELECT blob3 AS mode, SUM(_sample_interval) AS plays
    FROM ${DATASET}
    WHERE timestamp >= NOW() - INTERVAL '${sinceHours}' HOUR
    GROUP BY mode`)
  const out = { daily: 0, archive: 0 }
  for (const r of rows) out[r.mode] = +r.plays
  return out
}

async function topCountries(sinceHours) {
  return (
    await sql(`
    SELECT blob4 AS country, SUM(_sample_interval) AS plays
    FROM ${DATASET}
    WHERE timestamp >= NOW() - INTERVAL '${sinceHours}' HOUR
    GROUP BY country ORDER BY plays DESC LIMIT 8`)
  ).map((r) => ({ country: r.country, plays: +r.plays }))
}

function table(title, rows) {
  console.log(`\n${title}`)
  if (!rows.length) {
    console.log('  (no plays yet)')
    return
  }
  for (const r of rows) {
    const label = (GAME_LABEL[r.game] ?? r.game).padEnd(16)
    const bar = '█'.repeat(Math.min(30, r.plays))
    console.log(`  ${label} ${String(r.plays).padStart(5)} plays · ${String(pct(r.wins, r.plays)).padStart(3)}% win  ${bar}`)
  }
}

try {
  const [today, week, weekTotals, countries] = await Promise.all([
    perGame(24),
    perGame(168),
    totals(168),
    topCountries(168)
  ])

  console.log('━'.repeat(52))
  console.log(' BREACHLE — engagement overview')
  console.log('━'.repeat(52))
  table('Today (last 24h, daily puzzles)', today)
  table('Last 7 days (daily puzzles)', week)

  const weekDaily = week.reduce((s, r) => s + r.plays, 0)
  const weekWins = week.reduce((s, r) => s + r.wins, 0)
  console.log('\nLast 7 days — totals')
  console.log(`  ${weekDaily} daily completions · ${pct(weekWins, weekDaily)}% overall win rate`)
  console.log(`  ${weekTotals.archive} archive replays`)

  console.log('\nLast 7 days — top countries')
  if (!countries.length) console.log('  (no plays yet)')
  for (const c of countries) console.log(`  ${c.country}  ${String(c.plays).padStart(5)}`)
  console.log('')
} catch (err) {
  console.error('Query failed:', err.message)
  if (/HTTP 401|Authentication/.test(err.message)) {
    console.error('Auth expired — run `wrangler login`, or set CLOUDFLARE_API_TOKEN.')
  } else {
    console.error('If the dataset is empty, no events have been recorded yet.')
  }
  process.exit(1)
}
