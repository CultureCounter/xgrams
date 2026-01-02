<script lang="ts">
	import { CodeIndex, CodeXG } from "$lib/store/code";
	import { LessonsDB } from "$lib/store/LessonsDB.svelte";
	import { LessonDB } from "$lib/store/LessonDB.svelte";
	import { SettingsDB } from "$lib/store/SettingsDB.svelte";
	import { SourceAllIndex, SourceKeys, SourceXG } from "$lib/store/SourceDB.svelte";
	import type { StatsDB } from "$lib/store/StatsDB.svelte";
	import type { ServerStore } from "$lib/store/ServerStore.svelte";
	// import Celebration, { startCelebration, unleashWorker } from './Celebration.svelte';
	import { resetStopWatch } from "../lib/utilities/StopWatch/stopwatch";
	import { padToMultiple, selectRandomInto } from "$lib/utilities/utils";
	import Typist from "./Typist.svelte";
	import { onMount } from "svelte";
	import { settingsState } from "$lib/store/SettingsState.svelte";

	type Props = {
		// Define the expected type for the prop
		idbLessonIndex: SourceAllIndex;
		currentLesson: LessonDB;
		idbLessons: LessonsDB;
		idbSettings: SettingsDB;
		idbStats: StatsDB;
		idbSources: ServerStore<SourceXG>;
		idbCodes: ServerStore<CodeXG>;
		idbCodeChoices: boolean[];
		idbCustomWords: string[];
	};
	let {
		idbLessonIndex = $bindable<SourceAllIndex>(),
		currentLesson = $bindable<LessonDB>(),
		idbLessons = $bindable<LessonsDB>(),
		idbSettings = $bindable<SettingsDB>(),
		idbStats = $bindable<StatsDB>(),
		idbSources = $bindable<ServerStore<SourceXG>>(),
		idbCodes = $bindable<ServerStore<CodeXG>>(),
		idbCodeChoices = $bindable<boolean[]>(),
		idbCustomWords = $bindable<string[]>(),
	}: Props = $props();
	let codesSource: string[] = [];

	const thisIsTheWay = "This is the way.";
	let lines: string[] = $state([thisIsTheWay]);
	let linesIndex = $state(0);
	let expectedLine = $state(thisIsTheWay);
	/**
	 * Lessons are a series of `lines`
	 */
	export function initializeLesson() {
		if (idbLessonIndex == SourceAllIndex.code) updateCodeWords(idbCodeChoices);

		const sourceMax = Math.min((idbLessonIndex as number) + 2, 6);
		idbStats.setLessonKeys(settingsState.keyboard, settingsState.layout);
		// Reset any perfected keys and get lesson focus letters
		const { lessonKeys, masteredKeys } = idbStats.getLessonLetters(
			idbSettings.minimumAccuracy,
			idbSettings.minimumWPM,
			sourceMax
		);
		console.log("Lesson letters:", lessonKeys);

		// Generate filter from focus letters if enabled
		if (idbStats.autoFilter) {
			console.log(
				"Generating filter with lessonKeys:",
				lessonKeys,
				"masteredKeys:",
				masteredKeys,
				"maxLength:",
				sourceMax
			);
			const filterPattern = idbStats.generateFilterPattern(lessonKeys, masteredKeys, sourceMax);
			if (filterPattern) {
				console.log("Filter pattern:", filterPattern);
				currentLesson.filter = filterPattern;
				idbLessons.isDirty = true;
			}
		}

		lines = generateLines();
		expectedLine = lines[0] || thisIsTheWay;
		linesIndex = 0;
		if (typist && typist.initializeLine) {
			typist.initializeLine();
		}
		resetStopWatch();
	}

	const selections: string[] = [];
	/**
	 * @returns lines to type
	 */
	export function generateLines(): string[] {
		let combinations = currentLesson.combination;
		let repetitions = currentLesson.repetition;
		let filter = currentLesson.filter;
		let scope = currentLesson.scope;
		let index = idbLessonIndex;
		let source: string[];
		if (index == SourceAllIndex.code) source = codesSource;
		else if (index == SourceAllIndex.custom) source = idbCustomWords;
		else source = idbSources.current[SourceKeys[index]!]!;

		// console.log("Generating lines with source length:", index, source?.length);
		if (source == null) {
			console.assert(source != null, "Generating lines with source == null:", index);
			source = idbSources.current.bigrams.slice(0, scope);
		}

		// Select the Top 50...16000 ngrams from source
		if (scope) {
			source = source.slice(0, scope);
		}

		// Apply filter
		if (filter.length > 0) {
			// Filter: AND characters on the same line, OR different lines.
			let orList = filter.split("\n");
			source = source.filter(function (element: string) {
				for (let andString of orList) {
					let chosen = true;
					for (let mandatoryChar of andString) {
						if (!element.includes(mandatoryChar)) {
							chosen = false;
							break;
						}
					}
					if (chosen) return true;
				}
				return false;
			});
		}

		// Select up to combinations from source and duplicate repitions times
		selectRandomInto(source, selections, combinations, scope);
		if (selections.length == 0) selections.push("NoWordsSelectedCheckFilter");
		padToMultiple(selections, combinations); // Pad with duplicates if insufficient
		let subLine = selections.join(" ") + " ";
		let line = subLine.repeat(repetitions).trim();

		// Each test is testsPerLesson lines
		let lines: string[] = Array(idbStats.testsPerLesson).fill(line);
		return lines;
	}

	/**
	 * Update codesSource array based on idbCodeChoices
	 * TODO: only update if idbCodeChoices has changed
	 * @param idbCodeChoices boolean[] indicating which languages to include.
	 */
	function updateCodeWords(idbCodeChoices: boolean[]) {
		codesSource.length = 0;
		codesSource.push(
			...(idbCodeChoices[CodeIndex.cpp] ? idbCodes.current.cpp : []),
			...(idbCodeChoices[CodeIndex.cs] ? idbCodes.current.cs : []),
			...(idbCodeChoices[CodeIndex.go] ? idbCodes.current.go : []),
			...(idbCodeChoices[CodeIndex.java] ? idbCodes.current.java : []),
			...(idbCodeChoices[CodeIndex.js] ? idbCodes.current.js : []),
			...(idbCodeChoices[CodeIndex.python] ? idbCodes.current.python : []),
			...(idbCodeChoices[CodeIndex.rust] ? idbCodes.current.rust : []),
			...(idbCodeChoices[CodeIndex.swift] ? idbCodes.current.swift : []),
			...(idbCodeChoices[CodeIndex.ts] ? idbCodes.current.ts : [])
		);
	}

	let typist: Typist;
	onMount(() => {
		initializeLesson();
	});
</script>

<Typist
	bind:this={typist}
	{lines}
	bind:linesIndex
	{expectedLine}
	{idbSettings}
	{idbStats}
	{currentLesson}
	{initializeLesson}
/>
