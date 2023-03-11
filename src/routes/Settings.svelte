<script lang="ts">
	import { LanguageIndex, myStore, OptionIndex, ScopeNames, ScopeValues, SoundNames, SourceNames } from '$lib/store/data';
	import type { ModalComponent, ModalSettings } from '@skeletonlabs/skeleton';
	import { Modal, InputChip, modalStore, RadioGroup, RadioItem, SlideToggle } from '@skeletonlabs/skeleton';
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

	/**
	 * Remove from space delimited `target` all `removals` and leave one `add`
	 * @param target
	 * @param removals
	 * @param add
	 * @returns string
	 */
	function replaceStrings(target: string, removals: string[], add: string): string {
		for (let candidate of removals) {
			// console.log('removing:`' + candidate + '`');
			target = target.replace(candidate, '');
		}
		target += add;
		return target;
	}

	let fontFamilyCSS = ['font-sans ', 'font-serif ', 'font-mono ', 'Fira Mono ', 'kobenhavn '];
	let fontFamilyNames = ['serif', 'sans', 'mono', 'Fira Mono', 'kobenhavn'];
	let selectedFontFamily: string;
	function setFontFamily(): void {
		$settings.font = replaceStrings($settings.font, fontFamilyCSS, selectedFontFamily);
		console.log('setFontFamily():' + $settings.font);
	}

	let fontSizeCSS = ['text-xs ', 'text-sm ', 'text-base ', 'text-lg ', 'text-xl ', 'text-2xl ', 'text-3xl ', 'text-4xl ', 'text-5xl '];
	let fontSizeNames = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'];
	let selectedFontSize: string;
	function setFontSize(): void {
		$settings.font = replaceStrings($settings.font, fontSizeCSS, selectedFontSize);
		console.log('setFontSize():' + $settings.font);
	}

	let fontWeightCSS = ['font-thin ', 'font-light ', 'font-normal ', 'font-medium ', 'font-bold '];
	let fontWeightNames = ['thin', 'light', 'normal', 'medium', 'bold'];
	let selectedFontWeight: string;
	function setFontWeight(): void {
		$settings.font = replaceStrings($settings.font, fontWeightCSS, selectedFontWeight);
		console.log('setFontWeight():' + $settings.font);
	}

	let fontSpacingCSS = ['tracking-tighter ', 'tracking-tight ', 'tracking-normal ', 'tracking-wide ', 'tracking-wider ', 'tracking-widest '];
	let fontSpacingNames = ['tighter', 'tight', 'normal', 'wide', 'wider', 'widest'];
	let selectedFontSpacing: string;
	function setFontSpacing(): void {
		$settings.font = replaceStrings($settings.font, fontSpacingCSS, selectedFontSpacing);
		console.log('setFontSpacing():' + $settings.font);
	}
</script>

<Modal />

<section>
	<h1 class="p-4">Settings</h1>
	<br />
</section>
<!-- <section class="grid grid-cols-1 sm:grid-cols-5 gap-2"> -->
<section class="flex place-content-between gap-x-3 mt-6 gap-2">
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
	<div class="card">
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
	<div class="card">
		<header class="card-header">Goals</header>
		<div class="p-4">
			<Counter name="Minimum&nbsp;WPM" max={401} step={10} bind:count={$settings.minimumWPM} />
			<Counter name="Minimum&nbsp;Accuracy" bind:count={$settings.minimumAccuracy} />
		</div>
	</div>
	<div class="card">
		<header class="card-header">Sounds</header>
		<div class="p-4">
			<div class="flex flex-col gap-2">
				{#each SoundNames as name, i}
					<SlideToggle active="variant-filled-primary" hover="hover:variant-soft-primary" {name} bind:checked={$settings.sounds[i]}>{name}</SlideToggle>
				{/each}
			</div>
		</div>
	</div>
	<div class="card">
		<header class="card-header">Font</header>
		<div class="p-4">
			<div class="flex flex-col gap-2">
				<!-- <form on:submit|preventDefault={setFontFamily}> -->
				<label class="label">
					<span>Font Family</span>
					<select
						class="input"
						bind:value={selectedFontFamily}
						on:change={() => {
							setFontFamily();
						}}>
						{#each fontFamilyCSS as s, i}
							<option class="variant-filled-primary" value={s}>
								{fontFamilyNames[i]}
							</option>
						{/each}
					</select>
				</label>
				<label class="label">
					<span>Font Size</span>
					<select
						class="input"
						bind:value={selectedFontSize}
						on:change={() => {
							setFontSize();
						}}>
						{#each fontSizeCSS as s, i}
							<option class="variant-filled-primary" value={s}>
								{fontSizeNames[i]}
							</option>
						{/each}
					</select>
				</label>
				<label class="label">
					<span>Font Weight</span>
					<select
						class="input"
						bind:value={selectedFontWeight}
						on:change={() => {
							setFontWeight();
						}}>
						{#each fontWeightCSS as s, i}
							<option class="variant-filled-primary" value={s}>
								{fontWeightNames[i]}
							</option>
						{/each}
					</select>
				</label>
				<label class="label">
					<span>Font Spacing</span>
					<select
						class="input"
						bind:value={selectedFontSpacing}
						on:change={() => {
							setFontSpacing();
						}}>
						{#each fontSpacingCSS as s, i}
							<option class="variant-filled-primary" value={s}>
								{fontSpacingNames[i]}
							</option>
						{/each}
					</select>
				</label>
			</div>
		</div>
	</div>
</section>
