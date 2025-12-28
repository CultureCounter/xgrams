<script lang="ts">
	import { Slider } from "@skeletonlabs/skeleton-svelte";
	import PlusIcon from "@lucide/svelte/icons/plus";
	import MinusIcon from "@lucide/svelte/icons/minus";
	import { ColorIndex, BGColors } from "$lib/store/Colors.svelte";

	type Props = {
		minCounter?: number;
		maxCounter?: number;
		stepCounter?: number;
		count?: number;
		name?: string;
		onChange?: (count: number) => void;
		colorIndex: ColorIndex;
	};
	let {
		minCounter = 1,
		maxCounter = 100,
		stepCounter = 5,
		count = $bindable<number>(),
		name = "name",
		onChange,
		colorIndex,
	}: Props = $props();

	// let displayed_count = $derived(count);
	const offset = $derived(modulo(count, 1));

	function modulo(n: number, m: number) {
		// handle negative numbers
		return ((n % m) + m) % m;
	}

	function onMouseUp() {
		count = Math.max(count - 1, minCounter);
		onChange?.(count);
	}
	function onMouseDown() {
		count = Math.min(count + 1, maxCounter);
		onChange?.(count);
	}
	function onValueChange(values: { value: number[] }) {
		count = values.value[0] || count;
		onChange?.(count);
	}

	let cardClass = $derived(
		"card p-4 backdrop-blur-x3 space-y-4 hover:bg-digital-blue-50 hover:dark:bg-digital-blue-950 "
			+ BGColors[colorIndex]
			+ " rounded-xl"
	);
</script>

<div class={cardClass}>
	<header class="card-header text-center">
		<p class="hidden md:inline">{name}</p>
	</header>
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

	<div class="mt-3 hidden xs:block">
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
