<script lang="ts">
	import { myStore } from '$lib/store/data';
	import { modalStore } from '@skeletonlabs/skeleton';

	const { data } = myStore;

	// Props
	/** Exposes parent props to this component. */
	export let parent: any;

	// Handle Form Submission
	function onFormSubmit(): void {
		modalStore.close();
	}

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
</script>

<div class="modal-example-form {cBase}">
	<header class={cHeader}>Filter</header>
	<article>
		All letters on same line required. At least one line must match:
		<strong>exa<br />mple</strong>
		Matches: <strong />exam empl mple plemß
	</article>
	<textarea class="textarea" bind:value={$data.currentOptions.filter} name="filter text" />
	<footer class="modal-footer {parent.regionFooter}">
		<button class="btn {parent.buttonPositive}" on:click={onFormSubmit}><slot /></button>
	</footer>
</div>
