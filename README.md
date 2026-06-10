# 🛡️ Breachle v2 — daily security games

Four daily browser puzzle games with a cybersecurity theme, à la Wordle / Connections / Gamedle. Fully client-side: no backend, no accounts — one puzzle per game per day, identical for every player worldwide, derived deterministically from the UTC date.

> This is the **v2 rebuild** (SvelteKit + Svelte 5, acid-hacker terminal/CRT design — toxic-green phosphor, hard boot-log panels, subtle scanlines, tasteful glitch). The original React implementation lives on `main`.

| Game | What it is |
| --- | --- |
| 🐞 **CVE-dle** | Guess the famous vulnerability in 6 tries; each miss reveals another clue (severity, vector, year, product, type, description) |
| 🚨 **Triage** | Connections-style: group 16 alert artifacts into 4 hidden attack types, 4 mistakes allowed |
| 🎣 **Phish or Legit** | Judge 5 rendered emails/URLs, then see the tells (lookalike domains, mismatched links, SPF fails…) |
| 👾 **Malware or…?** | Four-way category call — malware, Pokémon, band, or something else — over a weighted deck; only exact calls score |

Every game has streaks, refresh-safe in-progress state, a post-game lock with countdown to UTC midnight, and two share modes: a spoiler-free emoji text grid plus a canvas-rendered **share card** PNG (terminal-styled, per-game accent) that goes out via the native share sheet, clipboard, or download.

Beyond the dailies: a **stats page** (`/stats`, per-game + overall: streaks, played, win rate) and a **puzzle archive** (`/archive`) to replay any past drop — archive runs are casual and never touch streaks or stats.

## Stack

- **SvelteKit 2 + Svelte 5** (runes mode) + TypeScript strict
- **Tailwind CSS v4** (CSS-first config, tokens in [src/app.css](src/app.css))
- Hash routing + `@sveltejs/adapter-static` → deploys to any static host with zero config
- View Transitions API between pages, Svelte springs/FLIP for micro-interactions
- All state in `localStorage`

## Develop

```sh
npm install
npm run dev      # local dev server
npm run build    # static build to build/
npm run preview  # serve the production build
npm run check    # svelte-check (types + a11y)
```

## Deploy

`npm run build` and host `build/` anywhere static (Cloudflare Pages, Netlify, Vercel, S3…). Hash routing means no rewrite rules are needed.

## Architecture notes

- **Daily seed** — [src/lib/seed.ts](src/lib/seed.ts): UTC date → FNV-1a hash → mulberry32 PRNG. Helpers for daily pick/sample/shuffle per game. Deterministic: v1 and v2 produce identical daily puzzles.
- **Persistence** — [src/lib/storage.ts](src/lib/storage.ts): per-game record with lifetime stats + today's progress/result; streaks reset when a day is skipped.
- **Daily state machine** — [src/lib/daily.svelte.ts](src/lib/daily.svelte.ts): rune-based `DailyGame` class every game shares (restore → save → complete-once → lock).
- **Share grids** — [src/lib/share.ts](src/lib/share.ts): per-game emoji lines + clipboard with fallback.
- **Share cards** — [src/lib/sharecard.ts](src/lib/sharecard.ts): 1080×1080 canvas PNG of the day's result (scanlines, corner brackets, emoji grid).
- **Share modal** — `[ SHARE RESULT ]` opens [ShareSheet.svelte](src/lib/components/ShareSheet.svelte): the card front and center, then pick a destination. `[ LINKEDIN ]` / `[ X / TWITTER ]` use the native share sheet with the PNG attached (mobile) or copy the PNG + open the network's composer with a ready-made post preloaded (desktop); `[ COPY TEXT ]` / `[ SAVE IMAGE ]` round it out. Set `SITE_URL` in [src/lib/config.ts](src/lib/config.ts) at deploy time so posts carry the play link.
- **Datasets** — [src/lib/data/](src/lib/data/): typed TS modules, human-audited (see [SEED_DATA_AUDIT.md](SEED_DATA_AUDIT.md)); append entries, no code changes needed.
- **Design system** — [src/app.css](src/app.css): dark-first acid-hacker tokens (`.light` opts out), hard terminal panels with corner-bracket framing, CRT scanlines/vignette, phosphor + RGB-split glitch helpers, per-game `--glow` accents.
- **Rename the brand** by editing `APP_NAME` in [src/lib/config.ts](src/lib/config.ts).

Phish or Legit renders everything as inert sample data — "links" are styled `<span>`s, never anchors, and all phishing domains are fictional.

## Room to grow (deliberately out of scope)

- A fifth "decode" mode (base64 / hex / JWT identification) — add a `GameMeta` entry, a dataset, and a route.
- Global/aggregate stats would need a backend; everything else is static by design.
