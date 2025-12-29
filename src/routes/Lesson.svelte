<script lang="ts">
	import { LessonsDB } from "$lib/store/LessonsDB.svelte";
	import { SettingsDB } from "$lib/store/SettingsDB.svelte";
	import { SourceAllIndex, SourceKeys, SourceXG } from "$lib/store/SourceDB.svelte";
	import { CodeIndex, CodeXG } from "$lib/store/code";
	// import Celebration, { startCelebration, unleashWorker } from './Celebration.svelte';
	import { resetStopWatch } from "../lib/utilities/StopWatch/stopwatch";
	import { LessonDB } from "$lib/store/LessonDB.svelte";
	import type { ServerStore } from "$lib/store/ServerStore.svelte";
	import { deepClone, padToMultiple, shuffle } from "$lib/utilities/utils";
	import Typist from "./Typist.svelte";

	type Props = {
		// Define the expected type for the prop
		idbLessonIndex: SourceAllIndex;
		currentLesson: LessonDB;
		idbLessons: LessonsDB;
		idbSettings: SettingsDB;
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
		idbSources = $bindable<ServerStore<SourceXG>>(),
		idbCodes = $bindable<ServerStore<CodeXG>>(),
		idbCodeChoices = $bindable<boolean[]>(),
		idbCustomWords = $bindable<string[]>(),
	}: Props = $props();
	let codesSource: string[] = [];

	let lines: string[] = $state([]);
	let linesIndex = $state(0);
	let expectedLine = $state("");
	/**
	 * Lessons are a series of `lines`
	 */
	export function initializeLesson() {
		if (idbLessonIndex == SourceAllIndex.code) updateCodeWords(idbCodeChoices);
		lines = generateLines();
		expectedLine = lines[0] || "";
		linesIndex = 0;
		typist?.initializeLine();
		resetStopWatch();
	}

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

		// Use indexing to limit scope of Xgrams.
		// Select the Top 50...16000 ngrams from source
		if (scope) {
			// console.log('Slicing source to scope:', source.length, '->', scope);
			source = source.slice(0, scope);
		}

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

		let ngrams = deepClone(source);
		if (ngrams.length == 0) ngrams.push("NoWordsSelectedCheckFilter");
		shuffle(ngrams);
		padToMultiple(ngrams, combinations); // Ensure all subLines have requested combinations

		let lines = [];
		while (ngrams.length) {
			let ngramsSublist = ngrams.slice(0, combinations);
			let subLine = ngramsSublist.join(" ");
			let _line = [];
			for (let i = 0; i < repetitions; i++) {
				_line.push(subLine);
			}
			lines.push(_line.join(" "));
			// Remove the processed ngrams.
			ngrams.splice(0, combinations);
		}

		shuffle(lines);
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
</script>

<Typist bind:this={typist} {lines} {linesIndex} {expectedLine} {idbSettings} {currentLesson} {initializeLesson} />
