<script lang="ts">
	import {
		buildShareText,
		buildSocialText,
		copyToClipboard,
		linkedInComposeUrl,
		xComposeUrl,
		type ShareInput
	} from '$lib/share'
	import { renderShareCard, shareCardFilename } from '$lib/sharecard'

	/**
	 * Modal share sheet: shows the rendered result card front and center,
	 * then lets the player pick a destination. The card PNG travels via the
	 * native share sheet (mobile) or the clipboard (desktop composers).
	 */
	let { share }: { share: ShareInput } = $props()

	let blob = $state<Blob | null>(null)
	let previewUrl = $state('')
	let hint = $state('')
	let copyLabel = $state('[ COPY TEXT ]')
	let saveLabel = $state('[ SAVE IMAGE ]')
	let timer: ReturnType<typeof setTimeout>

	$effect(() => {
		let stale = false
		renderShareCard(share)
			.then((b) => {
				if (stale) return
				blob = b
				previewUrl = URL.createObjectURL(b)
			})
			.catch(() => {
				// No card preview — text sharing still works.
			})
		return () => {
			stale = true
			if (previewUrl) URL.revokeObjectURL(previewUrl)
			clearTimeout(timer)
		}
	})

	function flash(set: (v: string) => void, value: string, reset: string) {
		set(value)
		clearTimeout(timer)
		timer = setTimeout(() => {
			copyLabel = '[ COPY TEXT ]'
			saveLabel = '[ SAVE IMAGE ]'
			void reset
		}, 2000)
	}

	async function copyText() {
		const ok = await copyToClipboard(buildShareText(share))
		flash((v) => (copyLabel = v), ok ? '[ COPIED ✓ ]' : '[ FAILED ]', '[ COPY TEXT ]')
	}

	async function saveImage() {
		if (!blob) return
		try {
			await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
			flash((v) => (saveLabel = v), '[ IMG COPIED ✓ ]', '[ SAVE IMAGE ]')
			return
		} catch {
			// Clipboard unavailable — download instead.
		}
		const a = document.createElement('a')
		a.href = previewUrl
		a.download = shareCardFilename(share)
		a.click()
		flash((v) => (saveLabel = v), '[ SAVED ✓ ]', '[ SAVE IMAGE ]')
	}

	/**
	 * Share to a network with the card attached. Mobile: native sheet with
	 * the PNG + text together. Desktop: copy the PNG, then open the web
	 * composer with the text preloaded (copy first — the popup steals focus,
	 * and a blurred document can't write to the clipboard).
	 */
	async function postTo(network: 'linkedin' | 'x') {
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
			? 'card copied to clipboard — paste it into your post (Ctrl+V)'
			: 'tip: use [ SAVE IMAGE ] and attach the card to your post'
		window.open(
			network === 'linkedin' ? linkedInComposeUrl(text) : xComposeUrl(text),
			'_blank',
			'noopener'
		)
	}
</script>

<div class="space-y-3 text-center">
	{#if previewUrl}
		<img
			src={previewUrl}
			alt="Today's result as a shareable card"
			class="glow mx-auto w-full max-w-65 border border-edge-strong"
			style="--glow: {share.accent ?? '#4dff8f'}; border-radius: var(--radius-card)"
		/>
	{:else}
		<div
			class="mx-auto grid aspect-square w-full max-w-65 place-items-center border border-edge bg-inset font-mono text-xs text-ink-faint"
			style="border-radius: var(--radius-card)"
		>
			rendering card…
		</div>
	{/if}

	<p class="font-mono text-[11px] font-bold tracking-[0.2em] text-ink-faint uppercase">
		// post to
	</p>
	<div class="grid grid-cols-2 gap-2">
		<button
			type="button"
			onclick={() => postTo('linkedin')}
			class="glow rounded-tile bg-phish-deep px-3 py-3 font-mono text-sm font-bold tracking-wider text-white transition hover:brightness-115 active:translate-y-0.5"
			style="--glow: #2fe6c0"
		>
			[ LINKEDIN ]
		</button>
		<button
			type="button"
			onclick={() => postTo('x')}
			class="glass px-3 py-3 font-mono text-sm font-bold tracking-wider text-ink transition hover:border-edge-strong active:translate-y-0.5"
			style="border-radius: var(--radius-tile)"
		>
			[ X / TWITTER ]
		</button>
	</div>
	<div class="grid grid-cols-2 gap-2">
		<button
			type="button"
			onclick={copyText}
			class="glass px-3 py-2.5 font-mono text-xs font-bold tracking-wider text-ink-soft transition hover:border-edge-strong active:translate-y-0.5"
			style="border-radius: var(--radius-tile)"
		>
			{copyLabel}
		</button>
		<button
			type="button"
			onclick={saveImage}
			class="glass px-3 py-2.5 font-mono text-xs font-bold tracking-wider text-ink-soft transition hover:border-edge-strong active:translate-y-0.5"
			style="border-radius: var(--radius-tile)"
		>
			{saveLabel}
		</button>
	</div>
	<p aria-live="polite" class="min-h-4 font-mono text-[11px] text-amber">{hint}</p>
</div>
