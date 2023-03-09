<script lang="ts">
	import { LanguageNames, myStore, OptionIndex } from '$lib/store/data';
	import { modalStore, SlideToggle } from '@skeletonlabs/skeleton';

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
	<header class={cHeader}>Custom Words</header>
	<article>Add custom words, separated by spaces/newlines:</article>
	<textarea class="textarea" rows="4" bind:value={$data.sourceOptions[OptionIndex.custom_words].lines} />
	<footer class="modal-footer {parent.regionFooter}">
		<button class="btn {parent.buttonPositive}" on:click={onFormSubmit}><slot /></button>
	</footer>
</div>
