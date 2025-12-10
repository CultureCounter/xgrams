<script lang="ts">
	import { OtherIndex, OtherNames } from "$lib/store/otherWords.svelte";

	let { currentLesson } = $props();

	function customChanged() {
		console.log("Custom changed:", currentLesson.custom);
	}
</script>

<textarea
	class="textarea"
	id="custom-text"
	name={OtherNames[OtherIndex.custom]}
	rows="10"
	bind:value={currentLesson.custom}
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
