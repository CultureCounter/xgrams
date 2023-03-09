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
