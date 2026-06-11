<script lang="ts">
	import Confetti from '$lib/components/Confetti.svelte'
	import GameHeader from '$lib/components/GameHeader.svelte'
	import ResultPanel from '$lib/components/ResultPanel.svelte'
	import { GAME_BY_ID } from '$lib/config'
	import { COLUMNS, compareGuess, severityOf, SHARE_EMOJI, vendorOf, type Cmp } from '$lib/cvedle'
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

	// Fresh guesses decrypt cell by cell; restored rows render instantly.
	const REVEAL_STAGGER = 130
	const REVEAL_HOLD = REVEAL_STAGGER * COLUMNS.length + 480
	let revealing = $state(false)
	let animateLast = $state(false)

	const remaining = $derived(MAX_GUESSES - guesses.length)

	const suggestions = $derived.by(() => {
		const q = query.trim().toLowerCase()
		if (!q || game.done || revealing) return []
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
		if (game.done || revealing || guesses.includes(cve.id)) return
		guesses = [...guesses, cve.id]
		updateQuery('')
		animateLast = true
		revealing = true
		// Persist immediately; only the celebration waits for the reveal.
		const won = cve.id === answer.id
		if (won) game.complete({ won: true, guesses }, true)
		else if (guesses.length >= MAX_GUESSES) game.complete({ won: false, guesses }, false)
		else game.save({ guesses })
		setTimeout(() => {
			revealing = false
			if (won) justWon = true
			else if (!game.done) {
				shaking = true
				setTimeout(() => (shaking = false), 500)
			}
		}, REVEAL_HOLD)
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

	<!-- Integrity meter (attempts left) + color legend -->
	{#if !game.done || revealing}
		<div class="glass flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-3.5 py-2.5">
			<div class="flex items-center gap-2 font-mono text-[10px] font-bold tracking-widest uppercase">
				<span class="text-ink-faint">integrity</span>
				<span
					class="flex gap-1"
					role="img"
					aria-label="{remaining} of {MAX_GUESSES} attempts remaining"
				>
					{#each Array(MAX_GUESSES) as _, i (i)}
						<span
							class="h-2.5 w-4 rounded-[1px] transition-all duration-700
								{i < remaining ? 'glow bg-good' : 'border border-bad/50 bg-bad/20'}"
							style="--glow: #4dff8f"
						></span>
					{/each}
				</span>
				<span class="text-ink-soft tabular-nums">{remaining}/{MAX_GUESSES}</span>
			</div>
			<div class="flex flex-wrap items-center gap-1.5 font-mono text-[9px] font-bold tracking-wide uppercase">
				<span class="rounded-[1px] bg-good px-1.5 py-0.5 text-black">exact</span>
				<span class="rounded-[1px] bg-warn px-1.5 py-0.5 text-black">close</span>
				<span class="rounded-[1px] bg-bad px-1.5 py-0.5 text-white">off</span>
				<span class="rounded-[1px] border border-edge px-1.5 py-0.5 text-ink-soft">↑ newer · ↓ older</span>
			</div>
		</div>
	{/if}

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
						style="perspective: 480px"
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
								class="grid w-[4.6rem] shrink-0 place-items-center rounded-tile px-1 py-1.5 text-center font-mono text-[10px] leading-tight font-bold
									{cellClass(cell.status)} {row.last && animateLast ? 'animate-cell-reveal' : ''}"
								style="animation-delay: {row.last && animateLast ? ci * REVEAL_STAGGER : 0}ms"
								title={cell.full}
							>
								{#if cell.arrow}
									<span class="flex items-center justify-center gap-1">
										<span>{cell.text}</span>
										<span aria-hidden="true" class="text-xl leading-none font-bold">
											{cell.arrow === 'up' ? '↑' : '↓'}
										</span>
									</span>
								{:else}
									<span class="line-clamp-2 max-w-full">{cell.text}</span>
								{/if}
							</div>
						{/each}
					</div>
				{/each}
			</div>
		</section>
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

	{#if game.done && !revealing}
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
					disabled={revealing}
					oninput={(e) => updateQuery(e.currentTarget.value)}
					onkeydown={onKeydown}
					placeholder={revealing
						? '> cross-referencing attributes…'
						: `Guess ${Math.min(guesses.length + 1, MAX_GUESSES)} of ${MAX_GUESSES}…`}
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
					disabled={revealing || !(suggestions[highlight] ?? matchCve(query))}
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
								class="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left transition
									{i === highlight ? 'bg-cve/15' : ''}"
							>
								<span
									class="w-10 shrink-0 rounded-[1px] py-0.5 text-center font-mono text-[10px] font-bold text-black"
									style="background: {severityOf(s.cvss).color}"
									title="CVSS {s.cvss.toFixed(1)} {severityOf(s.cvss).label}"
								>
									{s.cvss.toFixed(1)}
								</span>
								<span class="min-w-0">
									<span class="block truncate font-semibold {i === highlight ? 'text-cve' : 'text-ink'}">
										{s.id}
									</span>
									{#if s.cveId}
										<span class="block font-mono text-[10px] font-medium text-ink-faint">{s.cveId}</span>
									{/if}
								</span>
								<span
									class="ml-auto shrink-0 text-right font-mono text-[10px] leading-snug font-semibold text-ink-soft"
								>
									{vendorOf(s.product)}<br />{s.year}
								</span>
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</form>
	{/if}
</div>
