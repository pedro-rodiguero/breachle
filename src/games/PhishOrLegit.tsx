import { useEffect, useMemo, useState } from 'react'
import { Confetti } from '../components/Confetti'
import { GameHeader, ResultPanel } from '../components/GameChrome'
import { GAME_BY_ID } from '../config'
import { PHISH_ITEMS, type PhishItem } from '../data/phish'
import { dailySample } from '../lib/seed'
import { useDailyGame } from '../lib/useDailyGame'

const ROUND_SIZE = 5
const GAME = GAME_BY_ID.phish

/** answers[i] = true means the player called item i a phish. */
type Progress = { answers: boolean[] }
type Result = { answers: boolean[] }

/** Fake link: styled like a link, deliberately NOT an anchor. Inert by design. */
function InertLink({ text }: { text: string }) {
  return (
    <span className="cursor-not-allowed break-all font-semibold text-phish underline decoration-2 underline-offset-2">
      {text}
    </span>
  )
}

function EmailCard({ item, revealed }: { item: PhishItem; revealed: boolean }) {
  return (
    <div className="overflow-hidden rounded-card border-2 border-edge bg-card shadow-card">
      <div className="space-y-1 border-b-2 border-edge bg-raised px-4 py-3">
        <p className="text-sm">
          <span className="font-bold text-ink-faint">From: </span>
          <span className="break-all font-bold">{item.from}</span>
        </p>
        <p className="text-sm font-extrabold leading-snug">{item.subject}</p>
        {item.headerNote && (
          <span className="inline-block rounded-full bg-inset px-2.5 py-0.5 font-mono text-[11px] font-semibold text-ink-soft">
            {item.headerNote}
          </span>
        )}
      </div>
      <div className="space-y-3 px-4 py-4 text-[15px] leading-relaxed">
        <p>{item.body}</p>
        {item.link && (
          <p>
            <InertLink text={item.link.text} />
            {revealed && item.link.href !== item.link.text && (
              <span className="mt-1 block break-all font-mono text-xs font-semibold text-bad">
                ↳ actually points to: {item.link.href}
              </span>
            )}
          </p>
        )}
      </div>
      <p className="border-t border-edge px-4 py-1.5 text-[11px] font-semibold text-ink-faint">
        🔒 Sample data — nothing here is clickable.
      </p>
    </div>
  )
}

function UrlCard({ item }: { item: PhishItem }) {
  return (
    <div className="rounded-card border-2 border-edge bg-card p-4 shadow-card">
      <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-ink-faint">
        You're about to visit:
      </p>
      <div className="rounded-tile bg-inset px-3 py-3">
        <p className="break-all font-mono text-sm font-semibold leading-relaxed">
          {item.displayUrl}
        </p>
      </div>
    </div>
  )
}

export function PhishOrLegit() {
  const game = useDailyGame<Progress, Result>('phish')
  const items = useMemo(
    () => dailySample('phish', PHISH_ITEMS, ROUND_SIZE, game.todayKey),
    [game.todayKey],
  )

  const [answers, setAnswers] = useState<boolean[]>(
    () => game.result?.answers ?? game.savedProgress?.answers ?? [],
  )
  /** Index currently shown in its revealed (verdict) state, if any. */
  const [revealedIdx, setRevealedIdx] = useState<number | null>(null)
  const [justWon, setJustWon] = useState(false)

  const done = game.result !== undefined
  const current = revealedIdx ?? answers.length
  const item = items[Math.min(current, items.length - 1)]
  const revealed = revealedIdx !== null

  // Refresh-during-final-reveal edge case: all answered but never finalized.
  useEffect(() => {
    if (!done && answers.length >= items.length) {
      const finalScore = answers.filter((a, i) => a === items[i].isPhish).length
      game.complete({ answers }, finalScore >= items.length - 1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const answer = (saidPhish: boolean) => {
    if (done || revealed) return
    const next = [...answers, saidPhish]
    setAnswers(next)
    setRevealedIdx(next.length - 1)
    game.save({ answers: next })
  }

  const advance = () => {
    setRevealedIdx(null)
    if (answers.length >= items.length) {
      const finalScore = answers.filter((a, i) => a === items[i].isPhish).length
      if (finalScore === items.length) setJustWon(true)
      game.complete({ answers }, finalScore >= items.length - 1)
    }
  }

  const gridLine = (ans: boolean[]) =>
    ans.map((a, i) => (a === items[i].isPhish ? '✅' : '❌')).join('')

  if (done) {
    const finalAnswers = game.result!.answers
    const finalScore = finalAnswers.filter((a, i) => a === items[i].isPhish).length
    return (
      <div className="space-y-4">
        {justWon && <Confetti />}
        <GameHeader game={GAME} day={game.day} streak={game.stats.streak} rules={<Rules />} />
        <ResultPanel
          heading={
            finalScore === items.length
              ? 'Inbox zero threats! 🎉'
              : finalScore >= items.length - 1
                ? 'Sharp eye! 👀'
                : 'You got phished 🎣'
          }
          subheading={`You spotted ${finalScore} of ${items.length} correctly.`}
          gridPreview={[gridLine(finalAnswers)]}
          share={{
            gameName: GAME.name,
            dayNumber: game.day,
            scoreline: `${finalScore}/${items.length}`,
            lines: [gridLine(finalAnswers)],
          }}
          stats={game.stats}
        >
          <div className="mb-5 space-y-2 text-left">
            {items.map((it, i) => (
              <details key={i} className="rounded-tile bg-inset px-3 py-2">
                <summary className="cursor-pointer text-sm font-bold">
                  {finalAnswers[i] === it.isPhish ? '✅' : '❌'}{' '}
                  {it.kind === 'email' ? it.subject : it.displayUrl}
                  <span className={`ml-1 font-black ${it.isPhish ? 'text-bad' : 'text-good'}`}>
                    — {it.isPhish ? 'phish' : 'legit'}
                  </span>
                </summary>
                <ul className="mt-2 space-y-1 text-sm font-semibold text-ink-soft">
                  {it.tells.map((t) => (
                    <li key={t}>
                      {it.isPhish ? '🚩' : '🛡️'} {t}
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </ResultPanel>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <GameHeader game={GAME} day={game.day} streak={game.stats.streak} rules={<Rules />} />

      <div className="flex items-center justify-between px-1">
        <p className="text-sm font-extrabold text-ink-soft">
          {Math.min(current + 1, items.length)} / {items.length}
        </p>
        <p aria-hidden className="text-sm tracking-widest">
          {items.map((_, i) =>
            i < answers.length ? (answers[i] === items[i].isPhish ? '✅' : '❌') : '⬜',
          )}
        </p>
      </div>

      <div key={current} className="animate-rise space-y-4">
        {item.kind === 'email' ? (
          <EmailCard item={item} revealed={revealed} />
        ) : (
          <UrlCard item={item} />
        )}

        {revealed ? (
          <div
            className={`animate-pop rounded-card border-2 p-4 ${
              answers[current] === item.isPhish
                ? 'border-good bg-good/10'
                : 'border-bad bg-bad/10'
            }`}
            role="status"
          >
            <p className="text-lg font-black">
              {answers[current] === item.isPhish ? 'Correct! ' : 'Nope — '}
              it's <span className={item.isPhish ? 'text-bad' : 'text-good'}>
                {item.isPhish ? 'a phish 🎣' : 'legit ✅'}
              </span>
            </p>
            <ul className="mt-2 space-y-1.5 text-sm font-semibold text-ink-soft">
              {item.tells.map((t) => (
                <li key={t}>
                  {item.isPhish ? '🚩' : '🛡️'} {t}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={advance}
              className="mt-4 w-full rounded-tile bg-phish py-3 font-extrabold text-white shadow-tile transition hover:bg-phish-deep active:translate-y-0.5"
            >
              {answers.length >= items.length ? 'See results' : 'Next →'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => answer(true)}
              className="rounded-tile bg-bad py-4 text-lg font-black text-white shadow-tile transition hover:brightness-110 active:translate-y-0.5"
            >
              🎣 Phish
            </button>
            <button
              type="button"
              onClick={() => answer(false)}
              className="rounded-tile bg-good py-4 text-lg font-black text-white shadow-tile transition hover:brightness-110 active:translate-y-0.5"
            >
              ✅ Legit
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Rules() {
  return (
    <>
      <p>
        {ROUND_SIZE} suspicious items land in front of you — rendered emails and URLs. Call each
        one: <strong>Phish</strong> or <strong>Legit</strong>.
      </p>
      <p>
        After each call you'll see the verdict and the tells: lookalike domains, mismatched links,
        urgency tricks, failed SPF checks…
      </p>
      <p>Everything is inert sample data. No link here is real or clickable.</p>
    </>
  )
}
