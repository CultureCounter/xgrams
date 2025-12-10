<!-- 
	Initial Layouts from these two sites:
	https://paulguerin.medium.com/the-search-for-the-worlds-best-keyboard-layout-98d61b33b8e1
	https://colemakmods.github.io/mod-dh/keyboards.html
 -->
<script lang="ts">
	import KeyCap from "./KeyCap.svelte";
	import { keyboards, getKeyCaps, KeyboardIndex, LayoutIndex } from "$lib/store/keyboard";
	import { SettingsXG } from "$lib/store/SettingsXG.svelte";
	import { LoadIndex } from "$lib/store/loadState.svelte";

	let { idbSettings = $bindable(), idbSettingsLoadState } = $props();

	let isLargeKey = true;
	// console.log("Keyboard.svelte rendered", $state.snapshot(idbSettings));
	let keyCaps = $state(
		getKeyCaps(idbSettings?.keyboard ?? KeyboardIndex.matrix, idbSettings?.layout ?? LayoutIndex.colemakDH)
	);

	function isFinishedLoading(settings: SettingsXG): boolean {
		let finishedLoading =
			idbSettings != undefined && idbSettingsLoadState.state == LoadIndex.loaded && settings !== undefined;

		if (finishedLoading) {
			console.assert(settings != undefined, "Settings should be defined when finished loading");
			keyCaps = getKeyCaps(settings.keyboard, settings.layout);
		}
		return finishedLoading;
	}
	let finishedLoading = $state(isFinishedLoading(idbSettings));
</script>

<div class="relative flex flex-col justify-center overflow-hidden p-5">
	<div class="mx-auto">
		<svelte:boundary>
			{#if finishedLoading}
				{#each keyCaps as row, i (row)}
					<div class="row flex {keyboards[idbSettings.keyboard].justify}">
						{#if keyboards[idbSettings.keyboard].leftKeys[i] != ""}
							<KeyCap
								letter={keyboards[idbSettings.keyboard].leftKeys[i]}
								{isLargeKey}
								color={idbSettings.color}
								font={idbSettings.font}
							/>
						{/if}
						{#each row as letter (letter)}
							<KeyCap {letter} color={idbSettings.color} font={idbSettings.font} />
						{/each}
						{#if keyboards[idbSettings.keyboard].rightKeys[i] != ""}
							<KeyCap
								letter={keyboards[idbSettings.keyboard].rightKeys[i]}
								{isLargeKey}
								color={idbSettings.color}
								font={idbSettings.font}
							/>
						{/if}
					</div>
				{/each}
			{/if}
		</svelte:boundary>
	</div>
</div>
