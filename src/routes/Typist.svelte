<script lang="ts">
	import { SettingsDB, SoundIndex } from "$lib/store/SettingsDB.svelte";
	import Celebration, { startCelebration } from "./Celebration.svelte";
	// TODO: Celebration, { startCelebration, unleashWorker } from './Celebration.svelte';
	import PlaySounds, { playSound, Sounds } from "./PlaySounds.svelte";
	import StopWatch from "../lib/utilities/StopWatch/StopWatch.svelte";
	import { resetLap, startLap, endLap, lapTime } from "../lib/utilities/StopWatch/stopwatch";
	import { LessonDB } from "$lib/store/LessonDB.svelte";
	import { settingsState } from "$lib/store/SettingsState.svelte";

	type Props = {
		lines: string[];
		linesIndex: number;
		expectedLine: string;
		idbSettings: SettingsDB;
		currentLesson: LessonDB;
		initializeLesson: () => void;
	};
	let {
		lines = $bindable<string[]>(),
		linesIndex = $bindable<number>(),
		expectedLine = $bindable<string>(),
		idbSettings = $bindable<SettingsDB>(),
		currentLesson = $bindable<LessonDB>(),
		initializeLesson = $bindable<() => void>(),
	}: Props = $props();

	let typedLine = "";
	let rightLetters = 0;
	let wrongLetters = 0;
	let rawWPM = $state(0);
	let accuracy = $state(0);
	let isMouseInside = $state(false);

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
			class: ClassSpan[ColorChars.typingChar]!,
			chars: "",
			typing: false,
		};
		let aClassLine: ClassLine[] = [];
		let typingIndex = typedLine.length;
		let length = colorLine.length;
		for (let i = 0; i < length; i++) {
			let c = colorLine[i]!;
			if (i > typingIndex) {
				c = ColorChars.normalChar;
			}
			let isTyping = i == typingIndex;
			if (c != currentColor || isTyping != currentIsTyping) {
				// Subsequent movie span
				currentColor = c;
				currentIsTyping = isTyping;
				currentClass = { class: ClassSpan[currentColor]!, chars: "", typing: isTyping };
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
		// Update shared typing state for keyboard highlighting
		settingsState.nextChar = expectedLine[typedLine.length] ?? "";
		settingsState.typedLength = typedLine.length;
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
		// TODO: create a true lesson that persists between sessions
		// TODO: make deliberate line length -> lesson length
		// TODO: autofocus on bad characters scheme with auto filter and calculated character practice order from layout.
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
			// console.log('$lapTime seconds', (lapTime / 1000) * 60);
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

	export function initializeLine() {
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
			expectedLine = lines[linesIndex]!;
			// unleashWorker();
			initializeLine();
		} else {
			// Start again from beginning, but generate new data.
			if (idbSettings.sounds[SoundIndex.lessonsDone]) playSound(Sounds.lessonsDone);
			startCelebration();
			initializeLesson();
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

	let colorIndex = $derived(settingsState.colorIndex);
	initializeLesson();
</script>

<div class="mx-2">
	<div
		role="textbox"
		class={isMouseInside ? " textFocus textZone" : " textBlur textZone"}
		onfocus={handleFocus}
		onblur={handleBlur}
		onmouseover={handleMouseOver}
		onmouseleave={handleMouseLeave}
		tabindex="0"
		aria-label="Typing area"
	>
		<div class="p-2 {settingsState.font}">
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
			<span>WPM: {rawWPM} / {settingsState.minimumWPM}</span>
			<span>Accuracy: {accuracy}% / {settingsState.minimumAccuracy}%</span>
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
