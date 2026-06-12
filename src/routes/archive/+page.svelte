<script lang="ts">
	import { EPOCH_UTC, GAMES } from '$lib/config'
	import { WARMUP_DAYS } from '$lib/data/warmup'
	import { dayNumber, utcDateKey } from '$lib/seed'
	import { getCompletionLog, type Outcome } from '$lib/storage'

	const todayKey = utcDateKey()
	const todayNum = dayNumber(todayKey)
	const log = getCompletionLog()

	const row = (n: number, key: string) => {
		const outcomes = GAMES.map((g) => log[g.id]?.[key] as Outcome | undefined)
		return {
			n,
			key,
			isToday: key === todayKey,
			outcomes,
			cleared: outcomes.every(Boolean)
		}
	}

	// All puzzle days, newest first. Day 1 = EPOCH_UTC; the warm-up days
	// (n = 0) sit before launch and bring their own puzzles.
	const days = [
		...Array.from({ length: todayNum }, (_, i) => {
			const n = todayNum - i
			return row(n, new Date(Date.parse(EPOCH_UTC) + (n - 1) * 86_400_000).toISOString().slice(0, 10))
		}),
		...[...WARMUP_DAYS].reverse().map((key) => row(0, key))
	]
	const clearedCount = days.filter((d) => d.cleared).length
</script>

<div class="space-y-4">
	<div class="animate-rise">
		<p class="mb-1.5 font-mono text-[11px] font-bold tracking-[0.25em] text-ink-faint uppercase">
			<span class="text-brand">&gt;</span> ls /var/archive --sort=desc
		</p>
		<h1 class="font-display text-3xl font-bold tracking-tight sm:text-4xl">
			puzzle <span class="text-gradient">archive</span>
		</h1>
		<p class="mt-1 font-mono text-xs text-ink-soft">
			Replay any past drop. Archive runs are casual — streaks and stats stay untouched.
		</p>
		{#if clearedCount > 0}
			<p class="mt-1.5 font-mono text-xs font-bold text-brand">
				▰ {clearedCount}/{days.length}
				{clearedCount === days.length ? 'days cleared — archive 100%! 🏆' : 'days fully cleared'}
			</p>
		{/if}
	</div>

	<div class="glass bracket animate-rise overflow-hidden" style="animation-delay: 60ms">
		<div
			class="flex items-center justify-between border-b border-edge bg-inset px-4 py-2 font-mono text-[11px] font-bold tracking-wider text-ink-faint uppercase"
		>
			<span>// drops</span>
			<span>modules</span>
		</div>
		{#each days as { n, key, isToday, outcomes, cleared }, i (key)}
			<div
				class="flex items-center gap-3 px-4 py-3 {i < days.length - 1 ? 'border-b border-edge' : ''}
					{cleared ? 'bg-good/5' : ''}"
			>
				<div class="min-w-0 flex-1">
					<p class="font-mono text-sm font-bold">
						{#if n === 0}
							<span class="rounded-tile border border-amber/60 bg-amber/10 px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wider text-amber uppercase"
								title="Pre-launch warm-up drop"
							>
								warm-up
							</span>
						{:else}
							#{String(n).padStart(3, '0')}
						{/if}
						{#if isToday}
							<span class="ml-1 rounded-tile border border-brand/60 bg-brand/10 px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wider text-brand uppercase">
								today
							</span>
						{/if}
						{#if cleared}
							<span class="glow ml-1 rounded-tile border border-good/60 bg-good/10 px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wider text-good uppercase"
								style="--glow: #4dff8f"
							>
								✓ all clear
							</span>
						{/if}
					</p>
					<p class="font-mono text-xs text-ink-faint">{key}</p>
				</div>
				<div class="flex gap-1.5">
					{#each GAMES as game, gi (game.id)}
						{@const outcome = outcomes[gi]}
						<a
							href="#{game.path}{isToday ? '' : `?d=${key}`}"
							aria-label="{game.name}, {n === 0 ? `warm-up ${key}` : `day ${n}`}{outcome ? ` — ${outcome}` : ''}"
							title="{game.name}{outcome ? ` · ${outcome === 'won' ? 'solved' : 'attempted'}` : ''}"
							class="relative grid size-9 place-items-center rounded-tile border bg-raised text-lg transition hover:scale-110
								{outcome === 'won'
								? 'border-good/60'
								: outcome === 'lost'
									? 'border-bad/50'
									: 'glow border-edge hover:border-edge-strong'}"
							style="--glow: {game.glow}"
						>
							<span class={outcome ? 'opacity-60 saturate-50' : ''}>{game.icon}</span>
							{#if outcome}
								<span
									aria-hidden="true"
									class="absolute -top-1.5 -right-1.5 grid size-4 place-items-center rounded-full font-mono text-[9px] font-bold
										{outcome === 'won' ? 'bg-good text-black' : 'bg-bad text-white'}"
								>
									{outcome === 'won' ? '✓' : '✗'}
								</span>
							{/if}
						</a>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
