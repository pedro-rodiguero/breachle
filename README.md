# 🛡️ Breachle — daily security games

A collection of four daily browser puzzle games with a cybersecurity theme, à la Wordle / Connections / Gamedle. Fully client-side: no backend, no accounts — one puzzle per game per day, identical for every player worldwide, derived deterministically from the UTC date.

| Game | What it is |
| --- | --- |
| 🐞 **CVE-dle** | Guess the famous vulnerability in 6 tries; each miss reveals another clue (severity, vector, year, product, type, description) |
| 🚨 **Triage** | Connections-style: group 16 alert artifacts into 4 hidden attack types, 4 mistakes allowed |
| 🎣 **Phish or Legit** | Judge 5 rendered emails/URLs, then see the tells (lookalike domains, mismatched links, SPF fails…) |
| 👾 **Malware or…?** | Rapid round: real malware family, or a metal band / Pokémon / JS framework / IKEA product? |

Every game has streaks, refresh-safe in-progress state, a post-game lock with countdown to UTC midnight, and a spoiler-free emoji share grid.

## Stack

- React 19 + Vite + TypeScript (strict)
- Tailwind CSS v4 (CSS-first config, design tokens in [src/index.css](src/index.css))
- `HashRouter` so it deploys to any static host with zero config
- All state in `localStorage`

## Develop

```sh
npm install
npm run dev      # local dev server
npm run build    # type-check + production build to dist/
npm run preview  # serve the production build
npm run lint     # eslint
```

## Deploy

`npm run build` and host `dist/` anywhere static (Vercel, Netlify, GitHub Pages, S3…). No rewrite rules needed thanks to hash routing.

## Architecture notes

- **Daily seed** — [src/lib/seed.ts](src/lib/seed.ts): UTC date → FNV-1a hash → mulberry32 PRNG. Helpers for daily pick/sample/shuffle per game.
- **Persistence** — [src/lib/storage.ts](src/lib/storage.ts): per-game record with lifetime stats + today's progress/result; streaks reset when a day is skipped.
- **Daily state machine** — [src/lib/useDailyGame.ts](src/lib/useDailyGame.ts): the hook every game shares (restore → save → complete-once → lock).
- **Share grids** — [src/lib/share.ts](src/lib/share.ts): per-game emoji lines + clipboard with fallback.
- **Datasets** — [src/data/](src/data/): typed TS modules; append entries, no code changes needed. Facts needing human review are marked `// VERIFY` (see [SEED_DATA_AUDIT.md](SEED_DATA_AUDIT.md)).
- **Rename the brand** by editing `APP_NAME` in [src/config.ts](src/config.ts).

Phish or Legit renders everything as inert sample data — "links" are styled `<span>`s, never anchors.

## Room to grow (deliberately out of scope for v1)

- A fifth "decode" mode (base64 / hex / JWT identification) — add a `GameMeta` entry, a dataset, and a route.
- Global/aggregate stats would need a backend; everything else is static by design.
