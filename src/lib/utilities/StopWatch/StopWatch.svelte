<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { elapsedTime, destroyStopWatch, resetStopWatch, toggleStopWatch, lapTime } from "./stopwatch";
	import {
		ColorNames,
		ColorIndex,
		HourStrokeColors,
		HourFillColors,
		MinuteStrokeColors,
		MinuteFillColors,
		SecondStrokeColors,
		SecondFillColors,
	} from "$lib/store/Colors.svelte";

	type Props = {
		colorIndex: ColorIndex;
	};
	let { colorIndex }: Props = $props();

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
	<circle class="{HourStrokeColors[colorIndex]} {HourFillColors[colorIndex]} stroke-2" r="40"></circle>
	<circle class="{MinuteStrokeColors[colorIndex]} {MinuteFillColors[colorIndex]} stroke-1.5" r="20"></circle>

	<!-- markers -->
	{#each [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] as minute, i (i)}
		<g transform="rotate({30 * minute})">
			<line class="stroke-{ColorNames[colorIndex]}-900 stroke-2" y1="35" y2="45"></line>
			<line class="stroke-{ColorNames[colorIndex]}-600 stroke-0.5" y1="20" y2="23"></line>
		</g>

		{#each [1, 2, 3, 4] as offset, i (i)}
			<g transform="rotate({6 * (minute + offset)})">
				<line class="stroke-{ColorNames[colorIndex]}-400 stroke-2" y1="35" y2="39"></line>
				<line class="stroke-{ColorNames[colorIndex]}-600 stroke-0.5" y1="20" y2="23"></line>
			</g>
		{/each}
	{/each}

	<!-- hour hand -->
	<g transform="rotate({30 * hours})">
		<line class="stroke-clock-hour-50 stroke-2" y1="-33" y2="-40"></line>
		<line class="stroke-clock-hour-50 fill-black stroke-6" y1="-45" y2="-50"></line>
		<circle class="stroke-clock-hour-50 fill-black stroke-2" r="4" cx="0" cy="-29" style="fill-opacity: .25;"
		></circle>
	</g>

	<!-- minute hand -->
	<g transform="rotate({6 * minutes})">
		<line
			class="stroke-{ColorNames[colorIndex]}-600 fill-{ColorNames[colorIndex]}-100/10 stroke-0.5"
			y1="0"
			y2="-20"
		></line>
		<circle
			class="stroke-{ColorNames[colorIndex]}-600 fill-{ColorNames[colorIndex]}-100/10 stroke-0.5"
			r={9 * (1 - Math.cos((seconds / 30) * Math.PI))}
			cx="0"
			cy="0"
			style="fill-opacity: .05;"
		></circle>
		<line
			class="stroke-{ColorNames[colorIndex]}-600 fill-{ColorNames[colorIndex]}-100/10 stroke-2"
			y1="-15"
			y2="-17"
		></line>
		<circle
			class="stroke-{ColorNames[colorIndex]}-600 fill-{ColorNames[colorIndex]}-100/10 stroke-0.5"
			r={3 * (1 + Math.cos((seconds / 30) * Math.PI))}
			cx="0"
			cy="-29"
			style="fill-opacity: .25;"
		></circle>
	</g>

	<!-- second hand -->
	<g transform="rotate({6 * seconds})">
		<line class="{SecondStrokeColors[colorIndex]} {SecondFillColors[colorIndex]} stroke-2" y1="-34" y2="-45"></line>
		<line class="{SecondStrokeColors[colorIndex]} stroke-1" y1="-24" y2="-19.5"></line>
		<circle
			class="{SecondStrokeColors[colorIndex]} {SecondFillColors[colorIndex]} 5 stroke-1"
			r="5"
			cx="0"
			cy="-29"
			style="fill-opacity: .25;"
		></circle>
	</g>
</svg>

<style>
	svg {
		width: 100%;
		height: 100%;
	}
</style>
