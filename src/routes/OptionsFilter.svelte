<script lang="ts">
	type Props = {
		filter: string;
		filterChanged: (filter: string) => void;
	};
	let { filter, filterChanged }: Props = $props();

	let myTextArea: HTMLTextAreaElement;
	function saveFilter() {
		filter = myTextArea.value;
		filterChanged(filter);
	}
	let textAreaValue = $derived<string>(filter);
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
<textarea class="textarea" id="filter-text" name="Filter Text" rows="10" value={textAreaValue} bind:this={myTextArea}
></textarea>
<button
	onclick={() => {
		saveFilter();
	}}
	type="button"
	class="btn preset-filled">Save</button
>
