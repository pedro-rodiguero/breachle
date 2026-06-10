# 🛡️ Breachle v2 — daily security games

Four daily browser puzzle games with a cybersecurity theme, à la Wordle / Connections / Gamedle. Fully client-side: no backend, no accounts — one puzzle per game per day, identical for every player worldwide, derived deterministically from the UTC date.

> This is the **v2 rebuild** (SvelteKit + Svelte 5, neon cyber-terminal design). The original React implementation lives on `main`.

| Game | What it is |
| --- | --- |
| 🐞 **CVE-dle** | Guess the famous vulnerability in 6 tries; each miss reveals another clue (severity, vector, year, product, type, description) |
| 🚨 **Triage** | Connections-style: group 16 alert artifacts into 4 hidden attack types, 4 mistakes allowed |
| 🎣 **Phish or Legit** | Judge 5 rendered emails/URLs, then see the tells (lookalike domains, mismatched links, SPF fails…) |
| 👾 **Malware or…?** | Four-way category call — malware, Pokémon, band, or something else — over a weighted deck; only exact calls score |

Every game has streaks, refresh-safe in-progress state, a post-game lock with countdown to UTC midnight, and a spoiler-free emoji share grid.

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
- **Datasets** — [src/lib/data/](src/lib/data/): typed TS modules, human-audited (see [SEED_DATA_AUDIT.md](SEED_DATA_AUDIT.md)); append entries, no code changes needed.
- **Design system** — [src/app.css](src/app.css): dark-first neon tokens (`.light` opts out), glass panels, per-game `--glow` accents.
- **Rename the brand** by editing `APP_NAME` in [src/lib/config.ts](src/lib/config.ts).

Phish or Legit renders everything as inert sample data — "links" are styled `<span>`s, never anchors, and all phishing domains are fictional.

## Room to grow (deliberately out of scope)

- A fifth "decode" mode (base64 / hex / JWT identification) — add a `GameMeta` entry, a dataset, and a route.
- Global/aggregate stats would need a backend; everything else is static by design.
