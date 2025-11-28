<script lang="ts">
	import { myStore } from "$lib/store/data";
	import { SourceIndex } from "$lib/store/xgramSources.svelte";

	const { data } = myStore;
	function customChanged() {
		console.log("Custom changed:", $data.sourceOptions[SourceIndex.customWords].lines);
	}
</script>

<textarea
	class="textarea"
	id="custom-text"
	name="Custom Text"
	rows="10"
	bind:value={$data.sourceOptions[SourceIndex.customWords].lines}
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
