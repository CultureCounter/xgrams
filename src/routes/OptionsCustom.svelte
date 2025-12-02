<script lang="ts">
	import { idbData } from "$lib/store/data";
	import { SourceIndex } from "$lib/store/SourceXG.svelte";

	function customChanged() {
		console.log("Custom changed:", idbData.sourceOptions[SourceIndex.customWords].lines);
	}
</script>

<textarea
	class="textarea"
	id="custom-text"
	name="Custom Text"
	rows="10"
	bind:value={idbData.sourceOptions[SourceIndex.customWords].lines}
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
