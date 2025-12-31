<!-- 
	Initial Layouts from these two sites:
	https://paulguerin.medium.com/the-search-for-the-worlds-best-keyboard-layout-98d61b33b8e1
	https://colemakmods.github.io/mod-dh/keyboards.html
 -->
<script lang="ts">
	import KeyCap from "./KeyCap.svelte";
	import { fingerAssignments, FingerIndex, getKeyboard, getKeyCaps, KeyboardIndex } from "$lib/store/keyboard";
	import { settingsState } from "$lib/store/SettingsState.svelte";

	let isFatKey = true;
	let keyCaps = $derived(getKeyCaps(settingsState.keyboard, settingsState.layout));
	/** Get finger assignments for current keyboard type */
	let currentFingerAssignments: FingerIndex[][] = $derived(fingerAssignments[settingsState.keyboard]);

	/** Check if a letter should be highlighted (next key to type) */
	function isHighlighted(letter: string): boolean {
		if (!settingsState.nextChar) return false;
		return letter.toUpperCase() === settingsState.nextChar.toUpperCase();
	}

	const matrixFatKeys: boolean[][] = [
		[false, false],
		[false, false],
		[false, false],
		[false, false],
		[false, false],
	];
	const ansiFatKeys: boolean[][] = [
		[false, true],
		[true, false],
		[true, true],
		[true, true],
		[true, true],
	];
	const isoFatKeys: boolean[][] = [
		[false, true],
		[true, true],
		[true, true],
		[true, true],
		[true, true],
	];
	function getFatKeys(keyboard: KeyboardIndex): boolean[][] {
		if (keyboard === KeyboardIndex.matrix) {
			return matrixFatKeys;
		} else if (keyboard === KeyboardIndex.ansi) {
			return ansiFatKeys;
		} else if (keyboard === KeyboardIndex.iso) {
			return isoFatKeys;
		}
		return matrixFatKeys;
	}

	const ansiSizesLeft: number[] = [0, 0, 1, 3, 2];
	const ansiSizesRight: number[] = [0, 0, 2, 3, 2];
	const isoSizesLeft: number[] = [0, 0, 2, 0, 2];
	const isoSizesRight: number[] = [3, 2, 0, 4, 2];
	const spaceSizes: number[] = [2, 2, 2, 5, 2, 2, 2];
	const sizesLeft = $derived(settingsState.keyboard === KeyboardIndex.ansi ? ansiSizesLeft : isoSizesLeft);
	const sizesRight = $derived(settingsState.keyboard === KeyboardIndex.ansi ? ansiSizesRight : isoSizesRight);

	let theKeyboard = $derived(getKeyboard(settingsState.keyboard, settingsState.layout));
	let fatKeys = $derived(getFatKeys(settingsState.keyboard));
	let isSpaceRow = $derived(settingsState.keyboard !== KeyboardIndex.matrix);
</script>

<div class="relative flex flex-col justify-center overflow-hidden p-5">
	<div class="mx-auto">
		{#each keyCaps as row, rowIndex (row)}
			<div class="row flex {theKeyboard?.justify}">
				{#each row as letter, colIndex (rowIndex * 300 + colIndex)}
					{#if isSpaceRow && rowIndex === 4}
						<KeyCap
							{letter}
							{isFatKey}
							size={spaceSizes[colIndex]!}
							showFingerColor={settingsState.showFingerColors}
						/>
					{:else if colIndex === 0 && fatKeys[rowIndex]![0]}
						<KeyCap
							{letter}
							{isFatKey}
							size={sizesLeft[rowIndex]!}
							showFingerColor={settingsState.showFingerColors}
						/>
					{:else if colIndex === row.length - 1 && fatKeys[rowIndex]![1]}
						<KeyCap
							{letter}
							{isFatKey}
							size={sizesRight[rowIndex]!}
							showFingerColor={settingsState.showFingerColors}
						/>
					{:else}
						<KeyCap
							{letter}
							fingerIndex={currentFingerAssignments[rowIndex]![colIndex]!}
							showFingerColor={settingsState.showFingerColors}
							isHighlighted={isHighlighted(letter)}
						/>
					{/if}
				{/each}
			</div>
		{/each}
	</div>
</div>
