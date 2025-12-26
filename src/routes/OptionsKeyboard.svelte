<script lang="ts">
	import githubDark from "$lib/images/github-mark-white.svg";
	import { KeyboardNames, LayoutNames } from "$lib/store/keyboard";
	import { keyboardState } from "$lib/store/KeyboardState.svelte";
	import type { SettingsDB } from "$lib/store/SettingsDB.svelte";
	import { Switch } from "@skeletonlabs/skeleton-svelte";

	type Props = {
		idbSettings: SettingsDB;
	};
	let { idbSettings = $bindable<SettingsDB>() }: Props = $props();

	function setKeyboard(): void {
		// console.log("setKeyboard", idbSettings.keyboard, "->", keyboardState.keyboard);
		idbSettings.keyboard = keyboardState.keyboard;
		idbSettings.isDirty = true;
	}

	function setLayout(): void {
		// console.log("setLayout", idbSettings.layout, "->", keyboardState.layout);
		idbSettings.layout = keyboardState.layout;
		idbSettings.isDirty = true;
	}

	// eslint-disable-next-line svelte/no-unused-svelte-ignore
	// svelte-ignore state_referenced_locally
	const onCheckedChange = (checked: boolean) => {
		keyboardState.showFingerColors = checked;
		idbSettings.showFingerColors = checked;
		idbSettings.isDirty = true;
	};

	const dropdownLabelClass = "label w-full max-w-48";
	const linksClass = "flex flex-row flex-wrap justify-stretch space-x-4";
	const linkClass = "flex items-center space-x-1";
</script>

<label class={dropdownLabelClass} for="select-keyboard">
	<span>Keyboard</span>
	<select
		class="select"
		id="select-keyboard"
		name="Keyboard Selection"
		bind:value={keyboardState.keyboard}
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
		bind:value={keyboardState.layout}
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
	checked={keyboardState.showFingerColors}
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
</div>
