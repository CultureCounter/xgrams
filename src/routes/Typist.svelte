<script lang="ts">
	import { deepCopy, myStore, OptionIndex, SoundIndex, XgramData } from '$lib/store/data';
	import Celebration, { endCelebration, startCelebration } from './Celebration.svelte';
	import Keyboard from './Keyboard.svelte';
	import PlaySounds, { playSound, Sounds } from './PlaySounds.svelte';
	import StopWatch from '../lib/utilities/StopWatch/StopWatch.svelte';
	import { elapsedTime, lapTime, resetStopWatch, resetLap, startLap, endLap } from '../lib/utilities/StopWatch/stopwatch';

	const { data, settings, sources } = myStore;

	let inner: HTMLTextAreaElement;
	const resize = () => {
		inner.style.height = 'auto';
		inner.style.height = 4 + inner.scrollHeight + 'px';
	};

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

	let expectedPhrase = '';
	let typedPhrase = '';
	let rightLetters = 0;
	let wrongLetters = 0;
	let rawWPM = 0;
	let accuracy = 0;
	let phrasesCurrentIndex = 0;
	let isMouseInside = false;

	function initializeLesson() {
		let dataSource = $data.currentOptions;
		dataSource.phrases = generatePhrases(dataSource.combination, dataSource.repetition, dataSource.filter);
		expectedPhrase = dataSource.phrases[0] || '';
		dataSource.phrasesCurrentIndex = 0;
		initializePhrase();
		resetStopWatch();
	}

	/**
	 *
	 * @param combinations how many words, ngrams, etc. to combine
	 * @param repetitions how many sets of the combinations to create
	 * @param filter reduce the available combinations
	 */
	function generatePhrases(combinations: number, repetitions: number, filter: string) {
		let dataSource = $data.currentOptions;
		let scope = dataSource.scope;
		let source = $sources.source[$data.source];

		if (source == null) {
			source = $sources.source[OptionIndex.bigrams];
		}

		// Use indexing to limit scope of Xgrams.
		// Select the Top 50...16000
		if (scope) {
			source = source.slice(0, scope);
		}

		if (filter.length > 0) {
			// Filter: AND characters on the same line, OR different lines.
			let orList = filter.split('\n');
			source = source.filter(function (element) {
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

		let ngrams = deepCopy(source);
		shuffle(ngrams);

		padToMultiple(ngrams, combinations); // Ensure all subPhrases have requested combinations

		let ngramsProcessed = 0;
		let phrases = [];
		while (ngrams.length) {
			let ngramsSublist = ngrams.slice(0, combinations);
			let subPhrase = ngramsSublist.join(' ');
			let _phrase = [];
			for (let i = 0; i < repetitions; i++) {
				_phrase.push(subPhrase);
			}
			phrases.push(_phrase.join(' '));
			// Remove the processed ngrams.
			ngrams.splice(0, combinations);
		}

		return phrases;
	}

	const ColorChars = {
		untoldChar: 0,
		normalChar: 1,
		typingChar: 2,
		betterChar: 3,
		failedChar: 4,
		remedyChar: 5,
	};
	let colorPhrase: number[] = [];

	const ClassSpan = ['', 'normalChar', 'typingChar', 'betterChar', 'failedChar', 'remedyChar'] as const;
	type ClassPhrase = { class: string; chars: string; typing: boolean };
	let classPhrase: ClassPhrase[] = [];

	function makeColorPhrase() {
		let currentColor = ColorChars.untoldChar;
		let currentIsTyping = false;
		let currentClass: ClassPhrase = {
			class: ClassSpan[ColorChars.typingChar],
			chars: '',
			typing: false,
		};
		let aClassPhrase: ClassPhrase[] = [];
		let typingIndex = typedPhrase.length;
		let length = colorPhrase.length;
		for (let i = 0; i < length; i++) {
			let c = colorPhrase[i];
			if (i > typingIndex) {
				c = ColorChars.normalChar;
			}
			let isTyping = i == typingIndex;
			if (c != currentColor || isTyping != currentIsTyping) {
				// Subsequent movie span
				currentColor = c;
				currentIsTyping = isTyping;
				currentClass = { class: ClassSpan[currentColor], chars: '', typing: isTyping };
				aClassPhrase.push(currentClass);
			}
			let t = expectedPhrase[i];
			if (t == ' ') {
				// currentClass.chars += `&nbsp;`; //&#9141
				currentClass.chars += ` `; //&#9141
			} else if (t == '&') {
				// currentClass.chars += `&amp;`;
				currentClass.chars += `&`;
			} else if (t === undefined) {
			} else {
				currentClass.chars += t;
			}
		}
		// console.log('classPhrase:' + JSON.stringify(classPhrase, null, '\t'));
		classPhrase = aClassPhrase;
		// console.log('classPhrase:' + JSON.stringify(classPhrase, null, '\t'));
	}

	function onKeyDown(event: KeyboardEvent) {
		if (!isMouseInside) {
			return;
		}
		event.preventDefault();
		if (typedPhrase.length == 0) {
			resetLap();
		} else if (typedPhrase.length > 0) {
			startLap();
		}
		if (typedPhrase.length > expectedPhrase.length) {
			typedPhrase = typedPhrase.slice(0, -1);
			if ($settings.sounds[SoundIndex.wrongletter]) playSound(Sounds.wrongLetter);
			return;
		}

		let key = event.key;
		// console.log(key);
		if (event.ctrlKey && key === 'Backspace') {
			initializePhrase();
			return;
		}
		if (key === 'Backspace') {
			typedPhrase = typedPhrase.slice(0, -1);
			// console.log('typedPhrase:' + typedPhrase);
			makeColorPhrase();
			if (typedPhrase.length == 0) {
				initializePhrase();
			}
			return;
		}
		if (key === 'Dead') {
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
		typedPhrase += key;
		let i = typedPhrase.length - 1;
		if (colorPhrase.length < typedPhrase.length) {
			let oldLength = colorPhrase.length;
			colorPhrase.length = typedPhrase.length;
			colorPhrase.fill(ColorChars.normalChar, oldLength, i);
		}
		if (key == expectedPhrase[i]) {
			if (colorPhrase[i] == ColorChars.normalChar || colorPhrase[i] == ColorChars.typingChar) {
				colorPhrase[i] = ColorChars.betterChar;
			} else {
				colorPhrase[i] = ColorChars.remedyChar;
			}
		} else {
			colorPhrase[i] = ColorChars.failedChar;
		}

		typedPhrase = typedPhrase.trimStart();
		if (!typedPhrase.length) {
			return;
		}

		startLap();

		if (expectedPhrase.startsWith(typedPhrase)) {
			if ($settings.sounds[SoundIndex.rightletter]) playSound(Sounds.rightLetter);
			rightLetters += 1;
		} else if (expectedPhrase !== typedPhrase.trimEnd()) {
			if ($settings.sounds[SoundIndex.wrongletter]) playSound(Sounds.wrongLetter);
			wrongLetters += 1;
		}

		// Full phrase correctly entered
		if (typedPhrase.trimEnd() === expectedPhrase) {
			// console.log('typedPhrase === expectedPhrase');
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
				initializePhrase();
				return;
			}

			// Goals Achieved
			let dataSource = $data.currentOptions;
			let newRoundStarted = dataSource.phrasesCurrentIndex == 0;
			if (newRoundStarted) {
				dataSource.WPMs = [];
			}
			dataSource.WPMs.push(rawWPM);

			if ($settings.sounds[SoundIndex.passedGoals]) playSound(Sounds.passedGoals);
			nextPhrase();
		} else {
			makeColorPhrase();
		}
	}

	function initializePhrase() {
		// console.log('resetLap():' + $lapTime);
		resetLap();
		rightLetters = 0;
		wrongLetters = 0;
		typedPhrase = '';
		colorPhrase.length = expectedPhrase.length;
		colorPhrase = colorPhrase.fill(ColorChars.normalChar, 0, expectedPhrase.length);
		colorPhrase[0] = ColorChars.typingChar;
		makeColorPhrase();
		phrasesCurrentIndex = $data.currentOptions.phrasesCurrentIndex;
		// console.log('resetCurrentPhrase phrasesCurrentIndex:' + $data.currentOptions.phrasesCurrentIndex);
	}

	function nextPhrase() {
		let dataSource = $data.currentOptions;
		let nextPhraseExists = dataSource.phrases.length > dataSource.phrasesCurrentIndex + 1;
		if (nextPhraseExists) {
			// console.log('nextPhrase phrasesCurrentIndex:' + dataSource.phrasesCurrentIndex);
			dataSource.phrasesCurrentIndex += 1;
			// console.log('nextPhrase phrasesCurrentIndex:' + dataSource.phrasesCurrentIndex);
			expectedPhrase = dataSource.phrases[dataSource.phrasesCurrentIndex];
			initializePhrase();
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

	function onDataChange(data: XgramData) {
		initializeLesson();
	}

	$: onDataChange($data);

	function handleMouseOver(event: MouseEvent) {
		isMouseInside = true;
		// console.log('handleMouseOver');
	}

	function handleMouseLeave(event: MouseEvent) {
		isMouseInside = false;
		endLap();
	}

	function handleBlur(event: FocusEvent) {
		isMouseInside = false;
		endLap();
	}

	function handleFocus(event: FocusEvent) {
		isMouseInside = true;
		// console.log('handleFocus');
	}
</script>

<div
	id="textZone"
	class={isMouseInside ? 'font-sans textFocus textZone' : 'font-sans textBlur textZone'}
	on:focus={handleFocus}
	on:blur={handleBlur}
	on:mouseover={handleMouseOver}
	on:mouseleave={handleMouseLeave}
	tabindex="-1">
	<h3>
		{#each classPhrase as cp}
			{#if cp.typing}
				<span class={'font-sans ' + cp.class + ' ' + ClassSpan[ColorChars.typingChar]}>{cp.chars}</span>
			{:else}
				<span class={'font-sans ' + cp.class}>{cp.chars}</span>
			{/if}
		{/each}
	</h3>
	<h4 class="flex place-content-evenly gap-x-3 mt-6">
		<div>
			<strong>Lesson {phrasesCurrentIndex} / {$data.currentOptions.phrases.length}</strong>
		</div>
	</h4>
	<h4 class="flex place-content-evenly gap-x-3 mt-0">
		<div>WPM: {rawWPM}</div>
		<div>Accuracy: {accuracy}%</div>
		<div>Average WPM: {averageWPM()}</div>
	</h4>
</div>
<div>
	<StopWatch />
</div>

<svelte:window on:keydown={onKeyDown} />
<!-- on:keyup={on_key_up} -->

<PlaySounds />
<div>
	<Celebration />
</div>

<style>
	h3 {
		font-size: 2em;
		justify-content: center;
		align-items: center;
		max-width: 100%;
		font-kerning: auto;
		/* font-family: 'Ubuntu Monokz', monospace; */
	}

	h4 {
		display: flex;
		font-size: 1em;
		justify-content: center;
		align-items: center;
		max-width: 100%;
		font-kerning: auto;
	}

	.textZone {
		margin: 1em 0;
		padding: 1em;
	}
	.textBlur {
		border-color: rgba(255, 0, 0, 0.6);
		box-shadow: inset 0 2px 2px rgba(0, 0, 0, 0.1), 0 0 8px rgba(255, 0, 0, 0.6);
	}
	.textFocus {
		cursor: none;
		border-color: rgba(0, 0, 255, 0.6);
		box-shadow: inset 0 2px 2px rgba(0, 0, 0, 0.1), 0 0 8px rgba(0, 0, 255, 0.6);
	}

	.normalChar {
		color: --theme-font-color;
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
		text-shadow: 0px 1px 1px #fff, 0px 2px 2px #fff;
	}
</style>
