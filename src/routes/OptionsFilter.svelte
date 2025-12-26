<script lang="ts">
	import { BGColors, BorderColors, ColorIndex, HourStrokeColors } from "$lib/store/Colors.svelte";
	import CheckIcon from "@lucide/svelte/icons/check";

	type Props = {
		filterString: string;
		filterChanged: (filter: string) => void;
		colorIndex: ColorIndex;
	};
	let { filterString = $bindable<string>(), filterChanged, colorIndex = $bindable<ColorIndex>() }: Props = $props();

	let myTextArea: HTMLTextAreaElement;
	function saveFilter() {
		filterChanged(myTextArea.value);
	}
	let textAreaValue = $derived<string>(filterString);

	const clickButtonClass = $derived(
		"btn backdrop-blur-xl space-y-4 border-2 "
			+ BorderColors[colorIndex]
			+ " "
			+ BGColors[colorIndex]
			+ " rounded-lg"
	);
</script>

<textarea
	class="textarea"
	id="filter-text"
	name="Filter Text"
	placeholder="All letters on the same line are required.
	Letter order does not matter.
	At least one line must match:
		exa
		mple
	Matches: exam axe empl mple mpel plem ..."
	rows="10"
	value={textAreaValue}
	bind:this={myTextArea}
></textarea>
<button
	onclick={() => {
		saveFilter();
	}}
	type="button"
	class={clickButtonClass}><CheckIcon class="size-8 {HourStrokeColors[ColorIndex.emerald]}" /></button
>
