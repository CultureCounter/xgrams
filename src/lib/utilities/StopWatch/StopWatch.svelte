<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { elapsedTime, destroyStopWatch, resetStopWatch, toggleStopWatch, lapTime } from './stopwatch';

	// these automatically update when `time`
	// changes, because of the `$:` prefix
	$: someTime = $elapsedTime + $lapTime;
	$: seconds = Math.floor(someTime / 1000);
	$: minutes = Math.floor(seconds / 60);
	$: hours = Math.floor(minutes / 60);
	// $: milliseconds = time.getMilliseconds();

	onMount(() => {
		resetStopWatch();
	});

	onDestroy(() => {
		destroyStopWatch();
	});

	function onClick(event: MouseEvent) {
		toggleStopWatch();
	}
	function onKeyDown(event: KeyboardEvent) {
		toggleStopWatch();
	}
</script>

<svg viewBox="-50 -50 100 100" on:click={onClick} on:keyup={onKeyDown}>
	<circle class="clock-face-outer" r="40" style="fill-opacity: .25;" />
	<circle class="clock-face-inner" r="20" style="fill-opacity: .25;" />

	<!-- markers -->
	{#each [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] as minute}
		<g transform="rotate({30 * minute})">
			<line class="major" y1="35" y2="45" />
			<line class="minor-inner" y1="20" y2="23" />
		</g>

		{#each [1, 2, 3, 4] as offset}
			<g transform="rotate({6 * (minute + offset)})">
				<line class="minor" y1="35" y2="38" />
				<line class="minor-inner" y1="20" y2="23" />
			</g>
		{/each}
	{/each}

	<!-- hour hand -->
	<g transform="rotate({30 * hours})">
		<line class="hour" y1="-33" y2="-40" />
		<line class="hour-counterweight" y1="-45" y2="-50" />
		<circle class="hour" r="4" cx="0" cy="-29" style="fill-opacity: .25;" />
	</g>

	<!-- minute hand -->
	<g transform="rotate({6 * minutes})">
		<line class="minute" y1="0" y2="-20" />
		<circle class="minute" r={9 * (1 - Math.cos((seconds / 30) * Math.PI))} cx="0" cy="0" style="fill-opacity: .05;" />
		<line class="minute-counterweight" y1="-15" y2="-17" />
		<circle class="minute" r={3 * (1 + Math.cos((seconds / 30) * Math.PI))} cx="0" cy="-29" style="fill-opacity: .25;" />
	</g>

	<!-- second hand -->
	<g transform="rotate({6 * seconds})">
		<line class="second-counterweight" y1="-34" y2="-45" />
		<line class="second" y1="-24" y2="-19.5" />
		<circle class="second" r="5" cx="0" cy="-29" style="fill-opacity: .25;" />
	</g>
</svg>

<style>
	svg {
		width: 100%;
		height: 100%;
	}

	.clock-face-outer {
		fill: #001010;
	}

	.clock-face-inner {
		fill: #002525;
	}

	.hour,
	.hour-counterweight {
		fill: #0066a6;
		stroke: #066;
		stroke-width: 2;
	}

	.major,
	.clock-face-outer {
		stroke: #066;
		stroke-width: 2;
	}

	.hour-counterweight {
		stroke-width: 6;
	}

	.minute-counterweight,
	.clock-face-inner {
		stroke: #099;
		stroke-width: 1.5;
	}

	.minute,
	.minor-inner {
		fill: #001530;
		stroke: #099;
		stroke-width: 0.5;
	}

	.minute-counterweight {
		stroke-width: 3;
	}

	.second,
	.second-counterweight,
	.minor {
		fill: #009090;
		stroke: #0ee;
		stroke-width: 1;
	}

	.second-counterweight {
		fill: #001530;
		stroke-width: 2;
	}
</style>
