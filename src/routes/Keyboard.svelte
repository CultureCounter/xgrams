<!-- 
	Initial Layouts from these two sites:
	https://paulguerin.medium.com/the-search-for-the-worlds-best-keyboard-layout-98d61b33b8e1
	https://colemakmods.github.io/mod-dh/keyboards.html
 -->
<script lang="ts">
	import KeyCap from "./KeyCap.svelte";
	import { keyboards, getKeyCaps } from "$lib/store/keyboard";
	import { idbSettings } from "$lib/store/SettingsXG.svelte";

	let isLargeKey = true;
	let keyCaps = $derived(getKeyCaps(idbSettings.keyboard, idbSettings.layout));
</script>

<div class="relative flex flex-col justify-center overflow-hidden p-5">
	<div class="mx-auto">
		{#each keyCaps as row, i (row)}
			<div class="row flex {keyboards[idbSettings.keyboard].justify}">
				{#if keyboards[idbSettings.keyboard].leftKeys[i] != ""}
					<KeyCap letter={keyboards[idbSettings.keyboard].leftKeys[i]} {isLargeKey} />
				{/if}
				{#each row as letter (letter)}
					<KeyCap {letter} />
				{/each}
				{#if keyboards[idbSettings.keyboard].rightKeys[i] != ""}
					<KeyCap letter={keyboards[idbSettings.keyboard].rightKeys[i]} {isLargeKey} />
				{/if}
			</div>
		{/each}
	</div>
</div>
