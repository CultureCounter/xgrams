<script lang="ts">
	import {
		BGColors,
		BorderColors,
		ColorIndex,
		ColorNames,
		getHourStrokeFill,
		HourStrokeColors,
	} from "$lib/store/Colors.svelte";
	import Counter from "./Counter.svelte";
	import { LessonDB, ScopeIndex, ScopeNames, ScopeValues } from "$lib/store/LessonDB.svelte";
	import { LessonsDB } from "$lib/store/LessonsDB.svelte";
	import { SettingsDB, SoundIndex, SoundNames } from "$lib/store/SettingsDB.svelte";
	import { SourceAllIndex, SourceIndex, SourceNames } from "$lib/store/SourceDB.svelte";
	import { Dialog, Portal, SegmentedControl, Switch, Tabs } from "@skeletonlabs/skeleton-svelte";

	import Fonts from "./Fonts.svelte";
	import FontInfo from "./FontInfo.svelte";
	import OptionsCode from "./OptionsCode.svelte";
	import OptionsCustom from "./OptionsCustom.svelte";
	import OptionsFilter from "./OptionsFilter.svelte";
	import OptionsKeyboard from "./OptionsKeyboard.svelte";
	import { OtherNames } from "$lib/store/LessonsDB.svelte";

	import MusicIcon from "@lucide/svelte/icons/music";
	import PawPrintIcon from "@lucide/svelte/icons/paw-print";
	import BugIcon from "@lucide/svelte/icons/bug";
	import RabbitIcon from "@lucide/svelte/icons/rabbit";
	import TurtleIcon from "@lucide/svelte/icons/turtle";
	import PartyPopperIcon from "@lucide/svelte/icons/party-popper";

	import ALargeSmallIcon from "@lucide/svelte/icons/a-large-small";
	import BookOpenTextIcon from "@lucide/svelte/icons/book-open-text";
	import CheckIcon from "@lucide/svelte/icons/check";
	import Dice2Icon from "@lucide/svelte/icons/dice-2";
	import Dice3Icon from "@lucide/svelte/icons/dice-3";
	import Dice4Icon from "@lucide/svelte/icons/dice-4";
	import Dice5Icon from "@lucide/svelte/icons/dice-5";
	import Dice6Icon from "@lucide/svelte/icons/dice-6";
	import ExternalLinkIcon from "@lucide/svelte/icons/external-link";
	import FunnelIcon from "@lucide/svelte/icons/funnel";
	import InfinityIcon from "@lucide/svelte/icons/infinity";
	import KeyboardIcon from "@lucide/svelte/icons/keyboard";
	import PandaIcon from "@lucide/svelte/icons/panda";
	import ShellIcon from "@lucide/svelte/icons/shell";
	import WandSparklesIcon from "@lucide/svelte/icons/wand-sparkles";
	import { settingsState } from "$lib/store/SettingsState.svelte";

	type Props = {
		// Define the expected type for the prop
		idbLessonIndex: SourceAllIndex;
		currentLesson: LessonDB;
		idbLessons: LessonsDB;
		idbSettings: SettingsDB;
		idbCustomWords: string[];
		idbCodeChoices: boolean[];
		onLessonChanged: (
			settingsDB: SettingsDB,
			newLessonIndex: SourceAllIndex,
			currentLesson: LessonDB,
			lessonsDB: LessonsDB,
			codeChoices?: boolean[],
			customWords?: string[]
		) => void;
		onSettingsChanged: (
			settingsDB: SettingsDB,
			lessonIndex: SourceAllIndex,
			currentLesson: LessonDB,
			lessonsDB: LessonsDB,
			codeChoices?: boolean[],
			customWords?: string[]
		) => void;
	};
	let {
		idbLessonIndex = $bindable<SourceAllIndex>(),
		currentLesson = $bindable<LessonDB>(),
		idbLessons = $bindable<LessonsDB>(),
		idbSettings = $bindable<SettingsDB>(),
		idbCustomWords,
		idbCodeChoices,
		onLessonChanged,
		onSettingsChanged,
	}: Props = $props();

	// Avoid Aria whining using conditional display not popups
	type ConditionalDisplay = "code" | "custom" | "filter" | "fonts" | "fontInfo" | "keyboard";
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

	let volume = $derived(settingsState.volume * 100);
	function setNewVolume(newVolume: number): void {
		idbSettings.volume = newVolume;
		idbSettings.isDirty = true;
		settingsState.volume = newVolume / 100;
	}

	let selectedColor: ColorIndex = $state(idbSettings?.colorIndex ?? ColorIndex.fuchsia);
	function setColor(): void {
		settingsState.colorIndex = selectedColor;
		idbSettings.colorIndex = selectedColor;
		idbSettings.isDirty = true;
	}

	let sourceValue = $state<string>(SourceNames[idbLessonIndex]);
	function setSource(newSource: string | null): void {
		if (newSource === null) {
			return;
		}
		let newIndex = SourceNames.indexOf(newSource);
		if (newIndex === idbLessonIndex) {
			return;
		}
		onLessonChanged(idbSettings, newIndex, currentLesson, idbLessons, idbCodeChoices, idbCustomWords);
		scopeValue = currentLesson.scope.toString();
		combination = currentLesson.combination;
		repetition = currentLesson.repetition;
		filterString = currentLesson.filter;
		sourceValue = SourceNames[idbLessonIndex];
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

	let filterString = $state<string>(currentLesson.filter);
	function filterChanged(newFilter: string): void {
		filterString = newFilter;
		currentLesson.filter = newFilter;
		idbLessons.isDirty = true;
	}

	function saveSettings(): void {
		const customArray = customString.split(/\s+/);
		onSettingsChanged(idbSettings, idbLessonIndex, currentLesson, idbLessons, newCodeChoices, customArray);
	}

	const animBackdrop =
		"transition transition-discrete opacity-0 starting:data-[state=open]:opacity-0 data-[state=open]:opacity-100";
	const animModal =
		"transition transition-discrete opacity-0 -translate-x-full starting:data-[state=open]:opacity-0 starting:data-[state=open]:-translate-x-full data-[state=open]:opacity-100 data-[state=open]:translate-x-0";

	let contentClass = "card xs:space-y-4 backdrop-blur-lg shadow-xl";
	//   3xs:bg-lime-600 2xs:text-yellow-100 xs:bg-digital-blue-200 sm:bg-digital-blue-300 md:bg-digital-blue-400 lg:bg-digital-blue-500 xl:bg-digital-blue-600 2xl:bg-amber-700 3xl:bg-lime-800
	let cardClass = $derived(
		"card backdrop-blur-xl xs:p-2 space-x-1 space-y-2 border-2 "
			+ BorderColors[settingsState.colorIndex]
			+ " "
			+ BGColors[settingsState.colorIndex]
			+ " rounded-lg flex-1"
	);
	// const clickButtonClass = $derived(
	// 	"btn backdrop-blur-xl space-y-4 border-2 "
	// 		+ BorderColors[colorIndex]
	// 		+ " "
	// 		+ BGColors[colorIndex]
	// 		+ " rounded-lg"
	// );
	const iconButtonClass =
		"focus:ring-opacity-50 rounded-full text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-900 focus:outline-none";
	const articleClassV = "flex flex-col justify-between xs:space-y-2";
	const articleClassH = "flex flex-row justify-between xs:space-x-2";
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
				<article class={articleClassH}>
					<div class={cardClass}>
						<header class="card-header">
							<span class="md:hidden"><WandSparklesIcon class="size-6" /></span>
							<span class="hidden md:inline">Source</span>
						</header>
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
														>📜
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
						<header class="card-header">
							<span class="md:hidden"><InfinityIcon class="size-6" /></span>
							<span class="hidden md:inline">Scope</span>
						</header>
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
							<span class="md:hidden"><ShellIcon class="size-6" /></span>
							<span class="hidden md:inline">Generate</span>
						</header>
						<article class={articleClassV}>
							<Counter
								name="Combination"
								minCounter={1}
								stepCounter={1}
								count={combination}
								onChange={setCombination}
								colorIndex={settingsState.colorIndex}
							/>
							<Counter
								name="Repetition"
								stepCounter={1}
								minCounter={1}
								count={repetition}
								onChange={setRepetition}
								colorIndex={settingsState.colorIndex}
							/>
							<div>
								<span class="hidden xs:inline">Filter</span>
								<button
									class={iconButtonClass}
									onclick={() => {
										conditionalDisplay = "filter";
									}}
								>
									<FunnelIcon class={getHourStrokeFill(settingsState.colorIndex)} size={18} />
								</button>
							</div>
						</article>
					</div>
					<div class="space-y-2 flex flex-col flex-stretch">
						<div class={cardClass}>
							<header class="card-header">
								<span class="xs:hidden"><RabbitIcon class="size-6" /></span>
								<span class="hidden xs:inline">Goals</span>
							</header>
							<article class={articleClassV}>
								<Counter
									name="Minimum&nbsp;WPM"
									minCounter={0}
									maxCounter={400}
									stepCounter={10}
									onChange={setMinimumWPM}
									bind:count={minimumWPM}
									colorIndex={settingsState.colorIndex}
								/>
								<Counter
									name="Minimum&nbsp;Accuracy"
									minCounter={0}
									maxCounter={100}
									onChange={setMinimumAccuracy}
									bind:count={minimumAccuracy}
									colorIndex={settingsState.colorIndex}
								/>
							</article>
						</div>
						<div class={cardClass}>
							<header class="card-header">
								<span class="xs:hidden" style="font-size: 1.5em">🎨</span>
								<span class="hidden xs:inline">Colors</span>
							</header>
							<article>
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
							</article>
						</div>
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
								colorIndex={settingsState.colorIndex}
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
				<article class={cardClass}>
					<Tabs
						value={conditionalDisplay}
						onValueChange={(details) => (conditionalDisplay = details.value as ConditionalDisplay)}
					>
						<Tabs.List>
							<Tabs.Trigger class="flex-1" value="code"
								><span class="xs:hidden">🤖</span>
								<span class="hidden xs:inline">Code</span></Tabs.Trigger
							>
							<Tabs.Trigger class="flex-1" value="custom"
								><span class="xs:hidden">📜</span>
								<span class="hidden xs:inline">Custom</span></Tabs.Trigger
							>
							<Tabs.Trigger class="flex-1" value="filter"
								><span class="xs:hidden"
									><FunnelIcon class={getHourStrokeFill(settingsState.colorIndex)} size={24} /></span
								>
								<span class="hidden xs:inline">Filter</span></Tabs.Trigger
							>
							<Tabs.Trigger class="flex-1" value="fonts"
								><span class="xs:hidden"><ALargeSmallIcon size={24} /></span>
								<span class="hidden xs:inline">Fonts</span></Tabs.Trigger
							>
							<Tabs.Trigger class="flex-1" value="fontInfo"
								><span class="xs:hidden"><ExternalLinkIcon size={24} /></span>
								<span class="hidden xs:inline">Font Info</span></Tabs.Trigger
							>
							<Tabs.Trigger class="flex-1" value="keyboard"
								><span class="xs:hidden"><KeyboardIcon size={24} /></span><span class="hidden xs:inline"
									>Keyboard</span
								></Tabs.Trigger
							>
							<Tabs.Indicator />
						</Tabs.List>
						<Tabs.Content value="code">
							<article class={articleClassH}>
								<OptionsCode {idbCodeChoices} {codeChanged}></OptionsCode>
							</article>
						</Tabs.Content>
						<Tabs.Content value="custom">
							<article class={articleClassH}>
								<OptionsCustom {customString} {customChanged} colorIndex={settingsState.colorIndex}
								></OptionsCustom>
							</article>
						</Tabs.Content>
						<Tabs.Content value="filter">
							<article class={articleClassH}>
								<OptionsFilter {filterString} {filterChanged} colorIndex={settingsState.colorIndex}
								></OptionsFilter>
							</article>
						</Tabs.Content>
						<Tabs.Content value="fonts">
							<article class={articleClassV}>
								<Fonts bind:idbSettings />
							</article>
						</Tabs.Content>
						<Tabs.Content value="fontInfo">
							<article class={articleClassV}>
								<FontInfo />
							</article>
						</Tabs.Content>
						<Tabs.Content value="keyboard">
							<article class={articleClassH}>
								<OptionsKeyboard {idbSettings}></OptionsKeyboard>
							</article>
						</Tabs.Content>
					</Tabs>
				</article>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>
