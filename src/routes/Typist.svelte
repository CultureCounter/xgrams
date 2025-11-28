<script lang="ts">
	import { deepClone, myStore, SoundIndex, DataXG } from "$lib/store/data";
	import { idbLanguages, idbSources, SourceKeys } from "$lib/store/xgramSources.svelte";
	import Celebration, { startCelebration } from "./Celebration.svelte";
	// import Celebration, { startCelebration, unleashWorker } from './Celebration.svelte';
	import PlaySounds, { playSound, Sounds } from "./PlaySounds.svelte";
	import StopWatch from "../lib/utilities/StopWatch/StopWatch.svelte";
	import {
		lapTime,
		resetStopWatch,
		resetLap,
		startLap,
		endLap,
	} from "../lib/utilities/StopWatch/stopwatch";

	const { data, settings } = myStore;

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
	let linesCurrentIndex = $state(0);
	let isMouseInside = $state(false);

	/**
	 * Lessons are a series of `lines`
	 */
	function initializeLesson() {
		let dataSource = $data.currentOptions;
		dataSource.lines = generateLines(
			dataSource.combination,
			dataSource.repetition,
			dataSource.filter
		);
		expectedLine = dataSource.lines[0] || "";
		dataSource.linesCurrentIndex = 0;
		initializeLine();
		resetStopWatch();
	}

	/**
	 * @param combinations how many words, ngrams, etc. to combine
	 * @param repetitions how many sets of the combinations to create
	 * @param filter reduce the available combinations
	 */
	function generateLines(combinations: number, repetitions: number, filter: string) {
		let dataSource = $data.currentOptions;
		let scope = dataSource.scope;
		let index = $data.source;
		let s: string = SourceKeys[index];
		// console.log("generateLines idbSources:", idbSources);
		// console.log("generateLines source key:", s);
		let source = idbSources[s];
		// console.log("generateLines source:", source);

		// console.log('Generating lines with dataSource:', dataSource);
		// console.log('Generating lines with scope:', scope);
		console.log("Generating lines with source length:",s,index, source.length);
		if (source == null) {
			console.log("Generating lines with source == null:");
			console.log("idbSources.source:", idbSources);
			console.log("idbLanguages:", $state.snapshot(idbLanguages));
			source = idbSources.bigrams.slice(0, scope);
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

		return lines;
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

	const ClassSpan = [
		"",
		"normalChar",
		"underline ",
		"text-slate-400 ",
		"text-red-600 ",
		"text-orange-600 ",
	] as const;
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
			if ($settings.sounds[SoundIndex.wrongletter]) playSound(Sounds.wrongLetter);
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
			if ($settings.sounds[SoundIndex.rightletter]) playSound(Sounds.rightLetter);
			rightLetters += 1;
		} else if (expectedLine !== typedLine.trimEnd()) {
			if ($settings.sounds[SoundIndex.wrongletter]) playSound(Sounds.wrongLetter);
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
			if (rawWPM < $settings.minimumWPM || accuracy < $settings.minimumAccuracy) {
				if ($settings.sounds[SoundIndex.failedGoals]) playSound(Sounds.failedGoals);
				initializeLine();
				return;
			}

			// Goals Achieved
			let dataSource = $data.currentOptions;
			let newRoundStarted = dataSource.linesCurrentIndex == 0;
			if (newRoundStarted) {
				dataSource.WPMs = [];
			}
			dataSource.WPMs.push(rawWPM);

			if ($settings.sounds[SoundIndex.passedGoals]) playSound(Sounds.passedGoals);
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
		linesCurrentIndex = $data.currentOptions.linesCurrentIndex;
		// console.log('resetCurrentLine linesCurrentIndex:' + $data.currentOptions.linesCurrentIndex);
	}

	function nextLine() {
		let dataSource = $data.currentOptions;
		let nextLineExists = dataSource.lines.length > dataSource.linesCurrentIndex + 1;
		if (nextLineExists) {
			// console.log('nextLine linesCurrentIndex:' + dataSource.linesCurrentIndex);
			dataSource.linesCurrentIndex += 1;
			// console.log('nextLine linesCurrentIndex:' + dataSource.linesCurrentIndex);
			expectedLine = dataSource.lines[dataSource.linesCurrentIndex];
			// unleashWorker();
			initializeLine();
		} else {
			// Start again from beginning, but generate new data.
			if ($settings.sounds[SoundIndex.lessonsDone]) playSound(Sounds.lessonsDone);
			startCelebration();
			initializeLesson();
		}
	}

	function averageWPM(): number {
		let dataSource = $data.currentOptions;
		if (dataSource.WPMs.length == 0) {
			return 0;
		}

		let sum = dataSource.WPMs.reduce(function (a, b) {
			return a + b;
		}, 0);
		let average = sum / dataSource.WPMs.length;
		return Math.round(average);
	}

	// $effect(() => {
	// 	idbSources;
	// 	initializeLesson();
	// });

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	function onDataChange(_data: DataXG) {
		console.log("onDataChange changed, initializeLesson", idbSources);
		if (idbSources.bigrams == null) {
			console.log("onDataChange idbSources.bigrams == null, return");
			return;
		}
		initializeLesson();
	}

	$effect(() => {
		onDataChange($data);
	});

	$effect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		idbSources;
		if (idbSources.bigrams == null || idbSources.bigrams.length == 0) {
			console.log("idbSources.bigrams == null, return");
			return;
		}
		let source = idbSources[SourceKeys[$data.source]];
		if (source == null 
|| source.length == 0) {
			console.log("idbSources[SourceKeys[$data.source]] == null, return");
			return;
		}
		console.log("idbSources changed, initializeLesson", idbSources);
		initializeLesson();
	});

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
</script>

<div class="mx-2">
	<div
		role="textbox"
		class={isMouseInside ? "textFocus textZone" : "textBlur textZone"}
		onfocus={handleFocus}
		onblur={handleBlur}
		onmouseover={handleMouseOver}
		onmouseleave={handleMouseLeave}
		tabindex="-1"
	>
		<div class="p-2 {$settings.font}">
			{#each classLine as cp, i (cp.chars + i)}
				{#if cp.typing}
					<span class={cp.class + " " + ClassSpan[ColorChars.typingChar]}>{cp.chars}</span>
				{:else}
					<span class={cp.class}>{cp.chars}</span>
				{/if}
			{/each}
		</div>
		<h4 class="mt-6 flex place-content-evenly gap-x-3">
			<div>
				<strong>Lesson {linesCurrentIndex} / {$data.currentOptions.lines.length}</strong>
			</div>
		</h4>
		<h4 class="mt-0 flex place-content-evenly gap-x-3">
			<div>WPM: {rawWPM}</div>
			<div>Accuracy: {accuracy}%</div>
			<div>Average WPM: {averageWPM()}</div>
		</h4>
	</div>
</div>
<div class="flex justify-center">
	<div class="w-4/12"><StopWatch /></div>
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
