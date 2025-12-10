<script lang="ts">
	import { Slider } from "@skeletonlabs/skeleton-svelte";
	import PlusIcon from "@lucide/svelte/icons/plus";
	import MinusIcon from "@lucide/svelte/icons/minus";

	let {
		minCounter = 1,
		maxCounter = 100,
		stepCounter = 5,
		count = $bindable(),
		name = "name",
		onchange = () => {},
	} = $props();

	// let displayed_count = $derived(count);
	const offset = $derived(modulo(count, 1));

	function modulo(n: number, m: number) {
		// handle negative numbers
		return ((n % m) + m) % m;
	}

	function onMouseUp() {
		count = Math.max(count - 1, minCounter);
		if (onchange) {
			onchange(count);
		}
	}
	function onMouseDown() {
		count = Math.min(count + 1, maxCounter);
		if (onchange) {
			onchange(count);
		}
	}
	function onValueChange(values: { value: number[] }) {
		count = values.value[0];
		if (onchange) {
			onchange(count);
		}
	}
</script>

<div class="card preset-outlined-primary-500 p-4 shadow-xl">
	<header class="card-header text-center">{name}</header>
	<div class="grid grid-rows-1 justify-between sm:grid-cols-3">
		<button onmouseup={onMouseUp} aria-label="Decrease the counter by one">
			<MinusIcon class="size-4" />
		</button>
		<span class="counter-viewport">
			<div class="counter-digits" style="transform: translate(0, {100 * offset}%)">
				<strong class="hidden" aria-hidden="true">{Math.floor(count + 1)}</strong>
				<strong>{Math.floor(count)}</strong>
			</div>
		</span>
		<button onmouseup={onMouseDown} aria-label="Increase the counter by one">
			<PlusIcon class="size-4" />
		</button>
	</div>

	<div class="mt-3">
		<Slider
			{name}
			defaultValue={[50]}
			value={[count]}
			min={minCounter}
			max={maxCounter}
			step={stepCounter}
			{onValueChange}
		>
			<Slider.Control>
				<Slider.Track>
					<Slider.Range />
				</Slider.Track>
				<Slider.Thumb index={0}>
					<Slider.HiddenInput />
				</Slider.Thumb>
			</Slider.Control>
		</Slider>
	</div>
</div>
