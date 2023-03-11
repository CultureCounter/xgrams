<script lang="ts">
	import { RangeSlider } from '@skeletonlabs/skeleton';
	import { spring } from 'svelte/motion';

	export let count = 0;
	export let min = 1;
	export let max = 101;
	export let step = 5;
	export let id = 'range';
	export let name = 'name';

	const displayed_count = spring();
	$: displayed_count.set(count);
	$: offset = modulo($displayed_count, 1);

	function modulo(n: number, m: number) {
		// handle negative numbers
		return ((n % m) + m) % m;
	}
</script>

<div class="card">
	<header class="card-header">{name}</header>
	<div class="p-4 grid grid-rows-1 sm:grid-cols-3 gap-1">
		<button on:click={() => (count -= 1)} aria-label="Decrease the counter by one">
			<svg viewBox="0 0 1 1" xmlns="http://www.w3.org/2000/svg">
				<path d="M0,0.5 L1,0.5" stroke-width="5%" />
			</svg>
		</button>
		<span class="counter-viewport">
			<div class="counter-digits" style="transform: translate(0, {100 * offset}%)">
				<strong class="hidden" aria-hidden="true">{Math.floor($displayed_count + 1)}</strong>
				<strong>{Math.floor($displayed_count)}</strong>
			</div>
		</span>
		<button on:click={() => (count += 1)} aria-label="Increase the counter by one">
			<svg viewBox="0 0 1 1" xmlns="http://www.w3.org/2000/svg">
				<path d="M0,0.5 L1,0.5 M0.5,0 L0.5,1" stroke-width="5%" />
			</svg>
		</button>
	</div>
	<div class="range">
		<RangeSlider {id} {name} label={name} bind:value={count} {min} {max} {step} />
	</div>
</div>

<style>
	svg {
		width: 50%;
		height: 50%;
		stroke: white;
		stroke: width 1px;
	}
</style>
