<script lang="ts">
	import { BGColors, BorderColors, ColorIndex, ColorNames, getHourStrokeFill } from "$lib/store/Colors.svelte";
	import { LessonDB, ScopeIndex, ScopeNames, ScopeValues } from "$lib/store/LessonDB.svelte";
	import { LessonsDB } from "$lib/store/LessonsDB.svelte";
	import { FontFamilyCSS, FontFamilyNames, SettingsDB, SoundNames } from "$lib/store/SettingsDB.svelte";
	import { SourceIndex, SourceNames } from "$lib/store/SourceDB.svelte";
	import { KeyboardIndex, KeyboardNames, LayoutIndex, LayoutNames } from "$lib/store/keyboard";
	import { Dialog, Portal, SegmentedControl, Switch } from "@skeletonlabs/skeleton-svelte";
	import { setVolume } from "./PlaySounds.svelte";
	import MusicIcon from "@lucide/svelte/icons/music";
	import { CheckIcon, FunnelIcon } from "@lucide/svelte";
	import Counter from "./Counter.svelte";
	import OptionsCode from "./OptionsCode.svelte";
	import OptionsCustom from "./OptionsCustom.svelte";
	import { OtherNames } from "$lib/store/LessonsDB.svelte";
	import OptionsFilter from "./OptionsFilter.svelte";
	import { findStrings, replaceStrings } from "$lib/utilities/utils";

	type Props = {
		// Define the expected type for the prop
		currentLesson: LessonDB;
		idbLessons: LessonsDB;
		idbSettings: SettingsDB;
		idbCustomWords: string[];
		idbCodeChoices: boolean[];
		onLessonChanged: (
			settingsDB: SettingsDB,
			currentLesson: LessonDB,
			lessonsDB: LessonsDB,
			codeChoices?: boolean[],
			customWords?: string[]
		) => void;
		onSettingsChanged: (
			settingsDB: SettingsDB,
			currentLesson: LessonDB,
			lessonsDB: LessonsDB,
			codeChoices?: boolean[],
			customWords?: string[]
		) => void;
		colorIndex: ColorIndex;
		font: string;
	};
	let {
		currentLesson = $bindable(),
		idbLessons = $bindable(),
		idbSettings = $bindable(),
		idbCustomWords,
		idbCodeChoices,
		onLessonChanged,
		onSettingsChanged,
		colorIndex = $bindable(),
		font = $bindable(),
	}: Props = $props();

	// Avoid Aria whining using conditional display not popups
	type ConditionalDisplay = "fonts" | "filter" | "code" | "custom";
	let conditionalDisplay = $state<ConditionalDisplay>("fonts");

	let minimumWPM = $state(idbSettings.minimumWPM);
	function setMinimumWPM(newMinimumWPM: number): void {
		minimumWPM = newMinimumWPM;
		idbSettings.minimumWPM = newMinimumWPM;
		idbSettings.isDirty = true;
	}

	let minimumAccuracy = $state(idbSettings.minimumAccuracy);
	function setMinimumAccuracy(newMinimumAccuracy: number): void {
		minimumAccuracy = newMinimumAccuracy;
		idbSettings.minimumAccuracy = newMinimumAccuracy;
		idbSettings.isDirty = true;
	}

	let sounds = $state(idbSettings.sounds);
	function soundsChanged(e: Event, i: number) {
		sounds[i] = (e.target as HTMLInputElement).checked;
		idbSettings.sounds[i] = sounds[i];
		idbSettings.isDirty = true;
	}

	let volume = $state(idbSettings.volume);
	function setNewVolume(newVolume: number): void {
		// volume = newVolume;
		setVolume(newVolume);
		idbSettings.volume = newVolume;
		idbSettings.isDirty = true;
	}

	let selectedFontFamily: string = $state(findStrings(font ?? "", FontFamilyCSS));
	function setFontFamily(): void {
		font = replaceStrings(font, FontFamilyCSS, selectedFontFamily);
		idbSettings.isDirty = true;
	}

	let fontSizeCSS = [
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
	let fontSizeNames = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "8xl", "9xl"];
	let selectedFontSize: string = $state(findStrings(font ?? "", fontSizeCSS));
	function setFontSize(): void {
		font = replaceStrings(font, fontSizeCSS, selectedFontSize);
		idbSettings.isDirty = true;
	}

	let fontWeightCSS = [
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
	let fontWeightNames = [
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
	let selectedFontWeight: string = $state(findStrings(font ?? "", fontWeightCSS));
	function setFontWeight(): void {
		font = replaceStrings(font, fontWeightCSS, selectedFontWeight);
		idbSettings.isDirty = true;
	}

	let fontSpacingCSS = [
		"tracking-tighter ",
		"tracking-tight ",
		"tracking-normal ",
		"tracking-wide ",
		"tracking-wider ",
		"tracking-widest ",
	];
	let fontSpacingNames = ["tighter", "tight", "normal", "wide", "wider", "widest"];
	let selectedFontSpacing: string = $state(findStrings(font ?? "", fontSpacingCSS));
	function setFontSpacing(): void {
		font = replaceStrings(font, fontSpacingCSS, selectedFontSpacing);
		idbSettings.isDirty = true;
	}

	let selectedColor: ColorIndex = $state(idbSettings?.colorIndex ?? ColorIndex.fuchsia);
	function setColor(): void {
		idbSettings.colorIndex = selectedColor;
		colorIndex = selectedColor;
		idbSettings.isDirty = true;
	}

	let selectedKeyboard: KeyboardIndex = $state(idbSettings?.keyboard ?? KeyboardIndex.matrix);
	function setKeyboard(): void {
		idbSettings.keyboard = selectedKeyboard;
		idbSettings.isDirty = true;
	}

	let selectedLayout: LayoutIndex = $state(idbSettings?.layout ?? LayoutIndex.colemakDH);
	function setLayout(): void {
		idbSettings.layout = selectedLayout;
		idbSettings.isDirty = true;
	}

	function clearFont(): void {
		idbSettings.font = "";
		selectedFontFamily = findStrings(idbSettings.font ?? "", FontFamilyCSS);
		selectedFontSize = findStrings(idbSettings.font ?? "", fontSizeCSS);
		selectedFontWeight = findStrings(idbSettings.font ?? "", fontWeightCSS);
		selectedFontSpacing = findStrings(idbSettings.font ?? "", fontSpacingCSS);
		idbSettings.isDirty = true;
	}
	let keyBackspace = `\u232B`;

	let sourceValue = $state<string>(SourceNames[idbLessons.lessonIndex]);
	function setSource(newSource: string | null): void {
		sourceValue = newSource ?? SourceNames[SourceIndex.bigrams];
		let index = SourceNames.indexOf(sourceValue);
		idbLessons.lessonIndex = index;
		idbLessons.isDirty = true;
		onLessonChanged(idbSettings, currentLesson, idbLessons, idbCodeChoices, idbCustomWords);
	}

	// let scopeValue = $state<string>(ScopeNames[ScopeValues.indexOf(currentLesson.scope)]);
	// function setScope(newScope: string | null): void {
	// 	let scopeName = newScope ?? ScopeNames[ScopeIndex.top100];
	// 	let index = ScopeNames.indexOf(scopeName);
	// 	currentLesson.scope = ScopeValues[index];
	// 	scopeValue = scopeName;
	// 	idbLessons.isDirty = true;
	// }
	let scopeValue = $state<string>(currentLesson.scope.toString());
	function setScope(newScope: string | null): void {
		let scope = newScope ? Number(newScope) : ScopeValues[ScopeIndex.top50];
		currentLesson.scope = scope;
		scopeValue = scope.toString();
		idbLessons.isDirty = true;
	}

	let combination = $state<number>(currentLesson.combination);
	function setCombination(newCombination: number): void {
		combination = newCombination;
		currentLesson.combination = newCombination;
		idbLessons.isDirty = true;
	}
	let repetition = $state<number>(currentLesson.repetition);
	function setRepetition(newRepetition: number): void {
		repetition = newRepetition;
		currentLesson.repetition = newRepetition;
		idbLessons.isDirty = true;
	}

	const newCodeChoices = [...idbCodeChoices];
	function codeChanged(choice: boolean, i: number): void {
		newCodeChoices[i] = choice;
	}

	// svelte-ignore non_reactive_update
	let customString = idbCustomWords.join(" ");
	function customChanged(newCustom: string): void {
		customString = newCustom;
	}

	function filterChanged(newFilter: string): void {
		currentLesson.filter = newFilter;
	}

	function saveSettings(): void {
		const customArray = customString.split(/\s+/);
		onSettingsChanged(idbSettings, currentLesson, idbLessons, newCodeChoices, customArray);
	}

	const animBackdrop =
		"transition transition-discrete opacity-0 starting:data-[state=open]:opacity-0 data-[state=open]:opacity-100";
	const animModal =
		"transition transition-discrete opacity-0 -translate-x-full starting:data-[state=open]:opacity-0 starting:data-[state=open]:-translate-x-full data-[state=open]:opacity-100 data-[state=open]:translate-x-0";

	let contentClass = "space-y-4 card backdrop-blur-lg shadow-xl";
	let cardClass = $derived(
		"card p-4 backdrop-blur-xl space-y-4 border-2 "
			+ BorderColors[colorIndex]
			+ " "
			+ BGColors[colorIndex]
			+ " rounded-lg"
	);
	const iconButtonClass =
		"focus:ring-opacity-50 rounded-full text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-900 focus:outline-none";
	const articleClassV = "flex flex-col justify-center space-y-2";
	const articleClassH = "flex flex-row justify-stretch space-x-2";
</script>

<!-- h-svh w-svw
 size-dvw -->
<Dialog restoreFocus={true} onOpenChange={saveSettings}>
	<Dialog.Trigger class="btn"><h1 style="font-size: 3em">🧜‍♀️</h1></Dialog.Trigger>
	<Portal>
		<Dialog.Backdrop class="fixed top-10 left-0 w-full h-full z-50 transition transition-discrete {animBackdrop}" />
		<Dialog.Positioner class="fixed top-10 left-0 w-full h-full z-50 flex flex-col justify-center">
			<Dialog.Content class="{contentClass} w-full {animModal}">
				<header class="flex justify-between">
					<Dialog.Title class="text-2xl font-bold">Settings</Dialog.Title>
					<Dialog.CloseTrigger class="btn preset-tonal">
						<CheckIcon class="size-4" />
					</Dialog.CloseTrigger>
				</header>
				<article class="flex place-content-evenly w-full gap-2">
					<div class={cardClass}>
						<header class="card-header">Source</header>
						<article class={articleClassV}>
							<SegmentedControl
								value={sourceValue}
								onValueChange={(details) => setSource(details.value)}
								orientation="vertical"
							>
								<SegmentedControl.Control>
									<SegmentedControl.Indicator />
									{#each SourceNames as name (name)}
										{#if name == OtherNames.code}
											<SegmentedControl.Item value={name}>
												<SegmentedControl.ItemText
													>Code <button
														class={iconButtonClass}
														onclick={() => {
															conditionalDisplay =
																conditionalDisplay !== "code" ? "code" : "fonts";
															setSource(name);
														}}
														>🤖
													</button>
												</SegmentedControl.ItemText>
												<SegmentedControl.ItemHiddenInput />
											</SegmentedControl.Item>
										{:else if name == OtherNames.custom}
											<SegmentedControl.Item value={name}>
												<SegmentedControl.ItemText
													>Custom <button
														class={iconButtonClass}
														onclick={() => {
															conditionalDisplay =
																conditionalDisplay !== "custom" ? "custom" : "fonts";
															setSource(name);
														}}
														>🛠️
													</button>
												</SegmentedControl.ItemText>
												<SegmentedControl.ItemHiddenInput />
											</SegmentedControl.Item>
										{:else}
											<SegmentedControl.Item value={name}>
												<SegmentedControl.ItemText>{name}</SegmentedControl.ItemText>
												<SegmentedControl.ItemHiddenInput />
											</SegmentedControl.Item>
										{/if}
									{/each}
								</SegmentedControl.Control>
							</SegmentedControl>
						</article>
					</div>
					<div class={cardClass}>
						<header class="card-header">Scope</header>
						<article class={articleClassV}>
							<SegmentedControl
								value={scopeValue}
								onValueChange={(details) => setScope(details.value)}
								orientation="vertical"
							>
								<SegmentedControl.Control>
									<SegmentedControl.Indicator />
									{#each ScopeNames as name, i (name)}
										<SegmentedControl.Item value={ScopeValues[i].toString()}>
											<SegmentedControl.ItemText
												>Top&nbsp;{ScopeValues[i]}</SegmentedControl.ItemText
											>
											<SegmentedControl.ItemHiddenInput />
										</SegmentedControl.Item>
									{/each}
								</SegmentedControl.Control>
							</SegmentedControl>
						</article>
					</div>
					<div class={cardClass}>
						<header class="card-header">Generate</header>
						<article class={articleClassV}>
							<Counter
								name="Combination"
								minCounter={1}
								stepCounter={1}
								count={combination}
								onChange={setCombination}
								{colorIndex}
							/>
							<Counter
								name="Repetition"
								stepCounter={1}
								minCounter={1}
								count={repetition}
								onChange={setRepetition}
								{colorIndex}
							/>
							<div>
								Filter<button
									class={iconButtonClass}
									onclick={() => {
										conditionalDisplay = conditionalDisplay !== "filter" ? "filter" : "fonts";
									}}
								>
									<FunnelIcon class={getHourStrokeFill(colorIndex)} size={18} />
								</button>
							</div>
						</article>
					</div>
					<div class={cardClass}>
						<header class="card-header">Goals</header>
						<article class={articleClassV}>
							<Counter
								name="Minimum&nbsp;WPM"
								minCounter={0}
								maxCounter={400}
								stepCounter={10}
								onChange={setMinimumWPM}
								bind:count={minimumWPM}
								{colorIndex}
							/>
							<Counter
								name="Minimum&nbsp;Accuracy"
								minCounter={0}
								maxCounter={100}
								onChange={setMinimumAccuracy}
								bind:count={minimumAccuracy}
								{colorIndex}
							/>
						</article>
					</div>
					<div class={cardClass}>
						<header class="card-header">Sounds</header>
						<article class={articleClassV}>
							<Counter
								name="Volume"
								minCounter={0}
								maxCounter={100}
								stepCounter={5}
								count={volume}
								onChange={setNewVolume}
								{colorIndex}
							></Counter>

							{#each SoundNames as name, i (name)}
								<Switch checked={sounds[i]} onchange={(e) => soundsChanged(e, i)}>
									<Switch.Control
										class="preset-filled-secondary-50-950 data-[state=checked]:preset-filled-secondary-500"
									>
										<Switch.Thumb>
											<Switch.Context>
												{#snippet children(switch_)}
													{#if switch_().checked}
														<MusicIcon class="size-3" />
													{/if}
												{/snippet}
											</Switch.Context>
										</Switch.Thumb>
									</Switch.Control>
									<Switch.Label class="pl-2">{name}</Switch.Label>

									<Switch.HiddenInput />
								</Switch>
							{/each}
						</article>
					</div>
				</article>
				<article class="flex flex-col gap-2">
					<div class={cardClass}>
						<article class={articleClassH}>
							<label class="label" for="color-select">
								<span>Color</span>
								<select
									class="select"
									id="color-select"
									name="Color Selection"
									bind:value={selectedColor}
									onchange={() => {
										setColor();
									}}
								>
									{#each ColorNames as name, i (name)}
										<option value={i}>
											{name}
										</option>
									{/each}
								</select>
							</label>
							<label class="label" for="select-keyboard">
								<span>Keyboard</span>
								<select
									class="select"
									id="select-keyboard"
									name="Keyboard Selection"
									bind:value={selectedKeyboard}
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
							<label class="label" for="select-keyboard-layout">
								<span>Layout</span>
								<select
									class="select"
									id="select-keyboard-layout"
									name="Keyboard Layout Selection"
									bind:value={selectedLayout}
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
						</article>
					</div>
				</article>
				<article class="flex flex-col justify-stretch gap-2">
					{#if conditionalDisplay === "fonts"}
						<div class={cardClass}>
							<header class="card-header">Font</header>
							<article class={articleClassH}>
								<button class="btn h-0 px-0" onclick={clearFont}>Clear Font {keyBackspace}</button>
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
										{#each fontSizeCSS as name, i (name)}
											<option value={name}>
												{fontSizeNames[i]}
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
										{#each fontWeightCSS as name, i (name)}
											<option value={name}>
												{fontWeightNames[i]}
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
										{#each fontSpacingCSS as name, i (name)}
											<option value={name}>
												{fontSpacingNames[i]}
											</option>
										{/each}
									</select>
								</label>
							</article>
							<header class="card-header">Legibility Test</header>
							<article class={articleClassV}>
								<span class="bg-transparent {font}"
									>il1IL1 dbdqpq DBDQPQ ij., fgjty rnmrn RNMRN o0O</span
								>
								<span class="bg-transparent {font}">Sphinx of black quartz, judge my vow!</span>
							</article>
						</div>
					{:else if conditionalDisplay === "filter"}
						<section class="flex place-content-between gap-2">
							<div class={cardClass}>
								<header class="card-header">Filter</header>
								<article class={articleClassH}>
									<OptionsFilter filter={currentLesson.filter} {filterChanged}></OptionsFilter>
								</article>
							</div>
						</section>
					{:else if conditionalDisplay === "code"}
						<section class="flex place-content-between gap-2">
							<div>
								<div class={cardClass}>
									<header class="card-header">Code</header>
									<article class={articleClassH}>
										<OptionsCode {idbCodeChoices} {codeChanged}></OptionsCode>
									</article>
								</div>
							</div>
						</section>
					{:else if conditionalDisplay === "custom"}
						<section class="flex place-content-between gap-2">
							<div>
								<div class={cardClass}>
									<header class="card-header">Custom</header>
									<article class={articleClassH}>
										<OptionsCustom {customString} {customChanged}></OptionsCustom>
									</article>
								</div>
							</div>
						</section>
					{/if}
				</article>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>
