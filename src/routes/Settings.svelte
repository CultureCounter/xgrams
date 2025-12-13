<script lang="ts">
	import { LessonState, ScopeIndex, ScopeNames, ScopeValues } from "$lib/store/LessonXG.svelte.ts";
	import { LessonsXG } from "$lib/store/LessonsXG.svelte";
	import {
		ColorIndex,
		ColorNames,
		FontFamilyCSS,
		FontFamilyNames,
		SettingsXG,
		SoundNames,
	} from "$lib/store/SettingsXG.svelte";
	import { SourceIndex, SourceNames } from "$lib/store/SourceXG.svelte";
	import { OtherIndex, OtherNames } from "$lib/store/otherWords.svelte";
	import { KeyboardIndex, KeyboardNames, LayoutIndex, LayoutNames } from "$lib/store/keyboard";
	import { Dialog, Portal, SegmentedControl, Switch } from "@skeletonlabs/skeleton-svelte";
	import { setVolume } from "./PlaySounds.svelte";
	import MusicIcon from "@lucide/svelte/icons/music";
	import { CheckIcon } from "@lucide/svelte";

	import Counter from "./Counter.svelte";
	import OptionsCode from "./OptionsCode.svelte";
	import OptionsCustom from "./OptionsCustom.svelte";
	import OptionsFilter from "./OptionsFilter.svelte";

	let {
		currentLesson = $bindable<LessonState>(),
		idbLessons = $bindable<LessonsXG>(),
		idbSettings = $bindable<SettingsXG>(),
		idbCustomWords = $bindable<string[]>(),
		idbCodeChoices = $bindable<boolean[]>(),
		onLessonChanged,
		onSettingsChanged,
	} = $props();

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
			target = target.replace(candidate, "");
		}
		target += add;
		return target;
	}

	/**
	 * Find in space delimited `target` one of `candidates`
	 * @param target
	 * @param removals
	 * @param add
	 * @returns string `candidate` or ''
	 */
	function findStrings(target: string, candidates: string[]): string {
		for (let candidate of candidates) {
			if (target.includes(candidate)) {
				return candidate;
			}
		}
		return "";
	}

	type ConditionalDisplay = "fonts" | "filter" | "code" | "custom";
	let conditionalDisplay = $state<ConditionalDisplay>("fonts");

	let selectedFontFamily: string = $state(findStrings(idbSettings.font ?? "", FontFamilyCSS));
	function setFontFamily(): void {
		idbSettings.font = replaceStrings(idbSettings.font, FontFamilyCSS, selectedFontFamily);
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
	let selectedFontSize: string = $state(findStrings(idbSettings.font ?? "", fontSizeCSS));
	function setFontSize(): void {
		idbSettings.font = replaceStrings(idbSettings.font, fontSizeCSS, selectedFontSize);
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
	let selectedFontWeight: string = $state(findStrings(idbSettings.font ?? "", fontWeightCSS));
	function setFontWeight(): void {
		idbSettings.font = replaceStrings(idbSettings.font, fontWeightCSS, selectedFontWeight);
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
	let selectedFontSpacing: string = $state(findStrings(idbSettings.font ?? "", fontSpacingCSS));
	function setFontSpacing(): void {
		idbSettings.font = replaceStrings(idbSettings.font, fontSpacingCSS, selectedFontSpacing);
		idbSettings.isDirty = true;
	}

	let selectedColor: ColorIndex = $state(idbSettings?.color ?? ColorIndex.fuchsia);
	function setColor(): void {
		idbSettings.color = selectedColor;
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

	function soundsChanged(e: Event, i: number) {
		idbSettings.sounds[i] = (e.target as HTMLInputElement).checked;
		idbSettings.isDirty = true;
	}

	let sourceValue = $state<string>(SourceNames[idbLessons.lessonIndex]);
	function setSource(newSource: string | null): void {
		sourceValue = newSource ?? SourceNames[SourceIndex.bigrams];
		let index = SourceNames.indexOf(sourceValue);
		idbLessons.lessonIndex = index;
		idbLessons.isDirty = true;
		onLessonChanged();
	}

	let scopeValue = $state<string>(ScopeNames[ScopeValues.indexOf(currentLesson.scope)]);
	function setScope(newScope: string | null): void {
		let scopeName = newScope ?? ScopeNames[ScopeIndex.top100];
		let index = ScopeNames.indexOf(scopeName);
		currentLesson.scope = ScopeValues[index];
		scopeValue = scopeName;
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

	let volume = idbSettings?.volume ?? 50;
	function setNewVolume(newVolume: number): void {
		// volume = newVolume;
		setVolume(newVolume);
		idbSettings.volume = newVolume;
		idbSettings.isDirty = true;
	}
	function getSoundChecked(i: number): boolean {
		return idbSettings.sounds[i];
	}
	function saveSettings(): void {
		onSettingsChanged();
	}

	const animBackdrop =
		"transition transition-discrete opacity-0 starting:data-[state=open]:opacity-0 data-[state=open]:opacity-100";
	const animModal =
		"transition transition-discrete opacity-0 -translate-x-full starting:data-[state=open]:opacity-0 starting:data-[state=open]:-translate-x-full data-[state=open]:opacity-100 data-[state=open]:translate-x-0";

	const card1Classes = "card p-4 preset-outlined-primary-500 space-y-4";
	// const card3Classes = 'card bg-noise bg-surface-50-950 border-[1px] border-surface-200-800 p-8';
	// const card2Classes =
	// 	'card preset-filled-surface-100-900 border-[1px] border-surface-200-800 card-hover divide-surface-200-800 block max-w-md divide-y overflow-hidden';
	const cardClass = card1Classes;
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
		<Dialog.Backdrop
			class="fixed inset-0 z-50 bg-surface-50-950/50 transition transition-discrete {animBackdrop}"
		/>
		<Dialog.Positioner class="fixed inset-0 z-50 flex flex-col justify-center">
			<Dialog.Content class="size-min space-y-4 card bg-surface-100-900 shadow-xl {animModal}">
				<header class="flex justify-between">
					<Dialog.Title class="text-2xl font-bold">Settings</Dialog.Title>
					<Dialog.CloseTrigger class="btn preset-tonal">
						<CheckIcon class="size-4" />
					</Dialog.CloseTrigger>
				</header>
				<article class="flex place-content-between gap-2">
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
										{#if name == OtherNames[OtherIndex.code]}
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
										{:else if name == OtherNames[OtherIndex.custom]}
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
										<SegmentedControl.Item value={name}>
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
							/>
							<Counter
								name="Repetition"
								stepCounter={1}
								minCounter={1}
								count={repetition}
								onChange={setRepetition}
							/>
							<div>
								Filter<button
									class={iconButtonClass}
									onclick={() => {
										conditionalDisplay = conditionalDisplay !== "filter" ? "filter" : "fonts";
									}}
									>🌪️
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
								onChange={(e: CustomEvent) => {
									idbSettings.minimumWPM = e.detail as number;
									idbLessons.isDirty = true;
								}}
								count={idbSettings.minimumWPM}
							/>
							<Counter
								name="Minimum&nbsp;Accuracy"
								minCounter={0}
								maxCounter={100}
								onChange={(e: CustomEvent) => {
									idbSettings.minimumAccuracy = e.detail as number;
									idbLessons.isDirty = true;
								}}
								count={idbSettings.minimumAccuracy}
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
							></Counter>

							{#each SoundNames as name, i (name)}
								<Switch checked={getSoundChecked(i)} onchange={(e) => soundsChanged(e, i)}>
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
						<header class="card-header pt-3">Keyboard</header>
						<article>
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
						</article>
						<header class="card-header pt-3">Layout</header>
						<article>
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
						</article>
					</div>
				</article>
				<article class="flex flex-col justify-stretch gap-2">
					{#if conditionalDisplay === "fonts"}
						<div class={cardClass}>
							<header class="card-header">Font</header>
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
								<span class="bg-transparent {idbSettings.font ?? ''}"
									>il1IL1 dbdqpq DBDQPQ ij., fgjty rnmrn RNMRN o0O</span
								>
								<span class="bg-transparent {idbSettings.font ?? ''}"
									>Sphinx of black quartz, judge my vow!</span
								>
							</article>
						</div>
					{:else if conditionalDisplay === "filter"}
						<section class="flex place-content-between gap-2">
							<div class={cardClass}>
								<header class="card-header">Filter</header>
								<article class={articleClassH}>
									<OptionsFilter {currentLesson}></OptionsFilter>
								</article>
							</div>
						</section>
					{:else if conditionalDisplay === "code"}
						<section class="flex place-content-between gap-2">
							<div>
								<div class={cardClass}>
									<header class="card-header">Code</header>
									<article class={articleClassH}>
										<OptionsCode {idbCodeChoices}></OptionsCode>
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
										<OptionsCustom {currentLesson}></OptionsCustom>
									</article>
								</div>
							</div>
						</section>
					{/if}
				</article>
				<div class="flex place-content-center">
					<div class="loader">Loading...</div>
				</div>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>
