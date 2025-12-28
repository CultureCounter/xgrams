<script lang="ts">
	import { getNextFingerColor } from "$lib/store/Colors.svelte";
	import { GlowColors, KeyColors, FingerColors } from "$lib/store/Colors.svelte";
	import type { FingerIndex } from "$lib/store/keyboard";
	import { settingsState } from "$lib/store/SettingsState.svelte";

	type Props = {
		letter: string;
		isLargeKey?: boolean;
		size?: number;
		fingerIndex?: FingerIndex;
		showFingerColor?: boolean;
		isHighlighted?: boolean;
	};
	let {
		letter = $bindable<string>(),
		isLargeKey = $bindable<boolean>(),
		size = $bindable<number>(),
		fingerIndex = $bindable<FingerIndex>(),
		showFingerColor = $bindable<boolean>(),
		isHighlighted = $bindable<boolean>(),
	}: Props = $props();

	let glowCSS = $derived(
		"absolute -inset-1 "
			+ GlowColors[settingsState.colorIndex]
			+ " rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-700 group-hover:duration-200 "
	);

	// Determine key background color: finger color or default
	let keyBgColor = $derived(
		showFingerColor && fingerIndex !== undefined ? FingerColors[fingerIndex] : KeyColors[settingsState.colorIndex]
	);

	// Add highlight ring if this is the next key to type
	// let highlightCSS = $derived(isHighlighted ? " ring-4 ring-red-800 dark:ring-red-200 animate-pulse" : "");
	let highlightCSS = $derived(isHighlighted ? getNextFingerColor(fingerIndex) : "");

	let keyBaseCSS = $derived(
		keyBgColor + " " + highlightCSS + " rounded-md text-black dark:text-white h-[min(8vw,4vh,40px)]"
	);
	let keyCSS = $derived(keyBaseCSS + " w-[min(8vw,4vh,40px)]");
	let largeWidths: string[] = [
		" w-[min(12vw,6vh,60px)]",
		" w-[min(14vw,7vh,70px)]",
		" w-[min(16vw,8vh,80px)]",
		" w-[min(20vw,10vh,100px)]",
		" w-[min(26vw,13vh,130px)]",
	];
	let keyLargeCSS = $derived(!isLargeKey ? "" : keyBaseCSS + largeWidths[size]);
</script>

{#if isLargeKey}
	<div class="group relative">
		<div class={glowCSS}></div>
		<div
			class="items-top relative m-1 flex justify-start space-x-1 rounded-lg p-0 leading-none ring-1 ring-gray-900/5"
		>
			<div>
				<button
					class={keyLargeCSS}
					data-key={letter}
					name="key"
					value={letter}
					aria-label={letter}
					disabled={true}
					tabindex="-1"
				>
					<span class={settingsState.font}>{letter}</span>
				</button>
			</div>
		</div>
	</div>
{:else}
	<div class="group relative">
		<div class={glowCSS}></div>
		<div
			class="items-top relative m-1 flex justify-start space-x-1 rounded-lg p-0 leading-none ring-1 ring-gray-900/5"
		>
			<div>
				<button
					class={keyCSS}
					data-key={letter}
					name="key"
					value={letter}
					aria-label={letter}
					disabled={true}
					tabindex="-1"
				>
					<span class={settingsState.font}>{letter}</span>
				</button>
			</div>
		</div>
	</div>
{/if}
