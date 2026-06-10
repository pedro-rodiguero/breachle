<script lang="ts">
	import Confetti from '$lib/components/Confetti.svelte'
	import GameHeader from '$lib/components/GameHeader.svelte'
	import ResultPanel from '$lib/components/ResultPanel.svelte'
	import { GAME_BY_ID } from '$lib/config'
	import { COLUMNS, compareGuess, SHARE_EMOJI, type Cmp } from '$lib/cvedle'
	import { CVES, type Cve } from '$lib/data/cves'
	import { archiveDateFromHash, DailyGame } from '$lib/daily.svelte'
	import { dailyPick } from '$lib/seed'
	import { fly } from 'svelte/transition'

	const MAX_GUESSES = 6
	const GAME = GAME_BY_ID.cvedle

	type Progress = { guesses: string[] }
	type Result = { won: boolean; guesses: string[] }

	const game = new DailyGame<Progress, Result>('cvedle', archiveDateFromHash())
	const answer = dailyPick('cvedle', CVES, game.todayKey)

	// Blank out the answer name(s) where they appear in the description.
	function redact(text: string, cve: Cve): string {
		let out = text
		for (const name of [cve.id, ...cve.aliases]) {
			if (name.length < 3) continue
			out = out.replace(new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '█████')
		}
		return out
	}

	function matchCve(q: string): Cve | undefined {
		const needle = q.trim().toLowerCase()
		return CVES.find(
			(c) => c.id.toLowerCase() === needle || c.aliases.some((a) => a.toLowerCase() === needle)
		)
	}

	let guesses = $state<string[]>(game.result?.guesses ?? game.savedProgress?.guesses ?? [])
	let query = $state('')
	let highlight = $state(0)
	let shaking = $state(false)
	let justWon = $state(false)

	const suggestions = $derived.by(() => {
		const q = query.trim().toLowerCase()
		if (!q || game.done) return []
		return CVES.filter(
			(c) =>
				!guesses.includes(c.id) &&
				(c.id.toLowerCase().includes(q) ||
					c.aliases.some((a) => a.toLowerCase().includes(q)) ||
					c.cveId?.toLowerCase().includes(q))
		).slice(0, 7)
	})

	// Newest guess on top, scored against the answer.
	const rows = $derived(
		guesses
			.map((g, i) => {
				const cve = CVES.find((c) => c.id === g)!
				return { ...compareGuess(cve, answer), last: i === guesses.length - 1 }
			})
			.reverse()
	)
	const shareRows = $derived(
		guesses.map((g) => {
			const cve = CVES.find((c) => c.id === g)!
			return compareGuess(cve, answer).cells.map((c) => SHARE_EMOJI[c.status]).join('')
		})
	)
	const scoreline = $derived(game.result?.won ? `${guesses.length}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`)

	function cellClass(s: Cmp): string {
		return s === 'hit' ? 'bg-good text-black' : s === 'near' ? 'bg-warn text-black' : 'bg-bad text-white'
	}

	function updateQuery(q: string) {
		query = q
		highlight = 0
	}

	function submitGuess(cve: Cve) {
		if (game.done || guesses.includes(cve.id)) return
		guesses = [...guesses, cve.id]
		updateQuery('')
		if (cve.id === answer.id) {
			justWon = true
			game.complete({ won: true, guesses }, true)
		} else if (guesses.length >= MAX_GUESSES) {
			game.complete({ won: false, guesses }, false)
		} else {
			game.save({ guesses })
			shaking = true
			setTimeout(() => (shaking = false), 500)
		}
	}

	function onSubmit(e: SubmitEvent) {
		e.preventDefault()
		const pick = suggestions[highlight] ?? matchCve(query)
		if (pick) submitGuess(pick)
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault()
			highlight = Math.min(highlight + 1, suggestions.length - 1)
		} else if (e.key === 'ArrowUp') {
			e.preventDefault()
			highlight = Math.max(highlight - 1, 0)
		}
	}
</script>

{#snippet rules()}
	<p>
		Guess the famous vulnerability in {MAX_GUESSES} tries. Pick any vuln in today's database.
	</p>
	<p>
		Each guess is scored against the answer, column by column: 🟩 exact, 🟨 close, 🟥 off. The
		year shows ↑ / ↓ pointing toward the answer.
	</p>
	<p>Columns: severity band, attack vector, vendor, year, and vulnerability type.</p>
{/snippet}

{#if justWon}
	<Confetti />
{/if}

<div class="space-y-5">
	<GameHeader game={GAME} day={game.day} streak={game.stats.streak} archive={game.archive} {rules} />

	{#if guesses.length === 0 && !game.done}
		<div class="glass bracket p-5 text-center">
			<p class="font-mono text-sm font-bold text-ink-soft">
				<span class="text-cve">&gt;</span> unknown vulnerability detected
			</p>
			<p class="mt-1 font-mono text-xs text-ink-faint">
				Name a vuln below. Each guess lights up the attributes it shares with the answer.
			</p>
		</div>
	{/if}

	<!-- Guess grid (Gamedle-style attribute comparison) -->
	{#if guesses.length > 0}
		<section aria-label="Your guesses" class="-mx-1 overflow-x-auto px-1 pb-1">
			<div class="min-w-max space-y-1.5">
				<div
					class="flex gap-1.5 font-mono text-[9px] font-bold tracking-wide text-ink-faint uppercase"
				>
					<div class="w-28 shrink-0 px-1">Guess</div>
					{#each COLUMNS as col (col)}
						<div class="w-[4.6rem] shrink-0 text-center">{col}</div>
					{/each}
				</div>

				{#each rows as row (row.name)}
					<div
						class="flex gap-1.5 {row.last && shaking ? 'animate-shake' : ''}"
						in:fly={{ y: 10, duration: 250 }}
					>
						<div
							class="flex w-28 shrink-0 items-center gap-1 rounded-tile border px-2 py-1.5 font-mono text-xs font-bold
								{row.correct ? 'border-good/60 bg-good/10 text-good' : 'border-edge bg-card'}"
						>
							<span aria-hidden="true">{row.correct ? '🟩' : '🟥'}</span>
							<span class="truncate text-ink" title={row.name}>{row.name}</span>
						</div>
						{#each row.cells as cell, ci (ci)}
							<div
								class="grid w-[4.6rem] shrink-0 place-items-center rounded-tile px-1 py-1.5 text-center font-mono text-[10px] leading-tight font-bold {cellClass(
									cell.status
								)}"
								title={cell.full}
							>
								<span class="line-clamp-2 max-w-full">
									{cell.text}{#if cell.arrow}<span class="ml-0.5"
											>{cell.arrow === 'up' ? '↑' : '↓'}</span
										>{/if}
								</span>
							</div>
						{/each}
					</div>
				{/each}
			</div>
		</section>
		<p class="-mt-2 px-1 font-mono text-[10px] text-ink-faint">
			🟩 exact · 🟨 close · 🟥 off · ↑/↓ year is higher / lower
		</p>
	{/if}

	<!-- Declassified hint once the player is a few guesses in -->
	{#if !game.done && guesses.length >= 3}
		<div class="glass flex items-start gap-3 p-3.5" in:fly={{ y: 8, duration: 250 }}>
			<span aria-hidden="true" class="text-lg">📰</span>
			<div class="min-w-0">
				<p class="font-mono text-[10px] font-bold tracking-wide text-ink-faint uppercase">
					Declassified case file
				</p>
				<p class="text-sm leading-snug font-medium text-ink-soft">{redact(answer.description, answer)}</p>
			</div>
		</div>
	{/if}

	{#if game.done}
		<ResultPanel
			heading={game.result!.won ? 'Patched! 🎉' : 'Breach! 💥'}
			subheading={game.result!.won
				? `You named it in ${guesses.length} ${guesses.length === 1 ? 'guess' : 'guesses'}.`
				: 'Out of guesses. Better luck tomorrow.'}
			gridPreview={shareRows}
			share={{
				gameName: GAME.name,
				dayNumber: game.day,
				scoreline,
				lines: shareRows,
				icon: GAME.icon,
				accent: GAME.glow
			}}
			stats={game.stats}
			archive={game.archive}
		>
			<div class="mb-5 rounded-tile border border-edge bg-inset p-4 text-left">
				<p class="font-mono text-xs font-bold tracking-wide text-ink-faint uppercase">
					The answer was
				</p>
				<p class="text-lg font-bold">
					{answer.id}
					{#if answer.cveId}
						<span class="ml-2 font-mono text-sm font-medium text-ink-soft">{answer.cveId}</span>
					{/if}
				</p>
				<p class="mt-1 text-sm leading-relaxed font-medium text-ink-soft">{answer.description}</p>
			</div>
		</ResultPanel>
	{:else}
		<form onsubmit={onSubmit} class="relative">
			<label for="cve-guess" class="sr-only">Guess the vulnerability</label>
			<div class="flex gap-2">
				<input
					id="cve-guess"
					value={query}
					oninput={(e) => updateQuery(e.currentTarget.value)}
					onkeydown={onKeydown}
					placeholder="Guess {guesses.length + 1} of {MAX_GUESSES}…"
					autocomplete="off"
					autocapitalize="off"
					spellcheck="false"
					role="combobox"
					aria-expanded={suggestions.length > 0}
					aria-controls="cve-suggestions"
					aria-activedescendant={suggestions[highlight] ? `cve-opt-${highlight}` : undefined}
					class="glass w-full px-4 py-3.5 font-mono text-base font-semibold outline-none transition placeholder:font-medium placeholder:text-ink-faint focus:border-cve"
					style="border-radius: var(--radius-tile)"
				/>
				<button
					type="submit"
					disabled={!(suggestions[highlight] ?? matchCve(query))}
					class="glow shrink-0 rounded-tile bg-cve-deep px-5 font-bold text-white transition hover:brightness-115 active:translate-y-0.5 disabled:opacity-40"
					style="--glow: #ff4d6d"
				>
					[ GUESS ]
				</button>
			</div>
			{#if suggestions.length > 0}
				<ul
					id="cve-suggestions"
					role="listbox"
					aria-label="Matching vulnerabilities"
					class="glass absolute z-10 mt-2 w-full overflow-hidden"
					style="border-radius: var(--radius-tile)"
				>
					{#each suggestions as s, i (s.id)}
						<li role="option" id="cve-opt-{i}" aria-selected={i === highlight}>
							<button
								type="button"
								onmouseenter={() => (highlight = i)}
								onclick={() => submitGuess(s)}
								class="flex w-full items-baseline gap-2 px-4 py-3 text-left font-semibold transition
									{i === highlight ? 'bg-cve/15 text-cve' : ''}"
							>
								{s.id}
								{#if s.cveId}
									<span class="font-mono text-xs font-medium text-ink-faint">{s.cveId}</span>
								{/if}
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</form>
	{/if}
</div>
