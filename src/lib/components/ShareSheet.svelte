<script lang="ts">
	import {
		buildShareText,
		buildShareTitle,
		buildSocialText,
		copyToClipboard,
		linkedInComposeUrl,
		redditComposeUrl,
		telegramComposeUrl,
		whatsAppComposeUrl,
		xComposeUrl,
		type ShareInput
	} from '$lib/share'
	import { renderShareCard, shareCardFilename } from '$lib/sharecard'

	// Share modal: result card front and center, then a destination grid.
	// The PNG rides the native share sheet on mobile or the clipboard on
	// desktop, where the web composer opens with the text preloaded.
	let { share }: { share: ShareInput } = $props()

	type Network = 'linkedin' | 'x' | 'whatsapp' | 'telegram' | 'reddit'

	const NETWORKS: { id: Network; label: string; color: string; fill?: boolean }[] = [
		{ id: 'linkedin', label: 'LINKEDIN', color: '#2f9de6', fill: true },
		{ id: 'x', label: 'X / TWITTER', color: '#c6f7d8' },
		{ id: 'whatsapp', label: 'WHATSAPP', color: '#4dff8f' },
		{ id: 'telegram', label: 'TELEGRAM', color: '#2fc9e6' },
		{ id: 'reddit', label: 'REDDIT', color: '#ff6a3d' }
	]

	function composerUrl(network: Network, text: string): string {
		switch (network) {
			case 'linkedin':
				return linkedInComposeUrl(text)
			case 'x':
				return xComposeUrl(text)
			case 'whatsapp':
				return whatsAppComposeUrl(text)
			case 'telegram':
				return telegramComposeUrl(text)
			case 'reddit':
				return redditComposeUrl(buildShareTitle(share), text)
		}
	}

	let blob = $state<Blob | null>(null)
	let previewUrl = $state('')
	let hint = $state('')
	let canNative = $state(false)
	let exportLabels = $state({
		text: '[ COPY TEXT ]',
		image: '[ COPY IMAGE ]',
		png: '[ SAVE PNG ]'
	})
	let timer: ReturnType<typeof setTimeout>

	$effect(() => {
		canNative = typeof navigator !== 'undefined' && !!navigator.share
		let stale = false
		renderShareCard(share)
			.then((b) => {
				if (stale) return
				blob = b
				previewUrl = URL.createObjectURL(b)
			})
			.catch(() => {
				// No card preview; text sharing still works.
			})
		return () => {
			stale = true
			if (previewUrl) URL.revokeObjectURL(previewUrl)
			clearTimeout(timer)
		}
	})

	function flash(key: keyof typeof exportLabels, value: string) {
		const defaults = { text: '[ COPY TEXT ]', image: '[ COPY IMAGE ]', png: '[ SAVE PNG ]' }
		exportLabels = { ...defaults, [key]: value }
		clearTimeout(timer)
		timer = setTimeout(() => (exportLabels = defaults), 2000)
	}

	async function copyText() {
		const ok = await copyToClipboard(buildShareText(share))
		flash('text', ok ? '[ COPIED ✓ ]' : '[ FAILED ✗ ]')
	}

	async function copyImage() {
		if (!blob) return
		try {
			await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
			flash('image', '[ COPIED ✓ ]')
		} catch {
			flash('image', '[ BLOCKED ✗ ]')
			hint = 'clipboard blocked — use [ SAVE PNG ] instead'
		}
	}

	function savePng() {
		if (!previewUrl) return
		const a = document.createElement('a')
		a.href = previewUrl
		a.download = shareCardFilename(share)
		a.click()
		flash('png', '[ SAVED ✓ ]')
	}

	async function nativeShare() {
		const text = buildSocialText(share)
		const files = blob
			? [new File([blob], shareCardFilename(share), { type: 'image/png' })]
			: undefined
		try {
			if (files && navigator.canShare?.({ files })) await navigator.share({ files, text })
			else await navigator.share({ text })
			hint = ''
		} catch (e) {
			if ((e as DOMException)?.name !== 'AbortError') hint = 'system share unavailable'
		}
	}

	// Mobile: native sheet with the PNG attached. Desktop: copy the PNG first
	// (the popup steals focus and a blurred document can't write the
	// clipboard), then open the network's composer with the text preloaded.
	async function postTo(network: Network) {
		const text = buildSocialText(share)

		if (blob) {
			const file = new File([blob], shareCardFilename(share), { type: 'image/png' })
			try {
				if (navigator.canShare?.({ files: [file] })) {
					await navigator.share({ files: [file], text })
					hint = ''
					return
				}
			} catch (e) {
				if ((e as DOMException)?.name === 'AbortError') return // sheet dismissed
			}
		}

		let imgCopied = false
		if (blob) {
			try {
				await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
				imgCopied = true
			} catch {
				// Composer still opens with the text.
			}
		}
		hint = imgCopied
			? '> card copied — paste it into your post (Ctrl+V)'
			: '> tip: [ SAVE PNG ] and attach the card to your post'
		window.open(composerUrl(network, text), '_blank', 'noopener')
	}
</script>

<div class="space-y-4 text-center">
	<!-- The card -->
	{#if previewUrl}
		<figure class="space-y-1.5">
			<img
				src={previewUrl}
				alt="Today's result as a shareable card"
				class="glow mx-auto w-full max-w-72 border border-edge-strong"
				style="--glow: {share.accent ?? '#4dff8f'}; border-radius: var(--radius-card)"
			/>
			<figcaption class="font-mono text-[10px] text-ink-faint">
				1080×1080 PNG · travels with your post
			</figcaption>
		</figure>
	{:else}
		<div
			class="mx-auto grid aspect-square w-full max-w-72 place-items-center border border-edge bg-inset font-mono text-xs text-ink-faint"
			style="border-radius: var(--radius-card)"
		>
			<span><span class="animate-blink">█</span> rendering card…</span>
		</div>
	{/if}

	<!-- Destinations -->
	<div class="space-y-2">
		<p class="text-left font-mono text-[11px] font-bold tracking-[0.2em] text-ink-faint uppercase">
			// transmit to
		</p>
		<div class="grid grid-cols-2 gap-2">
			{#each NETWORKS.slice(0, 2) as n (n.id)}
				<button
					type="button"
					onclick={() => postTo(n.id)}
					class="glow rounded-tile px-3 py-3 font-mono text-sm font-bold tracking-wider transition hover:brightness-115 active:translate-y-0.5
						{n.fill ? 'text-black' : 'glass text-ink hover:border-edge-strong'}"
					style="--glow: {n.color}; {n.fill ? `background: ${n.color}` : ''}"
				>
					[ {n.label} ]
				</button>
			{/each}
		</div>
		<div class="grid grid-cols-3 gap-2">
			{#each NETWORKS.slice(2) as n (n.id)}
				<button
					type="button"
					onclick={() => postTo(n.id)}
					class="glass px-2 py-2.5 font-mono text-[11px] font-bold tracking-wide transition hover:border-edge-strong active:translate-y-0.5"
					style="color: {n.color}; border-radius: var(--radius-tile)"
				>
					[ {n.label} ]
				</button>
			{/each}
		</div>
		{#if canNative}
			<button
				type="button"
				onclick={nativeShare}
				class="glass w-full px-3 py-2.5 font-mono text-xs font-bold tracking-wider text-ink-soft transition hover:border-edge-strong active:translate-y-0.5"
				style="border-radius: var(--radius-tile)"
			>
				[ SYSTEM SHARE ▲ ]
			</button>
		{/if}
	</div>

	<!-- Export -->
	<div class="space-y-2">
		<p class="text-left font-mono text-[11px] font-bold tracking-[0.2em] text-ink-faint uppercase">
			// export
		</p>
		<div class="grid grid-cols-3 gap-2">
			<button
				type="button"
				onclick={copyText}
				class="glass px-2 py-2.5 font-mono text-[11px] font-bold tracking-wide text-ink-soft transition hover:border-edge-strong active:translate-y-0.5"
				style="border-radius: var(--radius-tile)"
			>
				{exportLabels.text}
			</button>
			<button
				type="button"
				onclick={copyImage}
				disabled={!blob}
				class="glass px-2 py-2.5 font-mono text-[11px] font-bold tracking-wide text-ink-soft transition hover:border-edge-strong active:translate-y-0.5 disabled:opacity-40"
				style="border-radius: var(--radius-tile)"
			>
				{exportLabels.image}
			</button>
			<button
				type="button"
				onclick={savePng}
				disabled={!previewUrl}
				class="glass px-2 py-2.5 font-mono text-[11px] font-bold tracking-wide text-ink-soft transition hover:border-edge-strong active:translate-y-0.5 disabled:opacity-40"
				style="border-radius: var(--radius-tile)"
			>
				{exportLabels.png}
			</button>
		</div>
	</div>

	<p aria-live="polite" class="min-h-4 font-mono text-[11px] text-amber">{hint}</p>
</div>
