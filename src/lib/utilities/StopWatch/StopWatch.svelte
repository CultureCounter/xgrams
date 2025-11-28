<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import {
		elapsedTime,
		destroyStopWatch,
		resetStopWatch,
		toggleStopWatch,
		lapTime,
	} from "./stopwatch";
	import { ColorNames, myStore } from "$lib/store/data";
	const { settings } = myStore;

	let hourStrokeColors = [
		"stroke-red-900 dark:stroke-red-400",
		"stroke-orange-900 dark:stroke-orange-400",
		"stroke-amber-900 dark:stroke-amber-400",
		"stroke-yellow-900 dark:stroke-yellow-400",
		"stroke-lime-900 dark:stroke-lime-400",
		"stroke-green-900 dark:stroke-green-400",
		"stroke-emerald-900 dark:stroke-emerald-400",
		"stroke-teal-900 dark:stroke-teal-400",
		"stroke-cyan-900 dark:stroke-cyan-400",
		"stroke-sky-900 dark:stroke-sky-400",
		"stroke-blue-900 dark:stroke-blue-400",
		"stroke-indigo-900 dark:stroke-indigo-400",
		"stroke-violet-900 dark:stroke-violet-400",
		"stroke-purple-900 dark:stroke-purple-400",
		"stroke-fuchsia-900 dark:stroke-fuchsia-400",
		"stroke-pink-900 dark:stroke-pink-400",
		"stroke-rose-900 dark:stroke-rose-400",
		"stroke-slate-900 dark:stroke-slate-400",
		"stroke-gray-900 dark:stroke-gray-400",
		"stroke-zinc-900 dark:stroke-zinc-400",
		"stroke-neutral-900 dark:stroke-neutral-400",
		"stroke-stone-900 dark:stroke-stone-400",
	];
	let hourFillColors = [
		"fill-red-100/90 dark:fill-red-900/20",
		"fill-orange-100/90 dark:fill-orange-900/20",
		"fill-amber-100/90 dark:fill-amber-900/20",
		"fill-yellow-100/90 dark:fill-yellow-900/20",
		"fill-lime-100/90 dark:fill-lime-900/20",
		"fill-green-100/90 dark:fill-green-900/20",
		"fill-emerald-100/90 dark:fill-emerald-900/20",
		"fill-teal-100/90 dark:fill-teal-900/20",
		"fill-cyan-100/90 dark:fill-cyan-900/20",
		"fill-sky-100/90 dark:fill-sky-900/20",
		"fill-blue-100/90 dark:fill-blue-900/20",
		"fill-indigo-100/90 dark:fill-indigo-900/20",
		"fill-violet-100/90 dark:fill-violet-900/20",
		"fill-purple-100/90 dark:fill-purple-900/20",
		"fill-fuchsia-100/90 dark:fill-fuchsia-900/20",
		"fill-pink-100/90 dark:fill-pink-900/20",
		"fill-rose-100/90 dark:fill-rose-900/20",
		"fill-slate-100/90 dark:fill-slate-900/20",
		"fill-gray-100/90 dark:fill-gray-900/20",
		"fill-zinc-100/90 dark:fill-zinc-900/20",
		"fill-neutral-100/90 dark:fill-neutral-900/20",
		"fill-stone-100/90 dark:fill-stone-900/20",
	];
	let minuteStrokeColors = [
		"stroke-red-600 dark:stroke-red-600",
		"stroke-orange-600 dark:stroke-orange-600",
		"stroke-amber-600 dark:stroke-amber-600",
		"stroke-yellow-600 dark:stroke-yellow-600",
		"stroke-lime-600 dark:stroke-lime-600",
		"stroke-green-600 dark:stroke-green-600",
		"stroke-emerald-600 dark:stroke-emerald-600",
		"stroke-teal-600 dark:stroke-teal-600",
		"stroke-cyan-600 dark:stroke-cyan-600",
		"stroke-sky-600 dark:stroke-sky-600",
		"stroke-blue-600 dark:stroke-blue-600",
		"stroke-indigo-600 dark:stroke-indigo-600",
		"stroke-violet-600 dark:stroke-violet-600",
		"stroke-purple-600 dark:stroke-purple-600",
		"stroke-fuchsia-600 dark:stroke-fuchsia-600",
		"stroke-pink-600 dark:stroke-pink-600",
		"stroke-rose-600 dark:stroke-rose-600",
		"stroke-slate-600 dark:stroke-slate-600",
		"stroke-gray-600 dark:stroke-gray-600",
		"stroke-zinc-600 dark:stroke-zinc-600",
		"stroke-neutral-600 dark:stroke-neutral-600",
		"stroke-stone-600 dark:stroke-stone-600",
	];
	let minuteFillColors = [
		"fill-red-600/30 dark:fill-red-600/10",
		"fill-orange-600/30 dark:fill-orange-600/10",
		"fill-amber-600/30 dark:fill-amber-600/10",
		"fill-yellow-600/30 dark:fill-yellow-600/10",
		"fill-lime-600/30 dark:fill-lime-600/10",
		"fill-green-600/30 dark:fill-green-600/10",
		"fill-emerald-600/30 dark:fill-emerald-600/10",
		"fill-teal-600/30 dark:fill-teal-600/10",
		"fill-cyan-600/30 dark:fill-cyan-600/10",
		"fill-sky-600/30 dark:fill-sky-600/10",
		"fill-blue-600/30 dark:fill-blue-600/10",
		"fill-indigo-600/30 dark:fill-indigo-600/10",
		"fill-violet-600/30 dark:fill-violet-600/10",
		"fill-purple-600/30 dark:fill-purple-600/10",
		"fill-fuchsia-600/30 dark:fill-fuchsia-600/10",
		"fill-pink-600/30 dark:fill-pink-600/10",
		"fill-rose-600/30 dark:fill-rose-600/10",
		"fill-slate-600/30 dark:fill-slate-600/10",
		"fill-gray-600/30 dark:fill-gray-600/10",
		"fill-zinc-600/30 dark:fill-zinc-600/10",
		"fill-neutral-600/30 dark:fill-neutral-600/10",
		"fill-stone-600/30 dark:fill-stone-600/10",
	];
	let secondStrokeColors = [
		"stroke-red-400 dark:stroke-red-600",
		"stroke-orange-400 dark:stroke-orange-600",
		"stroke-amber-400 dark:stroke-amber-600",
		"stroke-yellow-400 dark:stroke-yellow-600",
		"stroke-lime-400 dark:stroke-lime-600",
		"stroke-green-400 dark:stroke-green-600",
		"stroke-emerald-400 dark:stroke-emerald-600",
		"stroke-teal-400 dark:stroke-teal-600",
		"stroke-cyan-400 dark:stroke-cyan-600",
		"stroke-sky-400 dark:stroke-sky-600",
		"stroke-blue-400 dark:stroke-blue-600",
		"stroke-indigo-400 dark:stroke-indigo-600",
		"stroke-violet-400 dark:stroke-violet-600",
		"stroke-purple-400 dark:stroke-purple-600",
		"stroke-fuchsia-400 dark:stroke-fuchsia-600",
		"stroke-pink-400 dark:stroke-pink-600",
		"stroke-rose-400 dark:stroke-rose-600",
		"stroke-slate-400 dark:stroke-slate-600",
		"stroke-gray-400 dark:stroke-gray-600",
		"stroke-zinc-400 dark:stroke-zinc-600",
		"stroke-neutral-400 dark:stroke-neutral-600",
		"stroke-stone-400 dark:stroke-stone-600",
	];
	let secondFillColors = [
		"fill-red-100/20 dark:fill-red-900/20",
		"fill-orange-100/20 dark:fill-orange-900/20",
		"fill-amber-100/20 dark:fill-amber-900/20",
		"fill-yellow-100/20 dark:fill-yellow-900/20",
		"fill-lime-100/20 dark:fill-lime-900/20",
		"fill-green-100/20 dark:fill-green-900/20",
		"fill-emerald-100/20 dark:fill-emerald-900/20",
		"fill-teal-100/20 dark:fill-teal-900/20",
		"fill-cyan-100/20 dark:fill-cyan-900/20",
		"fill-sky-100/20 dark:fill-sky-900/20",
		"fill-blue-100/20 dark:fill-blue-900/20",
		"fill-indigo-100/20 dark:fill-indigo-900/20",
		"fill-violet-100/20 dark:fill-violet-900/20",
		"fill-purple-100/20 dark:fill-purple-900/20",
		"fill-fuchsia-100/20 dark:fill-fuchsia-900/20",
		"fill-pink-100/20 dark:fill-pink-900/20",
		"fill-rose-100/20 dark:fill-rose-900/20",
		"fill-slate-100/20 dark:fill-slate-900/20",
		"fill-gray-100/20 dark:fill-gray-900/20",
		"fill-zinc-100/20 dark:fill-zinc-900/20",
		"fill-neutral-100/20 dark:fill-neutral-900/20",
		"fill-stone-100/20 dark:fill-stone-900/20",
	];
	// these automatically update when `time`
	// changes, because of the `$derived` rune
	let someTime = $derived($elapsedTime + $lapTime);
	let seconds = $derived(Math.floor(someTime / 1000));
	let minutes = $derived(Math.floor(seconds / 60));
	let hours = $derived(Math.floor(minutes / 60));
	// let milliseconds = $derived(time.getMilliseconds());

	onMount(() => {
		resetStopWatch();
	});

	onDestroy(() => {
		destroyStopWatch();
	});

	function onClick() {
		toggleStopWatch();
	}
	function onKeyDown() {
		toggleStopWatch();
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<svg viewBox="-50 -50 100 100" onclick={onClick} onkeyup={onKeyDown}>
	<circle
		class="{hourStrokeColors[$settings.color]} {hourFillColors[$settings.color]} stroke-2"
		r="40"
	/>
	<circle
		class="{minuteStrokeColors[$settings.color]} {minuteFillColors[$settings.color]} stroke-1.5"
		r="20"
	/>

	<!-- markers -->
	{#each [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] as minute, i (i)}
		<g transform="rotate({30 * minute})">
			<line class="stroke-{ColorNames[$settings.color]}-900 stroke-2" y1="35" y2="45" />
			<line class="stroke-{ColorNames[$settings.color]}-600 stroke-0.5" y1="20" y2="23" />
		</g>

		{#each [1, 2, 3, 4] as offset, i (i)}
			<g transform="rotate({6 * (minute + offset)})">
				<line class="stroke-{ColorNames[$settings.color]}-400 stroke-2" y1="35" y2="39" />
				<line class="stroke-{ColorNames[$settings.color]}-600 stroke-0.5" y1="20" y2="23" />
			</g>
		{/each}
	{/each}

	<!-- hour hand -->
	<g transform="rotate({30 * hours})">
		<line class="stroke-clock-hour-50 stroke-2" y1="-33" y2="-40" />
		<line class="stroke-clock-hour-50 fill-black stroke-6" y1="-45" y2="-50" />
		<circle
			class="stroke-clock-hour-50 fill-black stroke-2"
			r="4"
			cx="0"
			cy="-29"
			style="fill-opacity: .25;"
		/>
	</g>

	<!-- minute hand -->
	<g transform="rotate({6 * minutes})">
		<line
			class="stroke-{ColorNames[$settings.color]}-600 fill-{ColorNames[
				$settings.color
			]}-100/10 stroke-0.5"
			y1="0"
			y2="-20"
		/>
		<circle
			class="stroke-{ColorNames[$settings.color]}-600 fill-{ColorNames[
				$settings.color
			]}-100/10 stroke-0.5"
			r={9 * (1 - Math.cos((seconds / 30) * Math.PI))}
			cx="0"
			cy="0"
			style="fill-opacity: .05;"
		/>
		<line
			class="stroke-{ColorNames[$settings.color]}-600 fill-{ColorNames[
				$settings.color
			]}-100/10 stroke-2"
			y1="-15"
			y2="-17"
		/>
		<circle
			class="stroke-{ColorNames[$settings.color]}-600 fill-{ColorNames[
				$settings.color
			]}-100/10 stroke-0.5"
			r={3 * (1 + Math.cos((seconds / 30) * Math.PI))}
			cx="0"
			cy="-29"
			style="fill-opacity: .25;"
		/>
	</g>

	<!-- second hand -->
	<g transform="rotate({6 * seconds})">
		<line
			class="{secondStrokeColors[$settings.color]} {secondFillColors[$settings.color]} stroke-2"
			y1="-34"
			y2="-45"
		/>
		<line class="{secondStrokeColors[$settings.color]} stroke-1" y1="-24" y2="-19.5" />
		<circle
			class="{secondStrokeColors[$settings.color]} {secondFillColors[$settings.color]} 5 stroke-1"
			r="5"
			cx="0"
			cy="-29"
			style="fill-opacity: .25;"
		/>
	</g>
</svg>

<style>
	svg {
		width: 100%;
		height: 100%;
	}
</style>
