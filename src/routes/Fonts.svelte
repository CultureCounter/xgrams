<script lang="ts">
	import { SettingsDB } from "$lib/store/SettingsDB.svelte";
	import { settingsState } from "$lib/store/SettingsState.svelte";
	import { findStrings, replaceStrings } from "$lib/utilities/utils";

	let {
		idbSettings = $bindable(),
	}: {
		idbSettings: SettingsDB;
	} = $props();

	export const FontFamilyCSS = [
		"font-sans ",
		"font-arial ",
		"font-dejaVuSans ",
		"font-notoSans ",
		"font-roboto ",
		"font-segoeUI ",
		"font-tahoma ",
		"font-verdana ",
		"font-serif ",
		"font-century ",
		"font-dejaVuSerif ",
		"font-garamond ",
		"font-georgia ",
		"font-notoSerif ",
		"font-palatino ",
		"font-timesNewRoman ",
		"font-mono ",
		"font-cascadiaMono ",
		"font-courierNew ",
		"font-ibmPlexMono ",
		"font-robotoMono ",
		"font-sourceCodePro ",
		"font-ubuntuMono ",
	];

	export const FontFamilyNames = [
		"---Sans-Serif---",
		"Arial",
		"DejaVu Sans",
		"Noto Sans",
		"Roboto",
		"Segoe UI",
		"Tahoma",
		"Verdana",
		"---Serif---",
		"Century",
		"DejaVu Serif",
		"Garamond",
		"Georgia",
		"Noto Serif",
		"Palatino Linotype",
		"Times New Roman",
		"---Mono---",
		"Cascadia Mono",
		"Courier New",
		"IBM Plex Mono",
		"Roboto Mono",
		"Source Code Pro",
		"Ubuntu Mono",
	];
	export const FontSizeCSS = [
		"text-xs ",
		"text-sm ",
		"text-base ",
		"text-lg ",
		"text-xl ",
		"text-2xl ",
		"text-3xl ",
		"text-4xl ",
		"text-5xl ",
		"text-6xl ",
		"text-7xl ",
		"text-8xl ",
		"text-9xl ",
	];
	export const FontSizeNames = [
		"xs",
		"sm",
		"base",
		"lg",
		"xl",
		"2xl",
		"3xl",
		"4xl",
		"5xl",
		"6xl",
		"7xl",
		"8xl",
		"9xl",
	];
	export const FontWeightCSS = [
		"font-thin ",
		"font-extralight ",
		"font-light ",
		"font-normal ",
		"font-medium ",
		"font-semibold ",
		"font-bold ",
		"font-extrabold ",
		"font-black ",
	];
	export const FontWeightNames = [
		"thin",
		"extra light",
		"light",
		"normal",
		"medium",
		"bold",
		"semibold",
		"extrabold",
		"black",
	];
	export const FontSpacingCSS = [
		"tracking-tighter ",
		"tracking-tight ",
		"tracking-normal ",
		"tracking-wide ",
		"tracking-wider ",
		"tracking-widest ",
	];

	let selectedFontFamily: string = $state(findStrings(settingsState.font ?? "", FontFamilyCSS));
	function setFontFamily(): void {
		settingsState.font = replaceStrings(settingsState.font, FontFamilyCSS, selectedFontFamily);
		idbSettings.font = settingsState.font;
		idbSettings.isDirty = true;
	}

	let selectedFontSize: string = $state(findStrings(settingsState.font ?? "", FontSizeCSS));
	function setFontSize(): void {
		settingsState.font = replaceStrings(settingsState.font, FontSizeCSS, selectedFontSize);
		idbSettings.font = settingsState.font;
		idbSettings.isDirty = true;
	}

	let selectedFontWeight: string = $state(findStrings(settingsState.font ?? "", FontWeightCSS));
	function setFontWeight(): void {
		settingsState.font = replaceStrings(settingsState.font, FontWeightCSS, selectedFontWeight);
		idbSettings.font = settingsState.font;
		idbSettings.isDirty = true;
	}

	let fontSpacingNames = ["tighter", "tight", "normal", "wide", "wider", "widest"];
	let selectedFontSpacing: string = $state(findStrings(settingsState.font ?? "", FontSpacingCSS));
	function setFontSpacing(): void {
		settingsState.font = replaceStrings(settingsState.font, FontSpacingCSS, selectedFontSpacing);
		idbSettings.font = settingsState.font;
		idbSettings.isDirty = true;
	}

	// async function getAvailableFonts() {
	// 	console.log("getAvailableFonts");
	// 	try {
	// 		// A permission prompt will appear for the user

	// 		window.queryLocalFonts().then((fonts) => {
	// 			console.log("Available Fonts:", fonts.length);
	// 			// console.log("Family | Full Name | Styles");
	// 			let currentFont = "";
	// 			let systemFonts: string[] = [];
	// 			// eslint-disable-next-line svelte/prefer-svelte-reactivity
	// 			const systemFontNames = new Map<string, string>();
	// 			for (const fontData of fonts) {
	// 				let family = fontData.family;
	// 				let fullName = fontData.fullName;
	// 				let style = fontData.style;
	// 				console.log(family, "|", fullName, "|", style);
	// 				if (family.includes("Mono") && family !== currentFont) {
	// 					currentFont = family;
	// 					systemFonts.push(family);
	// 					systemFontNames.set(family, style);
	// 				}
	// 			}
	// 			console.log("systemFonts", systemFonts.length, systemFonts);
	// 			console.log("systemFontNames", systemFontNames.size, systemFontNames);
	// 		});
	// 	} catch (err) {
	// 		console.error("Could not access local fonts:", (err as Error).message);
	// 	}
	// }

	const articleClassV = "flex flex-col justify-center space-y-2";
	const articleClassH = "flex flex-row justify-stretch space-x-2";
	const dropdownLabelClass = "label w-full max-w-48";
</script>

<!-- <button class="btn h-0 px-0" onclick={getAvailableFonts}>Get Available Fonts</button> -->
<article class={articleClassH}>
	<label class={dropdownLabelClass} for="font-family-select">
		<span>Font Family</span>
		<select
			class="select"
			id="font-family-select"
			name="Font Family"
			bind:value={selectedFontFamily}
			onchange={() => {
				setFontFamily();
			}}
		>
			{#each FontFamilyCSS as name, i (name)}
				<option value={name}>
					{FontFamilyNames[i]}
				</option>
			{/each}
		</select>
	</label>
	<label class={dropdownLabelClass} for="font-size-select">
		<span>Font Size</span>
		<select
			class="select"
			id="font-size-select"
			name="Font Size"
			bind:value={selectedFontSize}
			onchange={() => {
				setFontSize();
			}}
		>
			{#each FontSizeCSS as name, i (name)}
				<option value={name}>
					{FontSizeNames[i]}
				</option>
			{/each}
		</select>
	</label>
	<label class={dropdownLabelClass} for="font-weight-select">
		<span>Font Weight</span>
		<select
			class="select"
			id="font-weight-select"
			name="Font Weight"
			bind:value={selectedFontWeight}
			onchange={() => {
				setFontWeight();
			}}
		>
			{#each FontWeightCSS as name, i (name)}
				<option value={name}>
					{FontWeightNames[i]}
				</option>
			{/each}
		</select>
	</label>
	<label class={dropdownLabelClass} for="font-spacing-select">
		<span>Font Spacing</span>
		<select
			class="select"
			id="font-spacing-select"
			name="Font Spacing"
			bind:value={selectedFontSpacing}
			onchange={() => {
				setFontSpacing();
			}}
		>
			{#each FontSpacingCSS as name, i (name)}
				<option value={name}>
					{fontSpacingNames[i]}
				</option>
			{/each}
		</select>
	</label>
</article>
<header class="card-header">Font Legibility Test</header>
<article class={articleClassV}>
	<span class="bg-transparent {settingsState.font} align-middle"
		>il1IL1 dbdqpq DBDQPQ ij., fgjty rnmrn RNMRN o0O ABCDEFGHIJKLMNOPQRSTUVWXYZ</span
	>
	<span class="bg-transparent {settingsState.font} align-middle"
		>Sphinx of black quartz, judge my vow! 1234567890 abcdefghijklmnopqrstuvwxyz</span
	>
</article>
