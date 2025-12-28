<!-- 
	Initial Layouts from these two sites:
	https://paulguerin.medium.com/the-search-for-the-worlds-best-keyboard-layout-98d61b33b8e1
	https://colemakmods.github.io/mod-dh/keyboards.html
 -->
<script lang="ts">
	import KeyCap from "./KeyCap.svelte";
	import { fingerAssignments, FingerIndex, getKeyboard, getKeyCaps, KeyboardIndex } from "$lib/store/keyboard";
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

	const ansiSizesLeft: number[] = [0, 0, 1, 3];
	const ansiSizesRight: number[] = [0, 0, 2, 3];
	const isoSizesLeft: number[] = [0, 0, 2, 0];
	const isoSizesRight: number[] = [3, 2, 0, 4];
	const sizesLeft = $derived(settingsState.keyboard === KeyboardIndex.ansi ? ansiSizesLeft : isoSizesLeft);
	const sizesRight = $derived(settingsState.keyboard === KeyboardIndex.ansi ? ansiSizesRight : isoSizesRight);

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
						size={sizesLeft[rowIndex]}
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
						size={sizesRight[rowIndex]}
						showFingerColor={settingsState.showFingerColors}
					/>
				{/if}
			</div>
		{/each}
	</div>
</div>
