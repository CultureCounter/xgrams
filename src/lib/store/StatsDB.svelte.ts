import { arrayCopyNumber, arrayEqualNumber, copyStringMap } from "$lib/utilities/utils";
import { getKeyboard, KeyboardIndex, type LayoutIndex } from "./keyboard";

export class StatsDB {
	/** Use automatic filtering to progress lessons over time */
	autoFilter: boolean = true;

	/** Per letter accuracy tracking: Map<letter, LetterStats> */
	// eslint-disable-next-line svelte/prefer-svelte-reactivity
	stats: Map<string, LetterStats> = new Map<string, LetterStats>();

	/** Number of focus letters for filter generation */
	focusLetters: number = 5;

	/** History length. After this many perfect lessons for a key, it's stats are reset */
	maxHistory: number = 5;

	/** WPMs for each entire lesson */
	WPMs: number[] = [];

	constructor(init?: Partial<StatsDB>) {
		if (init) {
			if (init.autoFilter !== undefined) this.autoFilter = init.autoFilter;
			if (init.stats !== undefined) {
				copyStringMap(init.stats, this.stats);
			}
			if (init.focusLetters !== undefined) this.focusLetters = init.focusLetters;
			if (init.maxHistory !== undefined) this.maxHistory = init.maxHistory;
			if (init.WPMs !== undefined) this.WPMs = init.WPMs;
		}
	}

	#isDirty: boolean = false;
	set isDirty(value: boolean) {
		this.#isDirty = value;
	}
	get isDirty() {
		return this.#isDirty;
	}

	updateFrom(stats: StatsDB): boolean {
		let didChange = false;

		if (this.autoFilter !== stats.autoFilter) {
			this.autoFilter = stats.autoFilter;
			didChange = true;
		}
		copyStringMap(stats.stats, this.stats);

		if (this.focusLetters !== stats.focusLetters) {
			this.focusLetters = stats.focusLetters;
			didChange = true;
		}
		if (this.maxHistory !== stats.maxHistory) {
			this.maxHistory = stats.maxHistory;
			didChange = true;
		}

		if (!arrayEqualNumber(stats.WPMs, this.WPMs)) {
			arrayCopyNumber(stats.WPMs, this.WPMs);
			didChange = true;
		}

		return didChange;
	}

	/**
	 * Record a keystroke for accuracy tracking
	 * @param char Expected character
	 * @param isCorrect Typed correctly
	 * @param elapsedMs Time elapsed since last keystroke
	 */
	recordKeystroke(char: string, isCorrect: boolean, elapsedMs: number) {
		if (!char || char.length !== 1) return;

		let stats = this.stats.get(char);
		if (!stats) {
			stats = new LetterStats();
			this.stats.set(char, stats);
		}

		if (isCorrect) {
			stats.correct++;
		} else {
			stats.incorrect++;
			stats.perfections = 0;
		}
		stats.typingTime += elapsedMs;

		this.#isDirty = true;
	}

	/**
	 * Get the keys for a lesson in home row order, then thumb if any, then above, then below, then left, then right, then punctuation.
	 * @param keyboardIndex
	 * @param layoutIndex
	 * @returns string[]
	 */
	setLessonKeys(keyboardIndex: KeyboardIndex, layoutIndex: LayoutIndex) {
		const keyMap = getKeyboard(keyboardIndex, layoutIndex);

		// home row, alternating from index to pinky
		const keyOrder = KeyOrders[keyboardIndex];
		keyOrder.forEach(([row, col]) => {
			if (row !== undefined && col !== undefined) {
				const key = keyMap.keyCaps[row]![col]!;
				if (key === undefined) {
					console.error("getLessonKeys: key undefined for row:", row, "col:", col, "keyMap:", keyMap);
					return;
				}
				if (!this.stats.has(key)) {
					this.stats.set(key, new LetterStats());
				} else {
					// TODO wrangle stats to get to targetLetters worth of bad keys
					// TODO random chance of retesting a perfection key just in case
					// TODO supreme sophonts get wpm increment
				}
			}
		});

		return this.stats;
	}

	/**
	 * Get the N letters with the lowest accuracy ratios
	 * @param minimumAccuracy Minimum accuracy required
	 * @param minimumWPM Minimum WPM required
	 * @param count Number of letters to return
	 * @returns Array of letters sorted by worst accuracy first
	 */
	getLessonLetters(minimumAccuracy: number, minimumWPM: number, count: number = this.focusLetters): string[] {
		// Calculate accuracy ratio for each letter and sort
		const perfections: Record<string, LetterStats> = {};

		let perfects = 0;
		let forSures = 0;
		let probables = 0;
		for (const [letter, stats] of this.stats.entries()) {
			const score = stats.scoreMe(minimumAccuracy, minimumWPM, this.maxHistory);
			if (score <= 0) {
				// Lower score = worse accuracy
				perfections[letter] = stats;
				forSures++;
			} else if (score < 100) {
				// Higher score = better accuracy
				perfections[letter] = stats;
				probables++;
			} else {
				if (Math.random() < 0.05) {
					perfections[letter] = stats;
					perfects++;
				}
			}
			// TODO: if all perfects, then increase wpm? Ensure perfection though.
			if (perfects + forSures + probables >= count) break;
		}

		// TODO: sort by details
		// // Sort by accuracy ratio ascending (worst first), then by total attempts descending (more data = more reliable)
		// letterAccuracies.sort((a, b) => {
		// 	if (a.ratio !== b.ratio) return a.ratio - b.ratio;
		// 	return b.total - a.total;
		// });

		return Object.keys(perfections);
	}

	/**
	 * Generate a filter pattern from worst-performing letters
	 * Each letter goes on its own line (OR'd in filter logic)
	 * @returns Filter string with worst letters
	 */
	generateFilterPattern(lessonLetters: string[]): string {
		if (lessonLetters.length === 0) return "";

		// Each letter on its own line = OR'd together in filter logic
		return lessonLetters.join("\n");
	}
}

/** Accuracy and Time statistics
 * Recorded over several lessons, one LetterStats per lesson per key targeted
 * Old stats dropped when history limit exceeded with a perfect run of lessons
 */
class LetterStats {
	/** Total correct keystrokes */
	correct: number = 0;
	/** Total incorrect keystrokes */
	incorrect: number = 0;
	/** Accumulated typing time in ms */
	typingTime: number = 0;
	/** Number of lessons with perfect typing and wpm for this key */
	perfections: number = 0;

	#score: number = 0;
	get score(): number {
		return this.#score;
	}
	scoreMe(minimumAccuracy: number, minimumWPM: number, maxHistory: number): number {
		const total = this.correct + this.incorrect;
		if (total === 0) {
			this.#score = 0;
			return 0;
		}

		// reset if max history reached with perfect lessons
		// this allows higher skill to be more accurately reflected
		if (this.perfections >= maxHistory && this.incorrect > 0) {
			this.perfections = 0;
			this.correct = 0;
			this.incorrect = 0;
			this.typingTime = 0;
			this.#score = 0;
			return 0;
		}

		const accuracy = this.correct / total;
		let score = accuracy * 100;
		// accuracy penalty
		if (accuracy < minimumAccuracy) {
			score -= (100 * (minimumAccuracy - accuracy)) / minimumAccuracy;
		}
		// wpm penalty
		const wpm = total / this.typingTime / 60000;
		if (wpm < minimumWPM) {
			score -= (100 * (minimumWPM - wpm)) / minimumWPM;
		}
		this.#score = score;
		return score;
	}
}

// prettier-ignore
const KeyOrders: Record<KeyboardIndex, number[][]> = {
	[KeyboardIndex.matrix]:[
		[2, 7], [2, 4], [2, 8], [2, 3], [2, 9], [2, 2], [2, 10], [2, 1], 
		[1, 7], [1, 4], [1, 8], [1, 3], [1, 9], [1, 2], [1, 10], [1, 1], 
		[3, 7], [3, 4], [3, 8], [3, 3], [3, 9], [3, 2], [3, 10], [3, 1], 
		[1, 5], [1, 6], [2, 5], [2, 6], [3, 5], [3, 6], [1, 0], [1, 11],[2, 0], [2, 11],[3, 0], [3, 11],
		[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9], [0, 10], [0, 11],
		[4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5],
		// 1       p       r       m       i      ir      il       i       m       r       p       12
	],
	[KeyboardIndex.ansi]: [
		[2, 6], [2, 7], [2, 8], [2, 9], 
		[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9], [0, 10], [0, 11],
		[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8], [1, 9], [1, 10], [1, 11],
		[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 10], [2, 11],
		[3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7], [3, 8], [3, 9], [3, 10], [3, 11],
		[4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8], [4, 9], [4, 10], [4, 11],
	],
	[KeyboardIndex.iso]: [
		[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9], [0, 10], [0, 11],
		[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8], [1, 9], [1, 10], [1, 11],
		[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8], [2, 9], [2, 10], [2, 11],
		[3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7], [3, 8], [3, 9], [3, 10], [3, 11],
		[4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8], [4, 9], [4, 10], [4, 11],
	],
};
