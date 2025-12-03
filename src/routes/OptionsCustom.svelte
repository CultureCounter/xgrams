<script lang="ts">
	import { idbLessons } from "$lib/store/LessonsXG.svelte";
	import { SourceIndex } from "$lib/store/SourceXG.svelte";

	function customChanged() {
		console.log("Custom changed:", idbLessons.sourceOptions[SourceIndex.customWords].lines);
	}
</script>

<textarea
	class="textarea"
	id="custom-text"
	name="Custom Text"
	rows="10"
	bind:value={idbLessons.sourceOptions[SourceIndex.customWords].lines}
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
