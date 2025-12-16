<script lang="ts">
	import { ColorIndex } from "$lib/store/Colors.svelte";
	import { GlowColors, KeyColors } from "$lib/store/Colors.svelte";

	type Props = {
		letter: string;
		colorIndex: ColorIndex;
		font: string;
		isLargeKey?: boolean;
	};
	let { letter, colorIndex, font, isLargeKey = false }: Props = $props();

	let glowCSS = $derived(
		"absolute -inset-1 "
			+ GlowColors[colorIndex]
			+ " rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-700 group-hover:duration-200 "
	);
	let keyCSS = $derived(
		KeyColors[colorIndex] + " rounded-md text-black dark:text-white w-[min(8vw,4vh,40px)] h-[min(8vw,4vh,40px)] "
	);
	let keyLargeCSS = $derived(
		KeyColors[colorIndex] + " rounded-md text-black dark:text-white w-[min(12vw,6vh,60px)] h-[min(8vw,4vh,40px)] "
	);
</script>

{#if isLargeKey}
	<div class="group relative">
		<div class={glowCSS}></div>
		<div
			class="items-top relative m-1 flex justify-start space-x-1 rounded-lg bg-white p-0 leading-none ring-1 ring-gray-900/5"
		>
			<div>
				<button class={keyLargeCSS} data-key={letter} name="key" value={letter} aria-label={letter}>
					<span class={font}>{letter}</span>
				</button>
			</div>
		</div>
	</div>
{:else}
	<div class="group relative">
		<div class={glowCSS}></div>
		<div
			class="items-top relative m-1 flex justify-start space-x-1 rounded-lg bg-white p-0 leading-none ring-1 ring-gray-900/5"
		>
			<div>
				<button class={keyCSS} data-key={letter} name="key" value={letter} aria-label={letter}>
					<span class={font}>{letter}</span>
				</button>
			</div>
		</div>
	</div>
{/if}
