import { useEffect, useMemo, useState } from 'react'
import { Confetti } from '../components/Confetti'
import { GameHeader, ResultPanel } from '../components/GameChrome'
import { GAME_BY_ID } from '../config'
import { TRIAGE_PUZZLES } from '../data/triage'
import { dailyRng, shuffleWith } from '../lib/seed'
import { useDailyGame } from '../lib/useDailyGame'

const MAX_MISTAKES = 4
const GAME = GAME_BY_ID.triage

/** Tile ids are 0–15: group = id >> 2 (floor(id / 4)), tile = id & 3. */
type Progress = { solved: number[]; mistakes: number; history: number[][] }
type Result = { won: boolean; mistakes: number; history: number[][] }

const DIFF_EMOJI: Record<number, string> = { 1: '🟨', 2: '🟩', 3: '🟦', 4: '🟪' }
const DIFF_BG: Record<number, string> = {
  1: 'bg-diff-1',
  2: 'bg-diff-2',
  3: 'bg-diff-3',
  4: 'bg-diff-4',
}

export function Triage() {
  const game = useDailyGame<Progress, Result>('triage')

  // One PRNG drives both puzzle choice and board shuffle → stable on reload.
  const { puzzle, tileOrder } = useMemo(() => {
    const rng = dailyRng('triage', game.todayKey)
    const puzzle = TRIAGE_PUZZLES[Math.floor(rng() * TRIAGE_PUZZLES.length)]
    const tileOrder = shuffleWith(rng, Array.from({ length: 16 }, (_, i) => i))
    return { puzzle, tileOrder }
  }, [game.todayKey])

  // A completed game stores only the result; solved groups are the history
  // rows where all four picks shared a group.
  const saved = game.result ?? game.savedProgress
  const [solved, setSolved] = useState<number[]>(() =>
    game.result
      ? (game.result.history.filter((row) => row.every((g) => g === row[0])).map((row) => row[0]))
      : (game.savedProgress?.solved ?? []),
  )
  const [mistakes, setMistakes] = useState(saved?.mistakes ?? 0)
  const [history, setHistory] = useState<number[][]>(saved?.history ?? [])
  const [selected, setSelected] = useState<number[]>([])
  /** Sorted tile-id combos already submitted (session-only duplicate guard). */
  const [attempts, setAttempts] = useState<string[]>([])
  const [order, setOrder] = useState(tileOrder)
  const [shaking, setShaking] = useState(false)
  const [toast, setToast] = useState('')
  const [justWon, setJustWon] = useState(false)

  const done = game.result !== undefined

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(''), 1800)
    return () => clearTimeout(id)
  }, [toast])

  const tileLabel = (id: number) => puzzle.groups[id >> 2].tiles[id & 3]
  const remaining = order.filter((id) => !solved.includes(id >> 2))

  const toggle = (id: number) => {
    if (done) return
    setSelected((sel) =>
      sel.includes(id) ? sel.filter((s) => s !== id) : sel.length < 4 ? [...sel, id] : sel,
    )
  }

  const submit = () => {
    if (selected.length !== 4 || done) return
    // Identical combos shouldn't cost a second life.
    const key = [...selected].sort((a, b) => a - b).join(',')
    if (attempts.includes(key)) {
      setToast('Already tried that! 🤔')
      return
    }
    setAttempts([...attempts, key])
    const groupsOf = selected.map((id) => id >> 2)
    const nextHistory = [...history, groupsOf]
    setHistory(nextHistory)

    const counts = new Map<number, number>()
    groupsOf.forEach((g) => counts.set(g, (counts.get(g) ?? 0) + 1))
    const best = Math.max(...counts.values())

    if (best === 4) {
      const nextSolved = [...solved, groupsOf[0]]
      setSolved(nextSolved)
      setSelected([])
      if (nextSolved.length === 4) {
        setJustWon(true)
        game.complete({ won: true, mistakes, history: nextHistory }, true)
      } else {
        game.save({ solved: nextSolved, mistakes, history: nextHistory })
      }
    } else {
      const nextMistakes = mistakes + 1
      setMistakes(nextMistakes)
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
      if (nextMistakes >= MAX_MISTAKES) {
        game.complete({ won: false, mistakes: nextMistakes, history: nextHistory }, false)
      } else {
        if (best === 3) setToast('One away! 😬')
        game.save({ solved, mistakes: nextMistakes, history: nextHistory })
      }
    }
  }

  const shareLines = history.map((row) => row.map((g) => DIFF_EMOJI[puzzle.groups[g].difficulty]).join(''))

  // Reveal order in the locked view: solved first, then the rest by difficulty.
  const revealOrder = [
    ...solved,
    ...puzzle.groups.map((_, i) => i).filter((i) => !solved.includes(i)),
  ]

  const groupBanner = (g: number, i: number) => {
    const group = puzzle.groups[g]
    return (
      <div
        key={group.category}
        className={`animate-pop rounded-tile p-3 text-center text-ink shadow-tile ${DIFF_BG[group.difficulty]}`}
        style={{ animationDelay: `${i * 90}ms`, color: '#1e1b2e' }}
      >
        <p className="text-sm font-black uppercase tracking-wide">{group.category}</p>
        <p className="font-mono text-xs font-semibold leading-snug">{group.tiles.join(' · ')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {justWon && <Confetti />}
      <GameHeader
        game={GAME}
        day={game.day}
        streak={game.stats.streak}
        rules={
          <>
            <p>
              16 alert artifacts hit your SOC queue. Group them into 4 hidden attack types, 4 tiles
            each.</p>
            <p>
              Select 4 tiles and hit <strong>Submit</strong>. Wrong combos cost a life — you have{' '}
              {MAX_MISTAKES}. Watch for red herrings: some artifacts look like one attack but belong
              to another.
            </p>
            <p>Colors show difficulty: 🟨 easiest → 🟪 trickiest.</p>
          </>
        }
      />

      {/* Solved group banners */}
      {solved.length > 0 && !done && (
        <div className="space-y-2">{solved.map((g, i) => groupBanner(g, i))}</div>
      )}

      {done ? (
        <>
          <div className="space-y-2">{revealOrder.map((g, i) => groupBanner(g, i))}</div>
          <ResultPanel
            heading={game.result!.won ? 'Queue cleared! 🎉' : 'Alert fatigue 😵'}
            subheading={
              game.result!.won
                ? mistakes === 0
                  ? 'Perfect triage — zero mistakes.'
                  : `Solved with ${mistakes} ${mistakes === 1 ? 'mistake' : 'mistakes'}.`
                : 'Too many misfiled alerts. The board is revealed above.'
            }
            gridPreview={shareLines}
            share={{ gameName: GAME.name, dayNumber: game.day, lines: shareLines }}
            stats={game.stats}
          />
        </>
      ) : (
        <>
          <div className={`grid grid-cols-4 gap-2 ${shaking ? 'animate-shake' : ''}`} role="group" aria-label="Alert tiles">
            {remaining.map((id) => {
              const isSel = selected.includes(id)
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggle(id)}
                  aria-pressed={isSel}
                  className={`min-h-18 rounded-tile border-2 px-1 py-2 font-mono text-[11px] font-semibold leading-tight transition active:scale-95 sm:text-xs ${
                    isSel
                      ? 'border-brand-deep bg-brand text-white shadow-none'
                      : 'border-edge bg-card shadow-tile hover:border-edge-strong'
                  }`}
                >
                  {tileLabel(id)}
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-ink-soft" aria-live="polite">
              Lives:{' '}
              <span aria-hidden>
                {'❤️'.repeat(MAX_MISTAKES - mistakes)}
                {'🖤'.repeat(mistakes)}
              </span>
              <span className="sr-only">{MAX_MISTAKES - mistakes} remaining</span>
            </p>
            {toast && (
              <p role="status" className="animate-pop text-sm font-black text-warn">
                {toast}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setOrder(shuffleWith(() => Math.random(), order))}
              className="flex-1 rounded-tile border-2 border-edge bg-card py-3 font-extrabold text-ink-soft shadow-tile transition hover:border-edge-strong active:translate-y-0.5"
            >
              Shuffle
            </button>
            <button
              type="button"
              onClick={() => setSelected([])}
              disabled={selected.length === 0}
              className="flex-1 rounded-tile border-2 border-edge bg-card py-3 font-extrabold text-ink-soft shadow-tile transition hover:border-edge-strong active:translate-y-0.5 disabled:opacity-40"
            >
              Deselect
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={selected.length !== 4}
              className="flex-1 rounded-tile bg-triage py-3 font-extrabold text-ink shadow-tile transition hover:bg-triage-deep active:translate-y-0.5 disabled:opacity-40"
              style={{ color: '#1e1b2e' }}
            >
              Submit
            </button>
          </div>
        </>
      )}
    </div>
  )
}
