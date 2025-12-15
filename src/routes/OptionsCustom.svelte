<script lang="ts">
	import { OtherNames } from "$lib/store/LessonsDB.svelte";

	type Props = {
		customString: string;
		customChanged: (customString: string) => void;
	};
	let { customString, customChanged }: Props = $props();

	let myTextArea: HTMLTextAreaElement;
	function textChanged() {
		customString = myTextArea.value;
		customChanged(customString);
	}
</script>

<textarea
	class="textarea"
	id="custom-text"
	name={OtherNames.custom}
	rows="10"
	value={customString}
	bind:this={myTextArea}
></textarea>
<button
	onclick={() => {
		textChanged();
	}}
	type="button"
	class="btn preset-filled">Save</button
>

<!-- <Dialog initialFocusEl={() => document.querySelector('[name="custom text"]')}>
</Dialog> -->
