<script lang="ts">
	import {
		BGColors,
		BorderColors,
		ColorIndex,
		ColorNames,
		getHourStrokeFill,
		HourStrokeColors,
	} from "$lib/store/Colors.svelte";
	import { LessonDB, ScopeIndex, ScopeNames, ScopeValues } from "$lib/store/LessonDB.svelte";
	import { LessonsDB } from "$lib/store/LessonsDB.svelte";
	import { SettingsDB, SoundIndex, SoundNames } from "$lib/store/SettingsDB.svelte";
	import { SourceIndex, SourceNames } from "$lib/store/SourceDB.svelte";
	import { KeyboardIndex, KeyboardNames, LayoutIndex, LayoutNames } from "$lib/store/keyboard";
	import { Dialog, Portal, SegmentedControl, Switch } from "@skeletonlabs/skeleton-svelte";
	import { setVolume } from "./PlaySounds.svelte";
	import MusicIcon from "@lucide/svelte/icons/music";
	import PawPrintIcon from "@lucide/svelte/icons/paw-print";
	import BugIcon from "@lucide/svelte/icons/bug";
	import RabbitIcon from "@lucide/svelte/icons/rabbit";
	import TurtleIcon from "@lucide/svelte/icons/turtle";
	import PartyPopperIcon from "@lucide/svelte/icons/party-popper";

	import CheckIcon from "@lucide/svelte/icons/check";
	import FunnelIcon from "@lucide/svelte/icons/funnel";
	import InfoIcon from "@lucide/svelte/icons/info";
	import Dice2Icon from "@lucide/svelte/icons/dice-2";
	import Dice3Icon from "@lucide/svelte/icons/dice-3";
	import Dice4Icon from "@lucide/svelte/icons/dice-4";
	import Dice5Icon from "@lucide/svelte/icons/dice-5";
	import Dice6Icon from "@lucide/svelte/icons/dice-6";
	import PandaIcon from "@lucide/svelte/icons/panda";
	import BookOpenTextIcon from "@lucide/svelte/icons/book-open-text";

	import Counter from "./Counter.svelte";
	import Fonts from "./Fonts.svelte";
	import OptionsCode from "./OptionsCode.svelte";
	import OptionsCustom from "./OptionsCustom.svelte";
	import OptionsFilter from "./OptionsFilter.svelte";
	import { OtherNames } from "$lib/store/LessonsDB.svelte";
	import FontInfo from "./FontInfo.svelte";

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
	type ConditionalDisplay = "fonts" | "fontInfo" | "filter" | "code" | "custom";
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
	function soundsChanged(isChecked: boolean, i: number) {
		sounds[i] = isChecked;
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

	let selectedColor: ColorIndex = $state(idbSettings?.colorIndex ?? ColorIndex.fuchsia);
	function setColor(): void {
		colorIndex = selectedColor;
		idbSettings.colorIndex = selectedColor;
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

	let sourceValue = $state<string>(SourceNames[idbLessons.lessonIndex]);
	function setSource(newSource: string | null): void {
		sourceValue = newSource ?? SourceNames[SourceIndex.bigrams];
		let index = SourceNames.indexOf(sourceValue);
		idbLessons.lessonIndex = index;
		idbLessons.isDirty = true;
		onLessonChanged(idbSettings, currentLesson, idbLessons, idbCodeChoices, idbCustomWords);
	}

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

	// svelte-ignore state_referenced_locally
	const newCodeChoices = [...idbCodeChoices];
	function codeChanged(choice: boolean, i: number): void {
		newCodeChoices[i] = choice;
	}

	// svelte-ignore state_referenced_locally
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

	// let contentClass =
	// "card w-full flex-1 overflow-y-auto flex-col content-start justify-center backdrop-blur-lg shadow-xl pt-16";
	let contentClass = "card space-y-4 backdrop-blur-lg shadow-xl";
	//   3xs:bg-lime-600 2xs:text-yellow-100 xs:bg-digital-blue-200 sm:bg-digital-blue-300 md:bg-digital-blue-400 lg:bg-digital-blue-500 xl:bg-digital-blue-600 2xl:bg-amber-700 3xl:bg-lime-800
	let cardClass = $derived(
		"card backdrop-blur-xl p-2 space-x-1 space-y-2 border-2 "
			+ BorderColors[colorIndex]
			+ " "
			+ BGColors[colorIndex]
			+ " rounded-lg"
	);
	const clickButtonClass =
		"btn backdrop-blur-xl space-y-4 border-2 "
		+ BorderColors[colorIndex]
		+ " "
		+ BGColors[colorIndex]
		+ " rounded-lg";

	const iconButtonClass =
		"focus:ring-opacity-50 rounded-full text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-900 focus:outline-none";
	const articleClassV = "flex flex-col justify-center space-y-2";
	const articleClassH = "flex flex-row justify-stretch space-x-2";
</script>

<Dialog restoreFocus={true} onOpenChange={saveSettings}>
	<Dialog.Trigger class="btn"><h1 style="font-size: 3em">🧜‍♀️</h1></Dialog.Trigger>
	<Portal>
		<Dialog.Backdrop class="z-50 transition transition-discrete {animBackdrop}" />
		<Dialog.Positioner class="fixed top-24 left-0 w-full z-50 ">
			<Dialog.Content class="{contentClass} {animModal}">
				<header class="flex justify-between">
					<Dialog.Title class="text-2xl font-bold">Settings</Dialog.Title>
					<Dialog.CloseTrigger class="btn preset-tonal">
						<CheckIcon class="size-8 {HourStrokeColors[ColorIndex.emerald]}" />
					</Dialog.CloseTrigger>
				</header>
				<article class="flex place-content-evenly w-full gap-2 space-y-2">
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
												<SegmentedControl.ItemText>
													<span class="hidden md:inline">Code </span>
													<button
														class={iconButtonClass}
														onclick={() => {
															conditionalDisplay = "code";
															setSource(name);
														}}
														>🤖
													</button>
												</SegmentedControl.ItemText>
												<SegmentedControl.ItemHiddenInput />
											</SegmentedControl.Item>
										{:else if name == OtherNames.custom}
											<SegmentedControl.Item value={name}>
												<SegmentedControl.ItemText>
													<span class="hidden md:inline">Custom </span>
													<button
														class={iconButtonClass}
														onclick={() => {
															conditionalDisplay = "custom";
															setSource(name);
														}}
														>🛠️
													</button>
												</SegmentedControl.ItemText>
												<SegmentedControl.ItemHiddenInput />
											</SegmentedControl.Item>
										{:else}
											<SegmentedControl.Item value={name}>
												<SegmentedControl.ItemText>
													<span class="hidden md:inline">{name}</span>
													{#if name == SourceNames[SourceIndex.bigrams]}
														<span class="md:hidden"><Dice2Icon /></span>
													{:else if name == SourceNames[SourceIndex.trigrams]}
														<span class="md:hidden"><Dice3Icon /></span>
													{:else if name == SourceNames[SourceIndex.tetragrams]}
														<span class="md:hidden"><Dice4Icon /></span>
													{:else if name == SourceNames[SourceIndex.pentagrams]}
														<span class="md:hidden"><Dice5Icon /></span>
													{:else if name == SourceNames[SourceIndex.hexagrams]}
														<span class="md:hidden"><Dice6Icon /></span>
													{:else if name == SourceNames[SourceIndex.pangrams]}
														<span class="md:hidden"><PandaIcon /></span>
													{:else if name == SourceNames[SourceIndex.words]}
														<span class="md:hidden"><BookOpenTextIcon /></span>
													{/if}
												</SegmentedControl.ItemText>
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
											<SegmentedControl.ItemText>
												<span class="md:hidden">{name}</span>
												<span class="hidden md:inline">Top&nbsp;{name}</span>
											</SegmentedControl.ItemText>
											<SegmentedControl.ItemHiddenInput />
										</SegmentedControl.Item>
									{/each}
								</SegmentedControl.Control>
							</SegmentedControl>
						</article>
					</div>
					<div class={cardClass}>
						<header class="card-header">
							<span class="md:hidden">Gen</span>
							<span class="hidden md:inline">Generate</span>
						</header>
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
								<span class="hidden xs:inline">Filter</span>
								<button
									class={iconButtonClass}
									onclick={() => {
										conditionalDisplay = "filter";
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
						<header class="card-header">
							<span class="xs:hidden"><MusicIcon class="size-6" /></span>
							<span class="hidden xs:inline">Sounds</span>
						</header>
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
								<Switch
									checked={sounds[i]}
									onCheckedChange={(e) => {
										soundsChanged(e.checked, i);
									}}
								>
									<Switch.Control
										class="preset-filled-secondary-50-950 data-[state=checked]:preset-filled-secondary-500"
									>
										<Switch.Thumb>
											<Switch.Context>
												{#if i == (SoundIndex.rightletter as number)}
													<PawPrintIcon class="size-3" />
												{:else if i == (SoundIndex.wrongletter as number)}
													<BugIcon class="size-3" />
												{:else if i == (SoundIndex.passedGoals as number)}
													<RabbitIcon class="size-3" />
												{:else if i == (SoundIndex.failedGoals as number)}
													<TurtleIcon class="size-3" />
												{:else if i == (SoundIndex.lessonsDone as number)}
													<PartyPopperIcon class="size-3" />
												{/if}
											</Switch.Context>
										</Switch.Thumb>
									</Switch.Control>
									<Switch.HiddenInput />
									<Switch.Label class="pl-2"
										><span class="hidden sm:inline inert">{name}</span></Switch.Label
									>
								</Switch>
							{/each}
						</article>
					</div>
				</article>
				<article class="flex flex-col gap-2">
					<div class={cardClass}>
						<article class={articleClassH}>
							<div class={articleClassV}>
								<div>
									<button
										type="button"
										class={clickButtonClass}
										onclick={() => {
											conditionalDisplay = "fonts";
										}}>Fonts</button
									>
								</div>
								<div>
									<button
										class={iconButtonClass}
										onclick={() => {
											conditionalDisplay = "fontInfo";
										}}
									>
										<InfoIcon class={HourStrokeColors[colorIndex]} size={24} />
									</button>
								</div>
							</div>
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
							<Fonts bind:font bind:idbSettings />
						</div>
					{:else if conditionalDisplay === "fontInfo"}
						<div class={cardClass}>
							<header class="card-header">Font Download Links</header>
							<article class={articleClassH}>
								<FontInfo />
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
