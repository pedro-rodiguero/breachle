import { useEffect, useMemo, useRef, useState } from 'react'
import { Confetti } from '../components/Confetti'
import { GameHeader, ResultPanel } from '../components/GameChrome'
import { GAME_BY_ID } from '../config'
import { CVES, type Cve } from '../data/cves'
import { dailyPick } from '../lib/seed'
import { useDailyGame } from '../lib/useDailyGame'

const MAX_GUESSES = 6
const GAME = GAME_BY_ID.cvedle

type Progress = { guesses: string[] }
type Result = { won: boolean; guesses: string[] }

function severityLabel(cvss: number): string {
  if (cvss >= 9) return 'Critical'
  if (cvss >= 7) return 'High'
  if (cvss >= 4) return 'Medium'
  return 'Low'
}

/** Hide the answer's own name(s) if they appear in the description. */
function redact(text: string, cve: Cve): string {
  let out = text
  for (const name of [cve.id, ...cve.aliases]) {
    if (name.length < 3) continue
    out = out.replace(new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '█████')
  }
  return out
}

function buildClues(cve: Cve): { icon: string; label: string; value: string }[] {
  return [
    { icon: '🌡️', label: 'Severity', value: `${severityLabel(cve.cvss)} (CVSS ${cve.cvss.toFixed(1)})` },
    { icon: '📡', label: 'Attack vector', value: cve.vector },
    { icon: '📅', label: 'Year disclosed', value: String(cve.year) },
    { icon: '📦', label: 'Affected product', value: cve.product },
    { icon: '🧬', label: 'Vulnerability type', value: cve.cwe },
    { icon: '📰', label: 'Description', value: redact(cve.description, cve) },
  ]
}

function matchCve(query: string): Cve | undefined {
  const q = query.trim().toLowerCase()
  return CVES.find(
    (c) => c.id.toLowerCase() === q || c.aliases.some((a) => a.toLowerCase() === q),
  )
}

export function CveDle() {
  const game = useDailyGame<Progress, Result>('cvedle')
  const answer = useMemo(() => dailyPick('cvedle', CVES, game.todayKey), [game.todayKey])
  const clues = useMemo(() => buildClues(answer), [answer])

  const [guesses, setGuesses] = useState<string[]>(
    () => game.result?.guesses ?? game.savedProgress?.guesses ?? [],
  )
  const [query, setQuery] = useState('')
  const [highlight, setHighlight] = useState(0)
  const [shaking, setShaking] = useState(false)
  const [justWon, setJustWon] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const done = game.result !== undefined

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q || done) return []
    return CVES.filter(
      (c) =>
        !guesses.includes(c.id) &&
        (c.id.toLowerCase().includes(q) ||
          c.aliases.some((a) => a.toLowerCase().includes(q)) ||
          c.cveId?.toLowerCase().includes(q)),
    ).slice(0, 7)
  }, [query, guesses, done])

  useEffect(() => setHighlight(0), [query])

  const submitGuess = (cve: Cve) => {
    if (done || guesses.includes(cve.id)) return
    const next = [...guesses, cve.id]
    setGuesses(next)
    setQuery('')
    if (cve.id === answer.id) {
      setJustWon(true)
      game.complete({ won: true, guesses: next }, true)
    } else if (next.length >= MAX_GUESSES) {
      game.complete({ won: false, guesses: next }, false)
    } else {
      game.save({ guesses: next })
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const pick = suggestions[highlight] ?? matchCve(query)
    if (pick) submitGuess(pick)
  }

  const visibleClues = done ? clues.length : Math.min(guesses.length + 1, clues.length)
  const shareLine = guesses.map((g) => (g === answer.id ? '🟩' : '🟥')).join('')
  const scoreline = game.result?.won ? `${guesses.length}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`

  return (
    <div className="space-y-5">
      {justWon && <Confetti />}
      <GameHeader
        game={GAME}
        day={game.day}
        streak={game.stats.streak}
        rules={
          <>
            <p>
              Guess the famous vulnerability in {MAX_GUESSES} tries. Type a name and pick from the
              suggestions — only vulns in today's database count.
            </p>
            <p>
              You start with one clue. Every wrong guess reveals another: attack vector, year,
              product, vulnerability type, and finally a redacted description.
            </p>
            <p>Come back tomorrow for a new vuln. 🟩 you got it, 🟥 a miss.</p>
          </>
        }
      />

      {/* Clue stack */}
      <section aria-label="Clues" className="space-y-2.5">
        {clues.slice(0, visibleClues).map((clue, i) => (
          <div
            key={clue.label}
            className={`flex items-start gap-3 rounded-tile border-2 border-edge bg-card p-3.5 shadow-tile ${
              i === visibleClues - 1 && !done ? 'animate-flip' : ''
            }`}
          >
            <span aria-hidden className="text-xl">
              {clue.icon}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-wide text-ink-faint">
                {clue.label}
              </p>
              <p className="font-bold leading-snug">{clue.value}</p>
            </div>
          </div>
        ))}
        {!done && visibleClues < clues.length && (
          <p className="px-1 text-xs font-semibold text-ink-faint">
            {clues.length - visibleClues} more {clues.length - visibleClues === 1 ? 'clue' : 'clues'}{' '}
            locked — wrong guesses reveal them.
          </p>
        )}
      </section>

      {/* Past guesses */}
      {guesses.length > 0 && (
        <section aria-label="Your guesses" className="space-y-2">
          {guesses.map((g, i) => {
            const correct = g === answer.id
            const last = i === guesses.length - 1
            return (
              <div
                key={g}
                className={`flex items-center gap-3 rounded-tile border-2 p-3 font-extrabold ${
                  correct
                    ? 'animate-pop border-good bg-good/15 text-good'
                    : `border-bad/60 bg-bad/10 text-bad ${last && shaking ? 'animate-shake' : ''}`
                }`}
              >
                <span aria-hidden>{correct ? '🟩' : '🟥'}</span>
                <span className="text-ink">{g}</span>
                <span className="ml-auto text-xs text-ink-faint">
                  {i + 1}/{MAX_GUESSES}
                </span>
              </div>
            )
          })}
        </section>
      )}

      {/* Input or locked result */}
      {done ? (
        <ResultPanel
          heading={game.result!.won ? 'Patched! 🎉' : 'Breach! 💥'}
          subheading={
            game.result!.won
              ? `You named it in ${guesses.length} ${guesses.length === 1 ? 'guess' : 'guesses'}.`
              : 'Out of guesses — better luck tomorrow.'
          }
          gridPreview={[shareLine || '—']}
          share={{
            gameName: GAME.name,
            dayNumber: game.day,
            scoreline,
            lines: [shareLine || '—'],
          }}
          stats={game.stats}
        >
          <div className="mb-5 rounded-tile bg-inset p-4 text-left">
            <p className="text-xs font-extrabold uppercase tracking-wide text-ink-faint">
              The answer was
            </p>
            <p className="text-lg font-black">
              {answer.id}
              {answer.cveId && (
                <span className="ml-2 font-mono text-sm font-semibold text-ink-soft">
                  {answer.cveId}
                </span>
              )}
            </p>
            <p className="mt-1 text-sm font-semibold leading-relaxed text-ink-soft">
              {answer.description}
            </p>
          </div>
        </ResultPanel>
      ) : (
        <form onSubmit={onSubmit} className="relative">
          <label htmlFor="cve-guess" className="sr-only">
            Guess the vulnerability
          </label>
          <div className="flex gap-2">
            <input
              id="cve-guess"
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  setHighlight((h) => Math.min(h + 1, suggestions.length - 1))
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault()
                  setHighlight((h) => Math.max(h - 1, 0))
                }
              }}
              placeholder={`Guess ${guesses.length + 1} of ${MAX_GUESSES}…`}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              role="combobox"
              aria-expanded={suggestions.length > 0}
              aria-controls="cve-suggestions"
              aria-activedescendant={suggestions[highlight] ? `cve-opt-${highlight}` : undefined}
              className="w-full rounded-tile border-2 border-edge bg-card px-4 py-3.5 text-base font-bold shadow-tile outline-none transition placeholder:font-semibold placeholder:text-ink-faint focus:border-cve"
            />
            <button
              type="submit"
              disabled={!(suggestions[highlight] ?? matchCve(query))}
              className="shrink-0 rounded-tile bg-cve px-5 font-extrabold text-white shadow-tile transition hover:bg-cve-deep active:translate-y-0.5 disabled:opacity-40"
            >
              Guess
            </button>
          </div>
          {suggestions.length > 0 && (
            <ul
              id="cve-suggestions"
              role="listbox"
              aria-label="Matching vulnerabilities"
              className="absolute z-10 mt-2 w-full overflow-hidden rounded-tile border-2 border-edge bg-card shadow-card"
            >
              {suggestions.map((s, i) => (
                <li key={s.id} role="option" id={`cve-opt-${i}`} aria-selected={i === highlight}>
                  <button
                    type="button"
                    onMouseEnter={() => setHighlight(i)}
                    onClick={() => submitGuess(s)}
                    className={`flex w-full items-baseline gap-2 px-4 py-3 text-left font-bold transition ${
                      i === highlight ? 'bg-cve/15 text-cve' : ''
                    }`}
                  >
                    {s.id}
                    {s.cveId && (
                      <span className="font-mono text-xs font-semibold text-ink-faint">
                        {s.cveId}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </form>
      )}
    </div>
  )
}
