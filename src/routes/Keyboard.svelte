<!-- 
	Initial Layouts from these two sites:
	https://paulguerin.medium.com/the-search-for-the-worlds-best-keyboard-layout-98d61b33b8e1
	https://colemakmods.github.io/mod-dh/keyboards.html
 -->
<script lang="ts">
	import KeyCap from "./KeyCap.svelte";
	import { fingerAssignments, FingerIndex, getKeyboard, getKeyCaps } from "$lib/store/keyboard";
	import type { ColorIndex } from "$lib/store/Colors.svelte";
	import { settingsState } from "$lib/store/SettingsState.svelte";

	type Props = {
		colorIndex: ColorIndex;
		font: string;
	};
	let { colorIndex, font }: Props = $props();

	// svelte-ignore non_reactive_update
	let isLargeKey = true;
	let keyCaps = $derived(getKeyCaps(settingsState.keyboard, settingsState.layout));
	/** Get finger assignments for current keyboard type */
	let currentFingerAssignments: FingerIndex[][] = $derived(fingerAssignments[settingsState.keyboard]);

	/** Check if a letter should be highlighted (next key to type) */
	function isHighlighted(letter: string): boolean {
		if (!settingsState.nextChar) return false;
		return letter.toUpperCase() === settingsState.nextChar.toUpperCase();
	}

	let theKeyboard = $derived(getKeyboard(settingsState.keyboard, settingsState.layout));
</script>

<div class="relative flex flex-col justify-center overflow-hidden p-5">
	<div class="mx-auto">
		{#each keyCaps as row, rowIndex (row)}
			<div class="row flex {theKeyboard?.justify}">
				{#if theKeyboard?.leftKeys[rowIndex] != ""}
					<KeyCap
						letter={theKeyboard.leftKeys[rowIndex]}
						bind:colorIndex
						bind:font
						bind:isLargeKey
						bind:showFingerColor={settingsState.showFingerColors}
					/>
				{/if}
				{#each row as letter, colIndex (letter + colIndex)}
					<KeyCap
						{letter}
						bind:colorIndex
						bind:font
						fingerIndex={currentFingerAssignments[rowIndex][colIndex]}
						bind:showFingerColor={settingsState.showFingerColors}
						isHighlighted={isHighlighted(letter)}
					/>
				{/each}
				{#if theKeyboard.rightKeys[rowIndex] != ""}
					<KeyCap
						letter={theKeyboard.rightKeys[rowIndex]}
						{colorIndex}
						{font}
						{isLargeKey}
						showFingerColor={settingsState.showFingerColors}
					/>
				{/if}
			</div>
		{/each}
	</div>
</div>
