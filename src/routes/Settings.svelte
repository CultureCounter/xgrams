<script lang="ts">
	import { LanguageIndex, LanguageNames, myStore, OptionIndex, ScopeNames, ScopeValues, SoundIndex, SoundNames, SourceNames } from '$lib/store/data';
	import type { ModalComponent, ModalSettings, PopupSettings } from '@skeletonlabs/skeleton';
	import { Modal, modalStore, popup, RadioGroup, RadioItem, SlideToggle } from '@skeletonlabs/skeleton';
	import Counter from './Counter.svelte';
	import OptionsCode from './OptionsCode.svelte';
	import OptionsCustom from './OptionsCustom.svelte';
	import OptionsFilter from './OptionsFilter.svelte';

	const { data, settings, sources } = myStore;

	const modalOptionsCode: ModalComponent = {
		ref: OptionsCode,
		slot: '<span>Done</span>',
	};
	function modalCode(): void {
		const d: ModalSettings = {
			type: 'component',
			component: modalOptionsCode,
		};
		modalStore.trigger(d);
	}

	const modalOptionsCustom: ModalComponent = {
		ref: OptionsCustom,
		slot: '<span>Done</span>',
	};
	function modalCustom(): void {
		const d: ModalSettings = {
			type: 'component',
			component: modalOptionsCustom,
		};
		modalStore.trigger(d);
	}

	const modalOptionsFilter: ModalComponent = {
		ref: OptionsFilter,
		slot: '<span>Done</span>',
	};
	function modalFilter(): void {
		const d: ModalSettings = {
			type: 'component',
			component: modalOptionsFilter,
		};
		modalStore.trigger(d);
	}

	function updateCodeWords(status: string) {
		// console.log('updateCodeWords:' + status);
		if (status == 'Closing') {
			let codeWordsProccessed = [
				...($data.languages[LanguageIndex.languageCpp] ? $sources.code.languageCpp : []),
				...($data.languages[LanguageIndex.languageCs] ? $sources.code.languageCs : []),
				...($data.languages[LanguageIndex.languageGo] ? $sources.code.languageGo : []),
				...($data.languages[LanguageIndex.languageJava] ? $sources.code.languageJava : []),
				...($data.languages[LanguageIndex.languageJavascript] ? $sources.code.languageJavascript : []),
				...($data.languages[LanguageIndex.languagePython] ? $sources.code.languagePython : []),
				...($data.languages[LanguageIndex.languageRust] ? $sources.code.languageRust : []),
				...($data.languages[LanguageIndex.languageSwift] ? $sources.code.languageSwift : []),
				...($data.languages[LanguageIndex.languageTypescript] ? $sources.code.languageTypescript : []),
			];

			$sources.source[OptionIndex.code_words] = codeWordsProccessed;
			$sources = $sources;
			$data = $data;
		}
	}
	let status = 'Closed';
	$: updateCodeWords(status);

	let isOpenCode = false;
	const toggleCode = () => (isOpenCode = !isOpenCode);
	let isOpenCustom = false;
	const toggleCustom = () => (isOpenCustom = !isOpenCustom);
</script>

<Modal />

<section>
	<h1 class="p-4">Settings</h1>
	<br />
</section>
<section class="grid grid-cols-1 sm:grid-cols-5 gap-2">
	<div class="card">
		<header class="card-header">Source</header>
		<div class="p-4">
			<RadioGroup rounded="rounded-2xl" display="flex-col" active="variant-filled-primary" hover="hover:variant-soft-primary">
				{#each SourceNames as name, i}
					<RadioItem bind:group={$data.source} label={name} {name} value={i}>{name}</RadioItem>
				{/each}
				<RadioItem bind:group={$data.source} name="Code" value={OptionIndex.code_words}
					>Code
					<button class="btn h-0 px-0" on:click={modalCode}>⚙️</button>
				</RadioItem>
				<RadioItem bind:group={$data.source} name="Custom" value={OptionIndex.custom_words}
					><span class="space-y-0">Custom</span>
					<button class="btn h-0 px-0" on:click={modalCustom}>⚙️</button>
				</RadioItem>
			</RadioGroup>
		</div>
	</div>
	<div class="card">
		<header class="card-header">Scope</header>
		<div class="p-4">
			<RadioGroup rounded="rounded-2xl" display="flex-col" active="variant-filled-primary" hover="hover:variant-soft-primary">
				{#each ScopeNames as name, i}
					<RadioItem bind:group={$data.currentOptions.scope} {name} value={ScopeValues[i]}>{name}</RadioItem>
				{/each}
			</RadioGroup>
		</div>
	</div>
	<div class="card p-0 space-y-0 m-0">
		<header class="card-header">Generate</header>
		<div class="p-4">
			<Counter name="Combination" bind:count={$data.currentOptions.combination} />
			<Counter name="Repetition" bind:count={$data.currentOptions.repetition} />
			<label class="label">
				<span
					>Filter
					<button class="btn px-0" on:click={modalFilter}>⚙️</button>
				</span>
			</label>
		</div>
	</div>
	<div class="card p-4 space-y-4">
		<header class="card-header">Goals</header>
		<div class="p-4">
			<Counter name="Minimum&nbsp;WPM" max={401} step={10} bind:count={$settings.minimumWPM} />
			<Counter name="Minimum&nbsp;Accuracy" bind:count={$settings.minimumAccuracy} />
		</div>
	</div>
	<div class="card p-4 space-y-4">
		<header class="card-header">Sounds</header>
		<div class="p-4">
			<div>
				{#each SoundNames as name, i}
					<SlideToggle active="variant-filled-primary" hover="hover:variant-soft-primary" {name} bind:checked={$settings.sounds[i]}>{name}</SlideToggle>
				{/each}
			</div>
		</div>
	</div>
</section>

<button
	type="button"
	id="headlessui-listbox-button-4"
	aria-haspopup="true"
	aria-expanded="false"
	data-headlessui-state=""
	aria-labelledby="headlessui-listbox-label-3 headlessui-listbox-button-4"
	class=""
	><span class="dark:hidden"
		><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"
			><path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" class="stroke-slate-400 dark:stroke-slate-500" /><path
				d="M12 4v1M17.66 6.344l-.828.828M20.005 12.004h-1M17.66 17.664l-.828-.828M12 20.01V19M6.34 17.664l.835-.836M3.995 12.004h1.01M6 6l.835.836"
				class="stroke-slate-400 dark:stroke-slate-500" /></svg
		></span
	><span class="hidden dark:inline"
		><svg viewBox="0 0 24 24" fill="none" class="w-6 h-6"
			><path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M17.715 15.15A6.5 6.5 0 0 1 9 6.035C6.106 6.922 4 9.645 4 12.867c0 3.94 3.153 7.136 7.042 7.136 3.101 0 5.734-2.032 6.673-4.853Z"
				class="fill-transparent" /><path
				d="m17.715 15.15.95.316a1 1 0 0 0-1.445-1.185l.495.869ZM9 6.035l.846.534a1 1 0 0 0-1.14-1.49L9 6.035Zm8.221 8.246a5.47 5.47 0 0 1-2.72.718v2a7.47 7.47 0 0 0 3.71-.98l-.99-1.738Zm-2.72.718A5.5 5.5 0 0 1 9 9.5H7a7.5 7.5 0 0 0 7.5 7.5v-2ZM9 9.5c0-1.079.31-2.082.845-2.93L8.153 5.5A7.47 7.47 0 0 0 7 9.5h2Zm-4 3.368C5 10.089 6.815 7.75 9.292 6.99L8.706 5.08C5.397 6.094 3 9.201 3 12.867h2Zm6.042 6.136C7.718 19.003 5 16.268 5 12.867H3c0 4.48 3.588 8.136 8.042 8.136v-2Zm5.725-4.17c-.81 2.433-3.074 4.17-5.725 4.17v2c3.552 0 6.553-2.327 7.622-5.537l-1.897-.632Z"
				class="fill-slate-400 dark:fill-slate-500" /><path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M17 3a1 1 0 0 1 1 1 2 2 0 0 0 2 2 1 1 0 1 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 2 2 0 0 0-2-2 1 1 0 1 1 0-2 2 2 0 0 0 2-2 1 1 0 0 1 1-1Z"
				class="fill-slate-400 dark:fill-slate-500" /></svg
		></span
	></button>
