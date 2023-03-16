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
	let isLargeKey = true;
</script>

<div class="flex flex-col justify-center relative overflow-hidden p-5">
	<div class="mx-auto">
		{#each ['`1234567890-=', 'QWERTYUIOP[]\\', "ASDFGHJKL;'", 'ZXCVBNM,.'] as row, i}
			<div class="row flex justify-center">
				{#each row as letter, i}
					<KeyCap {letter} />
				{/each}
				{#if i == 0}
					<KeyCap letter={keyBackspace} {isLargeKey} />
				{:else if i == 2}
					<KeyCap letter={keyEnter} {isLargeKey} />
				{/if}
			</div>
		{/each}
	</div>
</div>
