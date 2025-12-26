<script lang="ts">
	import { BorderColors, BGColors, HourStrokeColors, ColorIndex } from "$lib/store/Colors.svelte";
	import { OtherNames } from "$lib/store/LessonsDB.svelte";
	import CheckIcon from "@lucide/svelte/icons/check";

	type Props = {
		customString: string;
		customChanged: (customString: string) => void;
		colorIndex: ColorIndex;
	};
	let { customString, customChanged, colorIndex = $bindable<ColorIndex>() }: Props = $props();

	let myTextArea: HTMLTextAreaElement;
	function textChanged() {
		customString = myTextArea.value;
		customChanged(customString);
	}

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
	id="custom-text"
	name={OtherNames.custom}
	placeholder="Type or paste custom words to practice with here."
	rows="10"
	value={customString}
	bind:this={myTextArea}
></textarea>
<button
	onclick={() => {
		textChanged();
	}}
	type="button"
	class={clickButtonClass}><CheckIcon class="size-8 {HourStrokeColors[ColorIndex.emerald]}" /></button
>

<!-- <Dialog initialFocusEl={() => document.querySelector('[name="custom text"]')}>
</Dialog> -->
