<script lang="ts">
	import {
		FontFamilyCSS,
		FontFamilyNames,
		FontSizeCSS,
		FontSizeNames,
		FontSpacingCSS,
		FontWeightCSS,
		FontWeightNames,
		SettingsDB,
	} from "$lib/store/SettingsDB.svelte";
	import { findStrings, replaceStrings } from "$lib/utilities/utils";

	let {
		font = $bindable(),
		idbSettings = $bindable(),
	}: {
		font: string;
		idbSettings: SettingsDB;
	} = $props();

	let selectedFontFamily: string = $state(findStrings(font ?? "", FontFamilyCSS));
	function setFontFamily(): void {
		font = replaceStrings(font, FontFamilyCSS, selectedFontFamily);
		idbSettings.font = font;
		idbSettings.isDirty = true;
	}

	let selectedFontSize: string = $state(findStrings(font ?? "", FontSizeCSS));
	function setFontSize(): void {
		font = replaceStrings(font, FontSizeCSS, selectedFontSize);
		idbSettings.font = font;
		idbSettings.isDirty = true;
	}

	let selectedFontWeight: string = $state(findStrings(font ?? "", FontWeightCSS));
	function setFontWeight(): void {
		font = replaceStrings(font, FontWeightCSS, selectedFontWeight);
		idbSettings.font = font;
		idbSettings.isDirty = true;
	}

	let fontSpacingNames = ["tighter", "tight", "normal", "wide", "wider", "widest"];
	let selectedFontSpacing: string = $state(findStrings(font ?? "", FontSpacingCSS));
	function setFontSpacing(): void {
		font = replaceStrings(font, FontSpacingCSS, selectedFontSpacing);
		idbSettings.font = font;
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
</script>

<!-- <button class="btn h-0 px-0" onclick={getAvailableFonts}>Get Available Fonts</button> -->
<article class={articleClassH}>
	<label class="label" for="font-family-select">
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
	<label class="label" for="font-size-select">
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
	<label class="label" for="font-weight-select">
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
	<label class="label" for="font-spacing-select">
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
	<span class="bg-transparent {font}">il1IL1 dbdqpq DBDQPQ ij., fgjty rnmrn RNMRN o0O</span>
	<span class="bg-transparent {font}">Sphinx of black quartz, judge my vow!</span>
</article>
