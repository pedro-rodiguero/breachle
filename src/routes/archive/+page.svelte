<script lang="ts">
	import { EPOCH_UTC, GAMES } from '$lib/config'
	import { dayNumber, utcDateKey } from '$lib/seed'

	const todayKey = utcDateKey()
	const todayNum = dayNumber(todayKey)

	// All puzzle days, newest first. Day 1 = EPOCH_UTC.
	const days = Array.from({ length: todayNum }, (_, i) => {
		const n = todayNum - i
		const key = new Date(Date.parse(EPOCH_UTC) + (n - 1) * 86_400_000)
			.toISOString()
			.slice(0, 10)
		return { n, key, isToday: key === todayKey }
	})
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
	</div>

	<div class="glass bracket animate-rise overflow-hidden" style="animation-delay: 60ms">
		<div
			class="flex items-center justify-between border-b border-edge bg-inset px-4 py-2 font-mono text-[11px] font-bold tracking-wider text-ink-faint uppercase"
		>
			<span>// drops</span>
			<span>modules</span>
		</div>
		{#each days as { n, key, isToday }, i (key)}
			<div
				class="flex items-center gap-3 px-4 py-3 {i < days.length - 1 ? 'border-b border-edge' : ''}"
			>
				<div class="min-w-0 flex-1">
					<p class="font-mono text-sm font-bold">
						#{String(n).padStart(3, '0')}
						{#if isToday}
							<span class="ml-1 rounded-tile border border-brand/60 bg-brand/10 px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wider text-brand uppercase">
								today
							</span>
						{/if}
					</p>
					<p class="font-mono text-xs text-ink-faint">{key}</p>
				</div>
				<div class="flex gap-1.5">
					{#each GAMES as game (game.id)}
						<a
							href="#{game.path}{isToday ? '' : `?d=${key}`}"
							aria-label="{game.name}, day {n}"
							title={game.name}
							class="glow grid size-9 place-items-center rounded-tile border border-edge bg-raised text-lg transition hover:scale-110 hover:border-edge-strong"
							style="--glow: {game.glow}"
						>
							{game.icon}
						</a>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
