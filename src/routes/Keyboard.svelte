<!-- 
	Initial Layouts from these two sites:
	https://paulguerin.medium.com/the-search-for-the-worlds-best-keyboard-layout-98d61b33b8e1
	https://colemakmods.github.io/mod-dh/keyboards.html
 -->
<script lang="ts">
	import KeyCap from './KeyCap.svelte';
	import { myStore } from '$lib/store/data';
	import { keyboards, getKeyCaps, KeyboardSettings, KeyboardIndex, KeyboardNames, LayoutIndex, LayoutNames } from '$lib/store/keyboard';

	const { settings } = myStore;

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

	let isLargeKey = true;
	$: keyCaps = getKeyCaps($settings.keyboard, $settings.layout);
</script>

<div class="flex flex-col justify-center relative overflow-hidden p-5">
	<div class="mx-auto">
		{#each keyCaps as row, i}
			<div class="row flex {keyboards[$settings.keyboard].justify}">
				{#if keyboards[$settings.keyboard].leftKeys[i] != ''}
					<KeyCap letter={keyboards[$settings.keyboard].leftKeys[i]} {isLargeKey} />
				{/if}
				{#each row as letter, i}
					<KeyCap {letter} />
				{/each}
				{#if keyboards[$settings.keyboard].rightKeys[i] != ''}
					<KeyCap letter={keyboards[$settings.keyboard].rightKeys[i]} {isLargeKey} />
				{/if}
			</div>
		{/each}
	</div>
</div>
