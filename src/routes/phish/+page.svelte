<script lang="ts">
	import Confetti from '$lib/components/Confetti.svelte'
	import GameHeader from '$lib/components/GameHeader.svelte'
	import ResultPanel from '$lib/components/ResultPanel.svelte'
	import { GAME_BY_ID } from '$lib/config'
	import { PHISH_ITEMS, type PhishItem } from '$lib/data/phish'
	import { DailyGame } from '$lib/daily.svelte'
	import { dailySample } from '$lib/seed'
	import { fly } from 'svelte/transition'

	const ROUND_SIZE = 5
	const GAME = GAME_BY_ID.phish

	/** answers[i] = true means the player called item i a phish. */
	type Progress = { answers: boolean[] }
	type Result = { answers: boolean[] }

	const game = new DailyGame<Progress, Result>('phish')
	const items = dailySample('phish', PHISH_ITEMS, ROUND_SIZE, game.todayKey)

	let answers = $state<boolean[]>(game.result?.answers ?? game.savedProgress?.answers ?? [])
	/** Index currently shown in its revealed (verdict) state, if any. */
	let revealedIdx = $state<number | null>(null)
	let justWon = $state(false)

	const current = $derived(revealedIdx ?? answers.length)
	const item = $derived(items[Math.min(current, items.length - 1)])
	const revealed = $derived(revealedIdx !== null)
	const scoreOf = (ans: boolean[]) => ans.filter((a, i) => a === items[i].isPhish).length
	const gridLine = (ans: boolean[]) =>
		ans.map((a, i) => (a === items[i].isPhish ? '✅' : '❌')).join('')

	// Refresh-during-final-reveal edge case: all answered but never finalized.
	// Reading the just-restored initial value here is intentional.
	// svelte-ignore state_referenced_locally
	const restored = answers
	if (!game.done && restored.length >= items.length) {
		game.complete({ answers: restored }, scoreOf(restored) >= items.length - 1)
	}

	function answer(saidPhish: boolean) {
		if (game.done || revealed) return
		answers = [...answers, saidPhish]
		revealedIdx = answers.length - 1
		game.save({ answers })
	}

	function advance() {
		revealedIdx = null
		if (answers.length >= items.length) {
			const finalScore = scoreOf(answers)
			if (finalScore === items.length) justWon = true
			game.complete({ answers }, finalScore >= items.length - 1)
		}
	}
</script>

{#snippet rules()}
	<p>
		{ROUND_SIZE} suspicious items land in front of you — rendered emails and URLs. Call each one:
		<strong>Phish</strong> or <strong>Legit</strong>.
	</p>
	<p>
		After each call you'll see the verdict and the tells: lookalike domains, mismatched links,
		urgency tricks, failed SPF checks…
	</p>
	<p>Everything is inert sample data. No link here is real or clickable.</p>
{/snippet}

{#snippet tells(it: PhishItem)}
	<ul class="mt-2 space-y-1.5 text-sm font-medium text-ink-soft">
		{#each it.tells as t (t)}
			<li>{it.isPhish ? '🚩' : '🛡️'} {t}</li>
		{/each}
	</ul>
{/snippet}

{#snippet emailCard(it: PhishItem, isRevealed: boolean)}
	<div class="glass overflow-hidden">
		<div class="space-y-1 border-b border-edge bg-raised px-4 py-3">
			<p class="text-sm">
				<span class="font-semibold text-ink-faint">From: </span>
				<span class="font-mono font-semibold break-all">{it.from}</span>
			</p>
			<p class="text-sm leading-snug font-bold">{it.subject}</p>
			{#if it.headerNote}
				<span
					class="inline-block rounded-full border border-edge bg-inset px-2.5 py-0.5 font-mono text-[11px] font-medium text-ink-soft"
				>
					{it.headerNote}
				</span>
			{/if}
		</div>
		<div class="space-y-3 px-4 py-4 text-[15px] leading-relaxed">
			<p>{it.body}</p>
			{#if it.link}
				<p>
					<span
						class="cursor-not-allowed font-semibold break-all text-phish underline decoration-2 underline-offset-2"
					>
						{it.link.text}
					</span>
					{#if isRevealed && it.link.href !== it.link.text}
						<span class="mt-1 block font-mono text-xs font-semibold break-all text-bad">
							↳ actually points to: {it.link.href}
						</span>
					{/if}
				</p>
			{/if}
		</div>
		<p class="border-t border-edge px-4 py-1.5 font-mono text-[11px] font-medium text-ink-faint">
			🔒 Sample data — nothing here is clickable.
		</p>
	</div>
{/snippet}

{#snippet urlCard(it: PhishItem)}
	<div class="glass p-4">
		<p class="mb-2 font-mono text-xs font-bold tracking-wide text-ink-faint uppercase">
			You're about to visit:
		</p>
		<div class="rounded-tile border border-edge bg-inset px-3 py-3">
			<p class="font-mono text-sm leading-relaxed font-semibold break-all">{it.displayUrl}</p>
		</div>
	</div>
{/snippet}

{#if justWon}
	<Confetti />
{/if}

<div class="space-y-4">
	<GameHeader game={GAME} day={game.day} streak={game.stats.streak} {rules} />

	{#if game.done}
		{@const finalAnswers = game.result!.answers}
		{@const finalScore = scoreOf(finalAnswers)}
		<ResultPanel
			heading={finalScore === items.length
				? 'Inbox zero threats! 🎉'
				: finalScore >= items.length - 1
					? 'Sharp eye! 👀'
					: 'You got phished 🎣'}
			subheading="You spotted {finalScore} of {items.length} correctly."
			gridPreview={[gridLine(finalAnswers)]}
			share={{
				gameName: GAME.name,
				dayNumber: game.day,
				scoreline: `${finalScore}/${items.length}`,
				lines: [gridLine(finalAnswers)]
			}}
			stats={game.stats}
		>
			<div class="mb-5 space-y-2 text-left">
				{#each items as it, i (i)}
					<details class="rounded-tile border border-edge bg-inset px-3 py-2">
						<summary class="cursor-pointer text-sm font-semibold">
							{finalAnswers[i] === it.isPhish ? '✅' : '❌'}
							{it.kind === 'email' ? it.subject : it.displayUrl}
							<span class="ml-1 font-bold {it.isPhish ? 'text-bad' : 'text-good'}">
								— {it.isPhish ? 'phish' : 'legit'}
							</span>
						</summary>
						{@render tells(it)}
					</details>
				{/each}
			</div>
		</ResultPanel>
	{:else}
		<div class="flex items-center justify-between px-1">
			<p class="font-mono text-sm font-bold text-ink-soft">
				{Math.min(current + 1, items.length)} / {items.length}
			</p>
			<p aria-hidden="true" class="text-sm tracking-widest">
				{#each items as it, i (i)}{i < answers.length
						? answers[i] === it.isPhish
							? '✅'
							: '❌'
						: '⬜'}{/each}
			</p>
		</div>

		{#key current}
			<div class="space-y-4" in:fly={{ y: 14, duration: 300 }}>
				{#if item.kind === 'email'}
					{@render emailCard(item, revealed)}
				{:else}
					{@render urlCard(item)}
				{/if}

				{#if revealed}
					<div
						class="animate-pop rounded-card border p-4
							{answers[current] === item.isPhish ? 'border-good/60 bg-good/10' : 'border-bad/60 bg-bad/10'}"
						role="status"
					>
						<p class="text-lg font-bold">
							{answers[current] === item.isPhish ? 'Correct! ' : 'Nope — '}
							it's
							<span class={item.isPhish ? 'text-bad' : 'text-good'}>
								{item.isPhish ? 'a phish 🎣' : 'legit ✅'}
							</span>
						</p>
						{@render tells(item)}
						<button
							type="button"
							onclick={advance}
							class="glow mt-4 w-full rounded-tile bg-phish-deep py-3 font-bold text-white transition hover:brightness-115 active:translate-y-0.5"
							style="--glow: #38d4ff"
						>
							{answers.length >= items.length ? 'See results' : 'Next →'}
						</button>
					</div>
				{:else}
					<div class="grid grid-cols-2 gap-3">
						<button
							type="button"
							onclick={() => answer(true)}
							class="glow rounded-tile bg-cve-deep py-4 text-lg font-bold text-white transition hover:brightness-115 active:translate-y-0.5"
							style="--glow: #ff3e6b"
						>
							🎣 Phish
						</button>
						<button
							type="button"
							onclick={() => answer(false)}
							class="glow rounded-tile bg-malware-deep py-4 text-lg font-bold text-black transition hover:brightness-115 active:translate-y-0.5"
							style="--glow: #54f08c"
						>
							✅ Legit
						</button>
					</div>
				{/if}
			</div>
		{/key}
	{/if}

	<p class="text-center font-mono text-xs font-medium text-ink-faint">
		🔒 All phishing domains and senders shown here are fictional. Nothing is clickable.
	</p>
</div>
