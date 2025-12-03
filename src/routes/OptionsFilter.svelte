<script lang="ts">
	import { idbLessons } from "$lib/store/LessonsXG.svelte";

	function filterChanged() {
		console.log("Filter changed:", idbLessons.currentOptions.filter);
	}
</script>

<article>
	All letters on same line required.<br />
	At least one line must match:<br />
	<strong
		>exa<br />
		mple</strong
	><br />
	Matches: <strong>exam empl mple mpel plem ...</strong>
</article>
<textarea class="textarea" id="filter-text" name="Filter Text" rows="10" bind:value={idbLessons.currentOptions.filter}
></textarea>
<button
	onclick={() => {
		filterChanged();
	}}
	type="button"
	class="btn preset-filled">Save</button
>
<!-- <Dialog initialFocusEl={() => document.querySelector('[name="filter text"]')}>
	</Dialog> -->
