<script lang="ts">
	import { LessonsDB } from "$lib/store/LessonsDB.svelte";
	import { SettingsDB, SoundIndex } from "$lib/store/SettingsDB.svelte";
	import { SourceAllIndex, SourceKeys, SourceXG } from "$lib/store/SourceDB.svelte";
	import { CodeIndex, CodeXG } from "$lib/store/code";
	import Celebration, { startCelebration } from "./Celebration.svelte";
	// import Celebration, { startCelebration, unleashWorker } from './Celebration.svelte';
	import PlaySounds, { playSound, Sounds } from "./PlaySounds.svelte";
	import StopWatch from "../lib/utilities/StopWatch/StopWatch.svelte";
	import { lapTime, resetStopWatch, resetLap, startLap, endLap } from "../lib/utilities/StopWatch/stopwatch";
	import { LessonDB } from "$lib/store/LessonDB.svelte";
	import type { ServerStore } from "$lib/store/ServerStore.svelte";
	import { deepClone } from "$lib/utilities/utils";
	import type { ColorIndex } from "$lib/store/Colors.svelte";

	type Props = {
		// Define the expected type for the prop
		currentLesson: LessonDB;
		idbLessons: LessonsDB;
		idbSettings: SettingsDB;
		idbSources: ServerStore<SourceXG>;
		idbCodes: ServerStore<CodeXG>;
		idbCodeChoices: boolean[];
		idbCustomWords: string[];
		colorIndex: ColorIndex;
		font: string;
	};
	let {
		currentLesson = $bindable<LessonDB>(),
		idbLessons = $bindable<LessonsDB>(),
		idbSettings = $bindable<SettingsDB>(),
		idbSources = $bindable<ServerStore<SourceXG>>(),
		idbCodes = $bindable<ServerStore<CodeXG>>(),
		idbCodeChoices = $bindable<boolean[]>(),
		idbCustomWords = $bindable<string[]>(),
		colorIndex = $bindable<ColorIndex>(),
		font = $bindable<string>(),
	}: Props = $props();
	let codesSource: string[] = [];

	function shuffle(array: string[]): void {
		for (let i = array.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}

	function padToMultiple(array: string[], multiple: number) {
		while (array.length % multiple > 0) {
			let j = Math.floor(Math.random() * (array.length - 1));
			array.push(array[j]);
		}
	}

	let expectedLine = "";
	let typedLine = "";
	let rightLetters = 0;
	let wrongLetters = 0;
	let rawWPM = $state(0);
	let accuracy = $state(0);
	let isMouseInside = $state(false);

	let lines: string[] = $state([]);
	let linesIndex = $state(0);
	/**
	 * Lessons are a series of `lines`
	 */
	export function initializeLesson() {
		if (idbLessons.lessonIndex == SourceAllIndex.code) updateCodeWords(idbCodeChoices);
		lines = generateLines();
		expectedLine = lines[0] || "";
		linesIndex = 0;
		initializeLine();
		resetStopWatch();
	}

	/**
	 * @param combinations how many words, ngrams, etc. to combine
	 * @param repetitions how many sets of the combinations to create
	 * @param filter reduce the available combinations
	 * @returns lines to type
	 */
	export function generateLines(): string[] {
		let combinations = currentLesson.combination;
		let repetitions = currentLesson.repetition;
		let filter = currentLesson.filter;
		let scope = currentLesson.scope;
		let index = idbLessons.lessonIndex;
		let source: string[];
		if (index == SourceAllIndex.code) source = codesSource;
		else if (index == SourceAllIndex.custom) source = idbCustomWords;
		else source = idbSources.current[SourceKeys[index]];

		// let s: string = SourceNames[index];
		// console.log("Generating lines with source length:", s, source?.length);
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

	const ColorChars = {
		untoldChar: 0,
		normalChar: 1,
		typingChar: 2,
		betterChar: 3,
		failedChar: 4,
		remedyChar: 5,
	};
	let colorLine: number[] = [];

	const ClassSpan = ["", "normalChar", "underline ", "text-slate-400 ", "text-red-600 ", "text-orange-600 "] as const;
	type ClassLine = { class: string; chars: string; typing: boolean };
	let classLine: ClassLine[] = $state([]);

	function makeColorLine() {
		let currentColor = ColorChars.untoldChar;
		let currentIsTyping = false;
		let currentClass: ClassLine = {
			class: ClassSpan[ColorChars.typingChar],
			chars: "",
			typing: false,
		};
		let aClassLine: ClassLine[] = [];
		let typingIndex = typedLine.length;
		let length = colorLine.length;
		for (let i = 0; i < length; i++) {
			let c = colorLine[i];
			if (i > typingIndex) {
				c = ColorChars.normalChar;
			}
			let isTyping = i == typingIndex;
			if (c != currentColor || isTyping != currentIsTyping) {
				// Subsequent movie span
				currentColor = c;
				currentIsTyping = isTyping;
				currentClass = { class: ClassSpan[currentColor], chars: "", typing: isTyping };
				aClassLine.push(currentClass);
			}
			let t = expectedLine[i];
			if (t == " ") {
				// currentClass.chars += `&nbsp;`; //`&#9141;`
				currentClass.chars += ` `; //`&#9141;`
			} else if (t == "&") {
				// currentClass.chars += `&amp;`;
				currentClass.chars += `&`;
			} else {
				currentClass.chars += t;
			}
		}
		// console.log('classLine:' + JSON.stringify(classLine, null, '\t'));
		classLine = aClassLine;
		// console.log('classLine:' + JSON.stringify(classLine, null, '\t'));
	}

	function onKeyDown(event: KeyboardEvent) {
		if (!isMouseInside) {
			return;
		}
		event.preventDefault();
		if (typedLine.length == 0) {
			resetLap();
		} else if (typedLine.length > 0) {
			startLap();
		}
		if (typedLine.length > expectedLine.length) {
			typedLine = typedLine.slice(0, -1);
			if (idbSettings.sounds[SoundIndex.wrongletter]) playSound(Sounds.wrongLetter);
			return;
		}

		let key = event.key;
		// console.log(key);
		if (event.ctrlKey && key === "Backspace") {
			initializeLine();
			return;
		}
		if (key === "Backspace") {
			typedLine = typedLine.slice(0, -1);
			// console.log('typedLine:' + typedLine);
			makeColorLine();
			if (typedLine.length == 0) {
				initializeLine();
			}
			return;
		}
		if (key === "Dead") {
			return;
		}
		if (key.length > 1) {
			return;
		}

		// Characters follow a finite state machine
		// normalChar -> betterChar / failedChar
		// failedChar -> remedyChar
		// typingChar floats virtually at the insertion point
		// TODO separate into a component
		typedLine += key;
		let i = typedLine.length - 1;
		if (colorLine.length < typedLine.length) {
			let oldLength = colorLine.length;
			colorLine.length = typedLine.length;
			colorLine.fill(ColorChars.normalChar, oldLength, i);
		}
		if (key == expectedLine[i]) {
			if (colorLine[i] == ColorChars.normalChar || colorLine[i] == ColorChars.typingChar) {
				colorLine[i] = ColorChars.betterChar;
			} else {
				colorLine[i] = ColorChars.remedyChar;
			}
		} else {
			colorLine[i] = ColorChars.failedChar;
		}

		typedLine = typedLine.trimStart();
		if (!typedLine.length) {
			return;
		}

		startLap();

		if (expectedLine.startsWith(typedLine)) {
			if (idbSettings.sounds[SoundIndex.rightletter]) playSound(Sounds.rightLetter);
			rightLetters += 1;
		} else if (expectedLine !== typedLine.trimEnd()) {
			if (idbSettings.sounds[SoundIndex.wrongletter]) playSound(Sounds.wrongLetter);
			wrongLetters += 1;
		}

		// Full line correctly entered
		if (typedLine.trimEnd() === expectedLine) {
			// console.log('typedLine === expectedLine');
			// console.log('$lapTime seconds' + ($lapTime / 1000) * 60);
			rawWPM = Math.round(
				((rightLetters + wrongLetters) / 5 / ($lapTime / 1000)) * 60 // 5 chars per word average
			);
			accuracy = Math.round((rightLetters / (rightLetters + wrongLetters)) * 100);
			// console.log('rawWPM' + rawWPM);

			endLap();
			// Failed Goals
			if (rawWPM < idbSettings.minimumWPM || accuracy < idbSettings.minimumAccuracy) {
				if (idbSettings.sounds[SoundIndex.failedGoals]) playSound(Sounds.failedGoals);
				initializeLine();
				return;
			}

			// Goals Achieved
			let newRoundStarted = linesIndex == 0;
			if (newRoundStarted) {
				currentLesson.WPMs = [];
			}
			currentLesson.WPMs.push(rawWPM);

			if (idbSettings.sounds[SoundIndex.passedGoals]) playSound(Sounds.passedGoals);
			nextLine();
		} else {
			makeColorLine();
		}
	}

	function initializeLine() {
		// console.log('resetLap():' + $lapTime);
		resetLap();
		rightLetters = 0;
		wrongLetters = 0;
		typedLine = "";
		colorLine.length = expectedLine.length;
		colorLine = colorLine.fill(ColorChars.normalChar, 0, expectedLine.length);
		colorLine[0] = ColorChars.typingChar;
		makeColorLine();
	}

	function nextLine() {
		let nextLineExists = lines.length > linesIndex + 1;
		if (nextLineExists) {
			linesIndex += 1;
			expectedLine = lines[linesIndex];
			// unleashWorker();
			initializeLine();
		} else {
			// Start again from beginning, but generate new data.
			if (idbSettings.sounds[SoundIndex.lessonsDone]) playSound(Sounds.lessonsDone);
			startCelebration();
			initializeLesson();
		}
	}

	function averageWPM(lineIndex: number): number {
		if (currentLesson.WPMs?.length == 0) {
			return 0;
		}

		let sum = currentLesson.WPMs?.reduce(function (a: number, b: number) {
			return a + b;
		}, 0);
		let average = sum / currentLesson.WPMs?.length;
		return Math.round(average);
	}

	// function onLessonsChanged(lessons: LessonsDB) {
	// 	console.log("onLessonsChanged, generateLines", lessons);
	// 	// if (idbSources.bigrams == null) {
	// 	// 	console.log("onLessonsChanged idbSources.bigrams == null, return");
	// 	// 	return;
	// 	// }
	// 	lines = generateLines(currentLesson.combination, currentLesson.repetition, currentLesson.filter);
	// }

	function handleMouseOver() {
		isMouseInside = true;
		// console.log('handleMouseOver');
	}

	function handleMouseLeave() {
		isMouseInside = false;
		endLap();
	}

	function handleBlur() {
		isMouseInside = false;
		endLap();
	}

	function handleFocus() {
		isMouseInside = true;
	}

	// function handleClick() {
	// 	isMouseInside = true;
	// }
	// 	onclick={handleClick}
	// 	onkeyup={handleClick}

	initializeLesson();
</script>

<div class="mx-2">
	<div
		role="textbox"
		class={isMouseInside ? "textFocus textZone" : "textBlur textZone"}
		onfocus={handleFocus}
		onblur={handleBlur}
		onmouseover={handleMouseOver}
		onmouseleave={handleMouseLeave}
		tabindex="0"
		aria-label="Typing area"
	>
		<div class="p-2 {font}">
			{#each classLine as cp, i (cp.chars + i)}
				{#if cp.typing}
					<span class={cp.class + " " + ClassSpan[ColorChars.typingChar]}>{cp.chars}</span>
				{:else}
					<span class={cp.class}>{cp.chars}</span>
				{/if}
			{/each}
		</div>
		<h2 class="mt-6 flex place-content-center gap-x-3">
			<div>
				<strong>Lesson {linesIndex} / {lines.length}</strong>
			</div>
		</h2>
		<h3 class="mt-0 flex place-content-center gap-x-3">
			<span>WPM: {rawWPM} / {idbSettings.minimumWPM}</span>
			<span>Accuracy: {accuracy}% / {idbSettings.minimumAccuracy}</span>
			<span>Average WPM: {averageWPM(linesIndex)}</span>
		</h3>
	</div>
</div>
<div class="flex justify-center">
	<div class="w-4/12"><StopWatch {colorIndex} /></div>
</div>
<svelte:window on:keydown={onKeyDown} />
<!-- on:keyup={on_key_up} -->

<PlaySounds />
<div>
	<Celebration />
</div>

<style>
	.textBlur {
		border-color: rgba(255, 0, 0, 0.6);
		box-shadow:
			inset 0 2px 2px rgba(0, 0, 0, 0.1),
			0 0 8px rgba(255, 0, 0, 0.6);
	}
	.textFocus {
		cursor: none;
		border-color: rgba(0, 0, 255, 0.6);
		box-shadow:
			inset 0 2px 2px rgba(0, 0, 0, 0.1),
			0 0 8px rgba(0, 0, 255, 0.6);
	}

	.typingChar {
		border-bottom: 4px solid #f78d1d;
	}

	.failedChar {
		color: #ff0000;
	}

	.remedyChar {
		color: #ff8000;
	}

	.betterChar {
		color: #aaa;
		text-shadow:
			0px 1px 1px #fff,
			0px 2px 2px #fff;
	}
</style>
