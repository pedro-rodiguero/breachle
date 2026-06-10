<script lang="ts">
	let { count = 70 }: { count?: number } = $props()

	const COLORS = ['#a78bfa', '#ff3e6b', '#ffb224', '#38d4ff', '#54f08c', '#ffd84d']

	const pieces = $derived(Array.from({ length: count }, (_, i) => ({
		left: Math.random() * 100,
		delay: Math.random() * 0.7,
		duration: 2 + Math.random() * 1.6,
		size: 7 + Math.random() * 7,
		color: COLORS[i % COLORS.length],
		round: Math.random() > 0.5
	})))
</script>

<div aria-hidden="true" class="pointer-events-none fixed inset-0 z-50 overflow-hidden">
	{#each pieces as p, i (i)}
		<span
			class="absolute top-0 animate-confetti"
			style="left:{p.left}%; width:{p.size}px; height:{p.size * (p.round ? 1 : 0.45)}px;
				background-color:{p.color}; border-radius:{p.round ? '50%' : '2px'};
				animation-delay:{p.delay}s; animation-duration:{p.duration}s;
				box-shadow: 0 0 8px {p.color}"
		></span>
	{/each}
</div>
