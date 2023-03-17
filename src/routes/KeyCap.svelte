<script lang="ts">
	import { myStore } from '$lib/store/data';
	const { settings } = myStore;

	export let letter = 'a';
	export let isLargeKey = false;
	let glowColors = [
		'bg-red-300 dark:bg-red-900',
		'bg-orange-300 dark:bg-orange-900',
		'bg-amber-300 dark:bg-amber-900',
		'bg-yellow-300 dark:bg-yellow-900',
		'bg-lime-300 dark:bg-lime-900',
		'bg-green-300 dark:bg-green-900',
		'bg-emerald-300 dark:bg-emerald-900',
		'bg-teal-300 dark:bg-teal-900',
		'bg-cyan-300 dark:bg-cyan-900',
		'bg-sky-300 dark:bg-sky-900',
		'bg-blue-300 dark:bg-blue-900',
		'bg-indigo-300 dark:bg-indigo-900',
		'bg-violet-300 dark:bg-violet-900',
		'bg-purple-300 dark:bg-purple-900',
		'bg-fuchsia-300 dark:bg-fuchsia-900',
		'bg-pink-300 dark:bg-pink-900',
		'bg-rose-300 dark:bg-rose-900',
		'bg-slate-300 dark:bg-slate-900',
		'bg-gray-300 dark:bg-gray-900',
		'bg-zinc-300 dark:bg-zinc-900',
		'bg-neutral-300 dark:bg-neutral-900',
		'bg-stone-300 dark:bg-stone-900',
	];
	let keyColors = [
		'bg-red-100 dark:bg-red-900',
		'bg-orange-100 dark:bg-orange-900',
		'bg-amber-100 dark:bg-amber-900',
		'bg-yellow-100 dark:bg-yellow-900',
		'bg-lime-100 dark:bg-lime-900',
		'bg-green-100 dark:bg-green-900',
		'bg-emerald-100 dark:bg-emerald-900',
		'bg-teal-100 dark:bg-teal-900',
		'bg-cyan-100 dark:bg-cyan-900',
		'bg-sky-100 dark:bg-sky-900',
		'bg-blue-100 dark:bg-blue-900',
		'bg-indigo-100 dark:bg-indigo-900',
		'bg-violet-100 dark:bg-violet-900',
		'bg-purple-100 dark:bg-purple-900',
		'bg-fuchsia-100 dark:bg-fuchsia-900',
		'bg-pink-100 dark:bg-pink-900',
		'bg-rose-100 dark:bg-rose-900',
		'bg-slate-100 dark:bg-slate-900',
		'bg-gray-100 dark:bg-gray-900',
		'bg-zinc-100 dark:bg-zinc-900',
		'bg-neutral-100 dark:bg-neutral-900',
		'bg-stone-100 dark:bg-stone-900',
	];
	$: glowCSS = 'absolute -inset-1 ' + glowColors[$settings.color] + ' rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-700 group-hover:duration-200 ';
	$: keyCSS = keyColors[$settings.color] + ' rounded-md text-black dark:text-white w-[min(8vw,4vh,40px)] h-[min(8vw,4vh,40px)] ';
	$: keyLargeCSS = keyColors[$settings.color] + ' rounded-md text-black dark:text-white w-[min(12vw,6vh,60px)] h-[min(8vw,4vh,40px)] ';

	let spam = letter;
</script>

{#if isLargeKey}
	<div class="relative group">
		<div class={glowCSS} />
		<div class="relative p-0 m-1 bg-white ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-1">
			<div>
				<button class={keyLargeCSS} data-key={letter} name="key" value={letter} aria-label={letter}>
					<span class={$settings.font}>{spam}</span>
				</button>
			</div>
		</div>
	</div>
{:else}
	<div class="relative group">
		<div class={glowCSS} />
		<div class="relative p-0 m-1 bg-white ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-1">
			<div>
				<button class={keyCSS} data-key={letter} name="key" value={letter} aria-label={letter}>
					<span class={$settings.font}>{spam}</span>
				</button>
			</div>
		</div>
	</div>
{/if}
