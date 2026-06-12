<script lang="ts">
	import Confetti from '$lib/components/Confetti.svelte'
	import GameHeader from '$lib/components/GameHeader.svelte'
	import ResultPanel from '$lib/components/ResultPanel.svelte'
	import { GAME_BY_ID } from '$lib/config'
	import { TRIAGE_PUZZLES } from '$lib/data/triage'
	import { WARMUP_TRIAGE } from '$lib/data/warmup'
	import { archiveDateFromHash, DailyGame } from '$lib/daily.svelte'
	import { dailyPick, dailyRng, shuffleWith } from '$lib/seed'
	import { flip } from 'svelte/animate'
	import { fly, scale } from 'svelte/transition'

	const MAX_MISTAKES = 4
	const GAME = GAME_BY_ID.triage

	// Tile ids 0-15: group = id >> 2, tile = id & 3.
	type Progress = { solved: number[]; mistakes: number; history: number[][] }
	type Result = { won: boolean; mistakes: number; history: number[][] }

	const DIFF_EMOJI: Record<number, string> = { 1: '🟨', 2: '🟩', 3: '🟦', 4: '🟪' }
	const DIFF_BG: Record<number, string> = {
		1: 'bg-diff-1',
		2: 'bg-diff-2',
		3: 'bg-diff-3',
		4: 'bg-diff-4'
	}

	const game = new DailyGame<Progress, Result>('triage', archiveDateFromHash())

	// Puzzle comes from the no-repeat rotation (warm-up days bring their own);
	// the board shuffle stays on the per-day PRNG so it's stable on reload.
	const puzzle = WARMUP_TRIAGE[game.todayKey] ?? dailyPick('triage', TRIAGE_PUZZLES, game.todayKey)
	const tileOrder = shuffleWith(dailyRng('triage', game.todayKey), Array.from({ length: 16 }, (_, i) => i))

	// A completed game stores only the result; solved groups are the history
	// rows where all four picks shared a group.
	const saved = game.result ?? game.savedProgress
	let solved = $state<number[]>(
		game.result
			? game.result.history.filter((row) => row.every((g) => g === row[0])).map((row) => row[0])
			: (game.savedProgress?.solved ?? [])
	)
	let mistakes = $state(saved?.mistakes ?? 0)
	let history = $state<number[][]>(saved?.history ?? [])
	let selected = $state<number[]>([])
	// Sorted tile-id combos already tried this session (duplicate guard).
	let attempts = $state<string[]>([])
	let order = $state(tileOrder)
	let shaking = $state(false)
	let toast = $state('')
	let justWon = $state(false)
	let toastTimer: ReturnType<typeof setTimeout>

	// Staged end-of-game reveal: banners come in one at a time, then the
	// result panel drops in. A page restored already-finished skips it.
	let visibleBanners = $state(game.done ? 4 : 0)
	let showPanel = $state(game.done)

	function runReveal(from: number) {
		visibleBanners = from
		const step = () => {
			if (visibleBanners < 4) {
				visibleBanners += 1
				setTimeout(step, 850)
			} else {
				setTimeout(() => (showPanel = true), 750)
			}
		}
		setTimeout(step, 650)
	}

	const tileLabel = (id: number) => puzzle.groups[id >> 2].tiles[id & 3]
	const remaining = $derived(order.filter((id) => !solved.includes(id >> 2)))
	const shareLines = $derived(
		history.map((row) => row.map((g) => DIFF_EMOJI[puzzle.groups[g].difficulty]).join(''))
	)
	// Reveal order in the locked view: solved first, then the rest by difficulty.
	const revealOrder = $derived([
		...solved,
		...puzzle.groups.map((_, i) => i).filter((i) => !solved.includes(i))
	])

	function showToast(msg: string) {
		toast = msg
		clearTimeout(toastTimer)
		toastTimer = setTimeout(() => (toast = ''), 1800)
	}

	function toggle(id: number) {
		if (game.done) return
		selected = selected.includes(id)
			? selected.filter((s) => s !== id)
			: selected.length < 4
				? [...selected, id]
				: selected
	}

	function submit() {
		if (selected.length !== 4 || game.done) return
		// Identical combos shouldn't cost a second life.
		const key = [...selected].sort((a, b) => a - b).join(',')
		if (attempts.includes(key)) {
			showToast('Already tried that! 🤔')
			return
		}
		attempts = [...attempts, key]
		const groupsOf = selected.map((id) => id >> 2)
		history = [...history, groupsOf]

		const counts = new Map<number, number>()
		groupsOf.forEach((g) => counts.set(g, (counts.get(g) ?? 0) + 1))
		const best = Math.max(...counts.values())

		if (best === 4) {
			solved = [...solved, groupsOf[0]]
			selected = []
			if (solved.length === 4) {
				justWon = true
				game.complete({ won: true, mistakes, history }, true)
				// All four already on screen, so just a quick beat then the panel.
				runReveal(4)
			} else {
				game.save({ solved, mistakes, history })
			}
		} else {
			mistakes += 1
			shaking = true
			setTimeout(() => (shaking = false), 500)
			if (mistakes >= MAX_MISTAKES) {
				game.complete({ won: false, mistakes, history }, false)
				// Reveal the unsolved categories one by one.
				runReveal(solved.length)
			} else {
				if (best === 3) showToast('One away! 😬')
				game.save({ solved, mistakes, history })
			}
		}
	}
</script>

{#snippet rules()}
	<p>
		16 alert artifacts hit your SOC queue. Group them into 4 hidden attack types, 4 tiles each.
	</p>
	<p>
		Select 4 tiles and hit <strong>[ SUBMIT ]</strong>. Wrong combos cost a life — you have
		{MAX_MISTAKES}. Watch for red herrings: some artifacts look like one attack but belong to
		another.
	</p>
	<p>Colors show difficulty: 🟨 easiest → 🟪 trickiest.</p>
{/snippet}

{#snippet groupBanner(g: number, _i: number)}
	{@const group = puzzle.groups[g]}
	<div
		class="animate-pop rounded-tile p-3 text-center {DIFF_BG[group.difficulty]}"
		style="color: #12162b"
	>
		<p class="font-mono text-sm font-extrabold tracking-wide uppercase">{group.category}</p>
		<p class="font-mono text-xs leading-snug font-medium">{group.tiles.join(' · ')}</p>
	</div>
{/snippet}

{#if justWon}
	<Confetti />
{/if}

<div class="space-y-4">
	<GameHeader game={GAME} day={game.day} streak={game.stats.streak} archive={game.archive} {rules} autoRules />

	{#if solved.length > 0 && !game.done}
		<div class="space-y-2">
			{#each solved as g, i (g)}
				{@render groupBanner(g, i)}
			{/each}
		</div>
	{/if}

	{#if game.done}
		<div class="space-y-2">
			{#each revealOrder.slice(0, visibleBanners) as g, i (g)}
				<div in:fly={{ y: 18, duration: 450 }}>
					{@render groupBanner(g, i)}
				</div>
			{/each}
		</div>
		{#if !showPanel}
			<p class="px-1 font-mono text-xs font-bold tracking-widest text-brand uppercase" role="status">
				&gt; decrypting incident report… [{visibleBanners}/4]<span class="animate-blink">▮</span>
			</p>
		{:else}
			<div in:fly={{ y: 22, duration: 450 }}>
				<ResultPanel
					heading={game.result!.won ? 'Queue cleared! 🎉' : 'Alert fatigue 😵'}
					subheading={game.result!.won
						? mistakes === 0
							? 'Perfect triage — zero mistakes.'
							: `Solved with ${mistakes} ${mistakes === 1 ? 'mistake' : 'mistakes'}.`
						: 'Too many misfiled alerts. The board is revealed above.'}
					gridPreview={shareLines}
					share={{
						gameName: GAME.name,
						dayNumber: game.day,
						lines: shareLines,
						icon: GAME.icon,
						accent: GAME.glow
					}}
					stats={game.stats}
					archive={game.archive}
				/>
			</div>
		{/if}
	{:else}
		<div
			class="grid grid-cols-4 gap-2 {shaking ? 'animate-shake' : ''}"
			role="group"
			aria-label="Alert tiles"
		>
			{#each remaining as id (id)}
				{@const isSel = selected.includes(id)}
				<button
					type="button"
					onclick={() => toggle(id)}
					aria-pressed={isSel}
					animate:flip={{ duration: 300 }}
					out:scale={{ duration: 250, start: 0.85 }}
					class="min-h-18 rounded-tile border px-1 py-2 font-mono text-[11px] leading-tight font-medium transition active:scale-95 sm:text-xs
						{isSel
						? 'glow border-brand bg-brand-deep/30 text-ink'
						: 'border-edge bg-card backdrop-blur-sm hover:border-edge-strong'}"
					style="--glow: #4dff8f"
				>
					{tileLabel(id)}
				</button>
			{/each}
		</div>

		<div class="flex items-center justify-between">
			<p class="text-sm font-semibold text-ink-soft" aria-live="polite">
				Lives:
				<span aria-hidden="true">
					{'❤️'.repeat(MAX_MISTAKES - mistakes)}{'🖤'.repeat(mistakes)}
				</span>
				<span class="sr-only">{MAX_MISTAKES - mistakes} remaining</span>
			</p>
			{#if toast}
				<p role="status" class="animate-pop text-sm font-bold text-warn">{toast}</p>
			{/if}
		</div>

		<div class="flex gap-2">
			<button
				type="button"
				onclick={() => (order = shuffleWith(() => Math.random(), order))}
				class="glass flex-1 py-3 font-semibold text-ink-soft transition hover:border-edge-strong active:translate-y-0.5"
				style="border-radius: var(--radius-tile)"
			>
				[ SHUFFLE ]
			</button>
			<button
				type="button"
				onclick={() => (selected = [])}
				disabled={selected.length === 0}
				class="glass flex-1 py-3 font-semibold text-ink-soft transition hover:border-edge-strong active:translate-y-0.5 disabled:opacity-40"
				style="border-radius: var(--radius-tile)"
			>
				[ DESELECT ]
			</button>
			<button
				type="button"
				onclick={submit}
				disabled={selected.length !== 4}
				class="glow flex-1 rounded-tile bg-triage-deep py-3 font-bold text-black transition hover:brightness-115 active:translate-y-0.5 disabled:opacity-40"
				style="--glow: #ffb000"
			>
				[ SUBMIT ]
			</button>
		</div>
	{/if}
</div>
