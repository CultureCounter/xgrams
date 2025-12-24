<!-- 
	Initial Layouts from these two sites:
	https://paulguerin.medium.com/the-search-for-the-worlds-best-keyboard-layout-98d61b33b8e1
	https://colemakmods.github.io/mod-dh/keyboards.html
 -->
<script lang="ts">
	import KeyCap from "./KeyCap.svelte";
	import { keyboards, getKeyCaps, fingerAssignments, FingerIndex } from "$lib/store/keyboard";
	import type { ColorIndex } from "$lib/store/Colors.svelte";
	import { keyboardState } from "$lib/store/KeyboardState.svelte";

	type Props = {
		colorIndex: ColorIndex;
		font: string;
	};
	let { colorIndex, font }: Props = $props();

	// svelte-ignore non_reactive_update
	let isLargeKey = true;
	let keyCaps = $derived(getKeyCaps(keyboardState.keyboard, keyboardState.layout));

	/** Get finger assignments for current keyboard type */
	let currentFingerAssignments: FingerIndex[][] = $derived(fingerAssignments[keyboardState.keyboard]);

	/** Check if a letter should be highlighted (next key to type) */
	function isHighlighted(letter: string): boolean {
		if (!keyboardState.nextChar) return false;
		return letter.toUpperCase() === keyboardState.nextChar.toUpperCase();
	}

	let theKeyboard = $derived(keyboards[keyboardState.keyboard]);
</script>

<div class="relative flex flex-col justify-center overflow-hidden p-5">
	<div class="mx-auto">
		{#each keyCaps as row, rowIndex (row)}
			<div class="row flex {keyboards[keyboardState.keyboard].justify}">
				{#if keyboards[keyboardState.keyboard].leftKeys[rowIndex] != ""}
					<KeyCap
						letter={theKeyboard.leftKeys[rowIndex]}
						bind:colorIndex
						bind:font
						bind:isLargeKey
						bind:showFingerColor={keyboardState.showFingerColors}
					/>
				{/if}
				{#each row as letter, colIndex (letter + colIndex)}
					<KeyCap
						{letter}
						bind:colorIndex
						bind:font
						fingerIndex={currentFingerAssignments[rowIndex][colIndex]}
						bind:showFingerColor={keyboardState.showFingerColors}
						isHighlighted={isHighlighted(letter)}
					/>
				{/each}
				{#if keyboards[keyboardState.keyboard].rightKeys[rowIndex] != ""}
					<KeyCap
						letter={theKeyboard.rightKeys[rowIndex]}
						{colorIndex}
						{font}
						{isLargeKey}
						showFingerColor={keyboardState.showFingerColors}
					/>
				{/if}
			</div>
		{/each}
	</div>
</div>
