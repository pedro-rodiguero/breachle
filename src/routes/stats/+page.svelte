<script lang="ts">
	import Modal from '$lib/components/Modal.svelte'
	import ShareSheet from '$lib/components/ShareSheet.svelte'
	import { GAMES } from '$lib/config'
	import { dayNumber, utcDateKey } from '$lib/seed'
	import { getCompletionLog, getDisplayStreak, getGameStatus, getStats } from '$lib/storage'

	const todayKey = utcDateKey()
	const log = getCompletionLog()

	// Last 7 days (today included), from the completion log.
	const weekKeys = Array.from({ length: 7 }, (_, i) =>
		new Date(Date.parse(todayKey) - i * 86_400_000).toISOString().slice(0, 10)
	)

	const rows = GAMES.map((game) => {
		const stats = getStats(game.id)
		const outcomes = weekKeys.map((k) => log[game.id]?.[k]).filter(Boolean)
		return {
			game,
			stats,
			liveStreak: getDisplayStreak(game.id, todayKey),
			doneToday: getGameStatus(game.id, todayKey) === 'done',
			winRate: stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0,
			weekPlayed: outcomes.length,
			weekWins: outcomes.filter((o) => o === 'won').length
		}
	})

	const totals = {
		played: rows.reduce((s, r) => s + r.stats.played, 0),
		wins: rows.reduce((s, r) => s + r.stats.wins, 0),
		bestStreak: Math.max(...rows.map((r) => r.stats.maxStreak)),
		clearedToday: rows.filter((r) => r.doneToday).length
	}
	const totalWinRate = totals.played > 0 ? Math.round((totals.wins / totals.played) * 100) : 0

	const week = {
		played: rows.reduce((s, r) => s + r.weekPlayed, 0),
		wins: rows.reduce((s, r) => s + r.weekWins, 0),
		// Days in the window with at least one puzzle finished.
		activeDays: weekKeys.filter((k) => GAMES.some((g) => log[g.id]?.[k])).length
	}
	const weekWinRate = week.played > 0 ? Math.round((week.wins / week.played) * 100) : 0

	let shareOpen = $state(false)
	const share = {
		gameName: 'Analyst Stats',
		dayNumber: dayNumber(todayKey),
		scoreline: `${totalWinRate}% win rate`,
		lines: [
			...rows.map((r) => `${r.game.icon} ${r.stats.wins}W/${r.stats.played}P · 🔥${r.liveStreak}`),
			`7d: ${week.wins}W/${week.played}P`
		],
		icon: '📊',
		accent: '#4dff8f'
	}
</script>

{#snippet statBox(value: string | number, label: string)}
	<div class="flex flex-col items-center rounded-tile border border-edge bg-inset px-3 py-2">
		<span class="font-mono text-xl font-bold text-brand tabular-nums">{value}</span>
		<span class="font-mono text-[10px] font-semibold tracking-wide text-ink-faint uppercase">
			{label}
		</span>
	</div>
{/snippet}

<div class="space-y-4">
	<div class="animate-rise flex items-end justify-between gap-3">
		<div>
			<p class="mb-1.5 font-mono text-[11px] font-bold tracking-[0.25em] text-ink-faint uppercase">
				<span class="text-brand">&gt;</span> cat /var/log/analyst_stats
			</p>
			<h1 class="font-display text-3xl font-bold tracking-tight sm:text-4xl">
				analyst <span class="text-gradient">stats</span>
			</h1>
		</div>
		<button
			type="button"
			onclick={() => (shareOpen = true)}
			class="glow shrink-0 rounded-tile bg-brand-deep px-4 py-2.5 font-mono text-sm font-bold tracking-wider text-black transition hover:brightness-115 active:translate-y-0.5"
			style="--glow: #18e06a"
		>
			[ SHARE STATS ]
		</button>
	</div>

	<section class="glass bracket animate-rise p-5" style="animation-delay: 60ms" aria-label="Overall stats">
		<p class="mb-3 font-mono text-[11px] font-bold tracking-wider text-ink-faint uppercase">
			// all modules — all time
		</p>
		<div class="grid grid-cols-4 gap-2">
			{@render statBox(totals.played, 'Played')}
			{@render statBox(totals.wins, 'Wins')}
			{@render statBox(`${totalWinRate}%`, 'Win rate')}
			{@render statBox(`${totals.clearedToday}/4`, 'Today')}
		</div>
	</section>

	<section class="glass bracket animate-rise p-5" style="animation-delay: 90ms" aria-label="Last 7 days">
		<p class="mb-3 font-mono text-[11px] font-bold tracking-wider text-ink-faint uppercase">
			// all modules — last 7 days
		</p>
		<div class="grid grid-cols-4 gap-2">
			{@render statBox(week.played, 'Played')}
			{@render statBox(week.wins, 'Wins')}
			{@render statBox(`${weekWinRate}%`, 'Win rate')}
			{@render statBox(`${week.activeDays}/7`, 'Active days')}
		</div>
		<div class="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] font-semibold text-ink-soft">
			{#each rows as r (r.game.id)}
				<span title="{r.game.name}: won {r.weekWins} of {r.weekPlayed} this week">
					<span aria-hidden="true">{r.game.icon}</span>
					{r.weekWins}W/{r.weekPlayed}P
				</span>
			{/each}
		</div>
	</section>

	{#each rows as { game, stats, liveStreak, winRate }, i (game.id)}
		<section
			class="glass animate-rise p-5"
			style="animation-delay: {120 + i * 60}ms"
			aria-label="{game.name} stats"
		>
			<div class="mb-3 flex items-center gap-2.5">
				<span
					aria-hidden="true"
					class="glow grid size-9 place-items-center rounded-tile bg-raised text-xl"
					style="--glow: {game.glow}"
				>
					{game.icon}
				</span>
				<h2 class="font-display text-2xl font-bold" style="color: {game.glow}">{game.name}</h2>
				<a
					href="#{game.path}"
					class="ml-auto font-mono text-[11px] font-bold tracking-wider text-ink-soft hover:text-brand"
				>
					[ PLAY ]
				</a>
			</div>
			<div class="grid grid-cols-5 gap-2">
				{@render statBox(liveStreak, 'Streak')}
				{@render statBox(stats.maxStreak, 'Best')}
				{@render statBox(stats.played, 'Played')}
				{@render statBox(stats.wins, 'Wins')}
				{@render statBox(`${winRate}%`, 'Win rate')}
			</div>
		</section>
	{/each}
</div>

<Modal bind:open={shareOpen} title="Share your stats">
	<ShareSheet {share} />
</Modal>
