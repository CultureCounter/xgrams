<script lang="ts">
	import githubDark from "$lib/images/github-mark-white.svg";
	import reddit from "$lib/images/reddit-icon-full-color.svg";
	import { KeyboardIndex, KeyboardNames, keyboards, LayoutIndex, LayoutNames } from "$lib/store/keyboard";
	import { settingsState } from "$lib/store/SettingsState.svelte";
	import type { SettingsDB } from "$lib/store/SettingsDB.svelte";
	import { Switch } from "@skeletonlabs/skeleton-svelte";

	type Props = {
		idbSettings: SettingsDB;
	};
	let { idbSettings = $bindable<SettingsDB>() }: Props = $props();

	function setKeyboard(): void {
		// console.log("setKeyboard", idbSettings.keyboard, "->", settingsState.keyboard);
		idbSettings.keyboard = settingsState.keyboard;
		idbSettings.isDirty = true;

		let newLayout = keyboards.get(settingsState.layout);
		if (newLayout === undefined) {
			console.assert(newLayout !== undefined, "Layout not found");
			newLayout = keyboards.get(LayoutIndex.colemakDH);
		}
		if (newLayout?.get(settingsState.keyboard) === undefined) {
			// Find a layout that has this keyboard
			for (let layout of keyboards.keys()) {
				if (keyboards.get(layout)?.has(settingsState.keyboard)) {
					settingsState.layout = layout;
					break;
				}
			}
			console.assert(newLayout?.get(settingsState.keyboard) !== undefined, "Keyboard not found");
		}
	}

	function setLayout(): void {
		// console.log("setLayout", idbSettings.layout, "->", settingsState.layout);
		idbSettings.layout = settingsState.layout;
		idbSettings.isDirty = true;

		// adjust keyboard type if needed
		let newLayout = keyboards.get(settingsState.layout);
		if (newLayout === undefined) {
			console.assert(newLayout !== undefined, "Layout not found");
			newLayout = keyboards.get(LayoutIndex.colemakDH);
		}
		if (newLayout?.get(settingsState.keyboard) === undefined) {
			settingsState.keyboard = newLayout?.keys().next().value as KeyboardIndex;
			console.assert(newLayout?.get(settingsState.keyboard) !== undefined, "Keyboard not found");
		}
	}

	// eslint-disable-next-line svelte/no-unused-svelte-ignore
	// svelte-ignore state_referenced_locally
	const onCheckedChange = (checked: boolean) => {
		settingsState.showFingerColors = checked;
		idbSettings.showFingerColors = checked;
		idbSettings.isDirty = true;
	};

	const dropdownLabelClass = "label w-full max-w-48";
	const linksClass = "flex flex-row flex-wrap justify-stretch space-x-4";
	const linkClass = "flex items-center space-x-1";
</script>

<div class="flex flex-col justify-stretch gap-4">
	<label class={dropdownLabelClass} for="select-keyboard">
		<span>Keyboard</span>
		<select
			class="select"
			id="select-keyboard"
			name="Keyboard Selection"
			bind:value={settingsState.keyboard}
			onchange={() => {
				setKeyboard();
			}}
		>
			{#each KeyboardNames as name, i (name)}
				<option value={i}>
					{name}
				</option>
			{/each}
		</select>
	</label>
	<label class={dropdownLabelClass} for="select-keyboard-layout">
		<span>Layout</span>
		<select
			class="select"
			id="select-keyboard-layout"
			name="Keyboard Layout Selection"
			bind:value={settingsState.layout}
			onchange={() => {
				setLayout();
			}}
		>
			{#each LayoutNames as name, i (name)}
				<option value={i}>
					{name}
				</option>
			{/each}
		</select>
	</label>
	<Switch
		checked={settingsState.showFingerColors}
		onCheckedChange={(e) => {
			onCheckedChange(e.checked);
		}}
	>
		<Switch.Control class="preset-filled-secondary-50-950 data-[state=checked]:preset-filled-secondary-500">
			<Switch.Thumb />
		</Switch.Control>
		<Switch.HiddenInput />
		<Switch.Label class="pl-2">Finger Colors</Switch.Label>
	</Switch>
</div>
<div class={linksClass}>
	<a
		href="https://colemakmods.github.io/mod-dh/"
		target="_blank"
		rel="noreferrer"
		aria-label="ColemakDH Layout"
		id="github-link"
	>
		<div class={linkClass}>
			<img width="20" height="20" src={githubDark} alt="GitHub" />
			<p class="label">ColemakDH</p>
		</div>
	</a>
	<a
		href="https://github.com/sunaku/enthium"
		target="_blank"
		rel="noreferrer"
		aria-label="Enthium Layout"
		id="github-link"
	>
		<div class={linkClass}>
			<img width="20" height="20" src={githubDark} alt="GitHub" />
			<p class="label">Enthium</p>
		</div>
	</a>
	<a
		href="https://github.com/GalileoBlues/Gallium"
		target="_blank"
		rel="noreferrer"
		aria-label="Gallium Layout"
		id="github-link"
	>
		<div class={linkClass}>
			<img width="20" height="20" src={githubDark} alt="GitHub" />
			<p class="label">Gallium</p>
		</div>
	</a>
	<a
		href="https://github.com/rdavison/graphite-layout/blob/main/README.md"
		target="_blank"
		rel="noreferrer"
		aria-label="Graphite Layout"
		id="github-link"
	>
		<div class={linkClass}>
			<img width="20" height="20" src={githubDark} alt="GitHub" />
			<p class="label">Graphite</p>
		</div>
	</a>
	<a
		href="https://github.com/kaievns/halmak"
		target="_blank"
		rel="noreferrer"
		aria-label="Halmak Layout"
		id="github-link"
	>
		<div class={linkClass}>
			<img width="20" height="20" src={githubDark} alt="GitHub" />
			<p class="label">Halmak</p>
		</div>
	</a>
	<a
		href="https://github.com/empressabyss/nordrassil/blob/main/README.md"
		target="_blank"
		rel="noreferrer"
		aria-label="Nordrassil Layout"
		id="github-link"
	>
		<div class={linkClass}>
			<img width="20" height="20" src={githubDark} alt="GitHub" />
			<p class="label">Nordrassil</p>
		</div>
	</a>
	<a
		href="https://www.reddit.com/r/KeyboardLayouts/comments/1g66ivi/hands_down_promethium_snth_meets_hd_silverengram/"
		target="_blank"
		rel="noreferrer"
		aria-label="Prometheum Layout"
		id="reddit-link"
	>
		<div class={linkClass}>
			<img width="20" height="20" src={reddit} alt="Reddit" />
			<p class="label">Prometheum</p>
		</div>
	</a>
	<a
		href="https://oxey.dev/sturdy/index.html"
		target="_blank"
		rel="noreferrer"
		aria-label="Sturdy Layout"
		id="github-link"
	>
		<div class={linkClass}>
			<img width="20" height="20" src={githubDark} alt="GitHub" />
			<p class="label">Sturdy</p>
		</div>
	</a>
	<a
		href="https://cyanophage.github.io/index.html#hd-vibranium"
		target="_blank"
		rel="noreferrer"
		aria-label="Vibranium Layout"
		id="github-link"
	>
		<div class={linkClass}>
			<img width="20" height="20" src={githubDark} alt="GitHub" />
			<p class="label">Vibranium</p>
		</div>
	</a>
</div>
