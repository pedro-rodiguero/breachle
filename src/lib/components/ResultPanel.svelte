<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { GameStats } from '$lib/storage'
	import type { ShareInput } from '$lib/share'
	import Countdown from './Countdown.svelte'
	import ShareButton from './ShareButton.svelte'
	import ShareCard from './ShareCard.svelte'

	let {
		heading,
		subheading,
		gridPreview,
		share,
		stats,
		children
	}: {
		heading: string
		subheading?: string
		gridPreview: string[]
		share: ShareInput
		stats: GameStats
		children?: Snippet
	} = $props()
</script>

<section aria-label="Today's result" class="glass bracket animate-rise p-6 text-center">
	<p class="mb-2 font-mono text-[11px] font-bold tracking-[0.25em] text-ink-faint uppercase">
		<span class="text-brand">&gt;</span> session complete
	</p>
	<h2 class="glitch font-display text-2xl font-bold text-brand phosphor" data-text={heading}>
		{heading}
	</h2>
	{#if subheading}
		<p class="mt-1 text-sm font-medium text-ink-soft">{subheading}</p>
	{/if}
	<div class="my-4 space-y-1 text-xl leading-tight" aria-hidden="true">
		{#each gridPreview as line, i (i)}
			<div>{line}</div>
		{/each}
	</div>
	<div class="mb-5 flex justify-center gap-3">
		{#each [[stats.streak, 'Streak'], [stats.maxStreak, 'Best'], [stats.played, 'Played']] as const as [value, label] (label)}
			<div class="flex min-w-20 flex-col items-center rounded-tile border border-edge bg-inset px-4 py-2.5">
				<span class="font-mono text-2xl font-bold text-brand tabular-nums">{value}</span>
				<span class="font-mono text-[11px] font-semibold tracking-wide text-ink-faint uppercase">
					{label}
				</span>
			</div>
		{/each}
	</div>
	{#if children}
		{@render children()}
	{/if}
	<ShareCard {share} />
	<div class="flex flex-col items-center gap-3">
		<ShareButton {share} />
		<Countdown />
	</div>
</section>
