<!-- 
	Initial Layouts from these two sites:
	https://paulguerin.medium.com/the-search-for-the-worlds-best-keyboard-layout-98d61b33b8e1
	https://colemakmods.github.io/mod-dh/keyboards.html
 -->
<script lang="ts">
	import KeyCap from "./KeyCap.svelte";
	import { fingerAssignments, FingerIndex, getKeyboard, getKeyCaps } from "$lib/store/keyboard";
	import { settingsState } from "$lib/store/SettingsState.svelte";

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
						{isLargeKey}
						showFingerColor={settingsState.showFingerColors}
					/>
				{/if}
				{#each row as letter, colIndex (letter + colIndex)}
					<KeyCap
						{letter}
						fingerIndex={currentFingerAssignments[rowIndex][colIndex]}
						showFingerColor={settingsState.showFingerColors}
						isHighlighted={isHighlighted(letter)}
					/>
				{/each}
				{#if theKeyboard.rightKeys[rowIndex] != ""}
					<KeyCap
						letter={theKeyboard.rightKeys[rowIndex]}
						{isLargeKey}
						showFingerColor={settingsState.showFingerColors}
					/>
				{/if}
			</div>
		{/each}
	</div>
</div>
