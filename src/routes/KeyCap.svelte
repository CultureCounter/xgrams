<script lang="ts">
	import { myStore } from '$lib/store/data';
	const { settings } = myStore;

	export let letter = 'a';
	export let isLargeKey = false;

	let lightCSS = 'bg-primary-400 text-black ';
	let darkCSS = 'dark:bg-primary-900 dark:text-white ';
	let glowCSS = 'absolute -inset-0.5 bg-gradient-to-b from-green-900 to-teal-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-500 group-hover:duration-200 ';
	let buttonCSS = 'relative px-7 py-4 rounded-lg leading-none flex items-center divide-x divide-gray-600 ';
	let baseCSS = 'm-1 ' + lightCSS + darkCSS + buttonCSS; //b-5 border-white ring-offset-purple-100/50 ring-offset-8
	let keyCSS = baseCSS; // + 'w-[min(8vw,4vh,40px)] h-[min(8vw,4vh,40px)]';
	let keyLargeCSS = baseCSS + 'w-[min(12vw,6vh,60px)] h-[min(8vw,4vh,40px)]';

	let spam = letter;
</script>

<!-- 
 on:click|preventDefault={update}
  {description[letter] || ''}
  -->

<div class="relative group">
	<div class={glowCSS} />
	{#if isLargeKey}
		<button class={keyLargeCSS} data-key={letter} name="key" value={letter} aria-label={letter}>
			<span class={$settings.font}>{spam}</span>
		</button>
	{:else}
		<button class={keyCSS} data-key={letter} name="key" value={letter} aria-label={letter}>
			<span class={$settings.font}>{spam}</span>
		</button>
	{/if}
</div>
