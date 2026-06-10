<script lang="ts">
	import Confetti from '$lib/components/Confetti.svelte'
	import GameHeader from '$lib/components/GameHeader.svelte'
	import ResultPanel from '$lib/components/ResultPanel.svelte'
	import { GAME_BY_ID } from '$lib/config'
	import { CVES, type Cve } from '$lib/data/cves'
	import { DailyGame } from '$lib/daily.svelte'
	import { dailyPick } from '$lib/seed'
	import { fly } from 'svelte/transition'

	const MAX_GUESSES = 6
	const GAME = GAME_BY_ID.cvedle

	type Progress = { guesses: string[] }
	type Result = { won: boolean; guesses: string[] }

	const game = new DailyGame<Progress, Result>('cvedle')
	const answer = dailyPick('cvedle', CVES, game.todayKey)

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

	const clues = [
		{ icon: '🌡️', label: 'Severity', value: `${severityLabel(answer.cvss)} (CVSS ${answer.cvss.toFixed(1)})` },
		{ icon: '📡', label: 'Attack vector', value: answer.vector },
		{ icon: '📅', label: 'Year disclosed', value: String(answer.year) },
		{ icon: '📦', label: 'Affected product', value: answer.product },
		{ icon: '🧬', label: 'Vulnerability type', value: answer.cwe },
		{ icon: '📰', label: 'Description', value: redact(answer.description, answer) }
	]

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

	const visibleClues = $derived(game.done ? clues.length : Math.min(guesses.length + 1, clues.length))
	const shareLine = $derived(guesses.map((g) => (g === answer.id ? '🟩' : '🟥')).join(''))
	const scoreline = $derived(game.result?.won ? `${guesses.length}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`)

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
		Guess the famous vulnerability in {MAX_GUESSES} tries. Type a name and pick from the
		suggestions — only vulns in today's database count.
	</p>
	<p>
		You start with one clue. Every wrong guess reveals another: attack vector, year, product,
		vulnerability type, and finally a redacted description.
	</p>
	<p>Come back tomorrow for a new vuln. 🟩 you got it, 🟥 a miss.</p>
{/snippet}

{#if justWon}
	<Confetti />
{/if}

<div class="space-y-5">
	<GameHeader game={GAME} day={game.day} streak={game.stats.streak} {rules} />

	<!-- Clue stack -->
	<section aria-label="Clues" class="space-y-2.5">
		{#each clues.slice(0, visibleClues) as clue (clue.label)}
			<div class="glass flex items-start gap-3 p-3.5" in:fly={{ y: 12, duration: 300 }}>
				<span aria-hidden="true" class="text-xl">{clue.icon}</span>
				<div class="min-w-0">
					<p class="font-mono text-xs font-bold tracking-wide text-ink-faint uppercase">
						{clue.label}
					</p>
					<p class="font-semibold leading-snug">{clue.value}</p>
				</div>
			</div>
		{/each}
		{#if !game.done && visibleClues < clues.length}
			<p class="px-1 font-mono text-xs font-medium text-ink-faint">
				{clues.length - visibleClues} more {clues.length - visibleClues === 1 ? 'clue' : 'clues'} locked
				— wrong guesses reveal them.
			</p>
		{/if}
	</section>

	<!-- Past guesses -->
	{#if guesses.length > 0}
		<section aria-label="Your guesses" class="space-y-2">
			{#each guesses as g, i (g)}
				{@const correct = g === answer.id}
				{@const last = i === guesses.length - 1}
				<div
					class="flex items-center gap-3 rounded-tile border p-3 font-bold
						{correct
						? 'animate-pop border-good/60 bg-good/10 text-good'
						: `border-bad/40 bg-bad/10 ${last && shaking ? 'animate-shake' : ''}`}"
				>
					<span aria-hidden="true">{correct ? '🟩' : '🟥'}</span>
					<span class="text-ink">{g}</span>
					<span class="ml-auto font-mono text-xs text-ink-faint">{i + 1}/{MAX_GUESSES}</span>
				</div>
			{/each}
		</section>
	{/if}

	{#if game.done}
		<ResultPanel
			heading={game.result!.won ? 'Patched! 🎉' : 'Breach! 💥'}
			subheading={game.result!.won
				? `You named it in ${guesses.length} ${guesses.length === 1 ? 'guess' : 'guesses'}.`
				: 'Out of guesses — better luck tomorrow.'}
			gridPreview={[shareLine || '—']}
			share={{ gameName: GAME.name, dayNumber: game.day, scoreline, lines: [shareLine || '—'] }}
			stats={game.stats}
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
					style="--glow: #ff3e6b"
				>
					Guess
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
