<script lang="ts">
	import KeyCap from './KeyCap.svelte';

	/**
	 * A map of classnames for all letters that have been guessed,
	 * used for styling the keyboard
	 */
	// let classnames: Record<string, 'exact' | 'close' | 'missing'>;

	// $: {
	// 	classnames = {};
	// }

	/**
	 * Modify the game state without making a trip to the server,
	 * if client-side JavaScript is enabled
	 */
	function update(event: MouseEvent) {
		const key = (event.target as HTMLButtonElement).getAttribute('data-key');

		if (key === 'backspace') {
		} else if (true) {
		}
	}

	/**
	 * Trigger form logic in response to a keydown event, so that
	 * desktop users can use the keyboard to play the game
	 */
	function keyDown(event: KeyboardEvent) {
		if (event.metaKey) return;

		document.querySelector(`[data-key="${event.key}" i]`)?.dispatchEvent(new MouseEvent('click', { cancelable: true }));
	}
	let keyBackspace = `\u232B`;
	let keyEnter = `\u23CE`;
</script>

<div class="keyboard">
	{#each ['`1234567890-=' + keyBackspace, 'QWERTYUIOP[]\\', "ASDFGHJKL;'" + keyEnter, 'ZXCVBNM,.'] as row, i}
		<div class="row flex flex-1 justify-center">
			{#each row as letter}
				<KeyCap {letter} />
			{/each}
		</div>
	{/each}
</div>

<!-- <style>
	@media (prefers-reduced-motion: no-preference) {
		.row.current {
			animation: wiggle 0.5s;
		}
	}

	@keyframes wiggle {
		0% {
			transform: translateX(0);
		}
		10% {
			transform: translateX(-2px);
		}
		30% {
			transform: translateX(4px);
		}
		50% {
			transform: translateX(-6px);
		}
		70% {
			transform: translateX(+4px);
		}
		90% {
			transform: translateX(-2px);
		}
		100% {
			transform: translateX(0);
		}
	}
</style> -->
