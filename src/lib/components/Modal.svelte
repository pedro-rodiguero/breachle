<script lang="ts">
	import type { Snippet } from 'svelte'
	import { fade, scale } from 'svelte/transition'

	let {
		open = $bindable(false),
		title,
		children
	}: { open?: boolean; title: string; children: Snippet } = $props()

	let panel = $state<HTMLDivElement>()
	let restoreTo: HTMLElement | null = null

	$effect(() => {
		if (open) {
			restoreTo = document.activeElement as HTMLElement | null
			panel?.focus()
		} else {
			restoreTo?.focus()
			restoreTo = null
		}
	})

	function onKeydown(e: KeyboardEvent) {
		if (open && e.key === 'Escape') open = false
	}
</script>

<svelte:window onkeydown={onKeydown} />

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-40 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
		transition:fade={{ duration: 150 }}
		onclick={() => (open = false)}
	>
		<div
			bind:this={panel}
			role="dialog"
			aria-modal="true"
			aria-label={title}
			tabindex="-1"
			onclick={(e) => e.stopPropagation()}
			transition:scale={{ duration: 200, start: 0.92 }}
			class="glass max-h-[85dvh] w-full max-w-md overflow-y-auto p-6 outline-none"
		>
			<div class="mb-4 flex items-start justify-between gap-4">
				<h2 class="text-xl font-bold">{title}</h2>
				<button
					type="button"
					onclick={() => (open = false)}
					aria-label="Close"
					class="grid size-9 shrink-0 place-items-center rounded-full bg-inset text-ink-soft transition hover:text-ink"
				>
					✕
				</button>
			</div>
			<div class="space-y-3 text-[15px] leading-relaxed text-ink-soft">
				{@render children()}
			</div>
		</div>
	</div>
{/if}
