<script lang="ts">
	let { currentLesson } = $props();

	let myTextArea: HTMLTextAreaElement;
	function filterChanged() {
		currentLesson.filter = myTextArea.value;
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
<textarea
	class="textarea"
	id="filter-text"
	name="Filter Text"
	rows="10"
	value={currentLesson.filter}
	bind:this={myTextArea}
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
