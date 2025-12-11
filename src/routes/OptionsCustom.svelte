<script lang="ts">
	import { OtherIndex, OtherNames } from "$lib/store/otherWords.svelte";

	let { currentLesson } = $props();

	let myTextArea: HTMLTextAreaElement;
	function customChanged() {
		currentLesson.filter = myTextArea.value;
	}
	console.log("Custom changed:", currentLesson.custom);
</script>

<textarea
	class="textarea"
	id="custom-text"
	name={OtherNames[OtherIndex.custom]}
	rows="10"
	value={currentLesson.custom}
	bind:this={myTextArea}
></textarea>
<button
	onclick={() => {
		customChanged();
	}}
	type="button"
	class="btn preset-filled">Save</button
>

<!-- <Dialog initialFocusEl={() => document.querySelector('[name="custom text"]')}>
</Dialog> -->
