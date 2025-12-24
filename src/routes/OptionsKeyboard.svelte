<script lang="ts">
	import { KeyboardNames, LayoutNames } from "$lib/store/keyboard";
	import type { SettingsDB } from "$lib/store/SettingsDB.svelte";
	import { Switch } from "@skeletonlabs/skeleton-svelte";
	import { keyboardState } from "$lib/store/KeyboardState.svelte";

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
