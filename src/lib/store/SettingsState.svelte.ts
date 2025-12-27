/**
 * Shared keyboard and typing state for keyboard layout and highlighting.
 * Updated by Typist.svelte and Settings.svelte, consumed by Keyboard.svelte
 */

import { KeyboardIndex, LayoutIndex } from "./keyboard";

export class KeyboardState {
	#keyboard = $state(KeyboardIndex.matrix);
	#layout = $state(LayoutIndex.colemakDH);
	#nextChar = $state("");
	#showFingerColors = $state(true);
	#typedLength = $state(0);

	update(keyboard: KeyboardIndex, layout: LayoutIndex, showFingerColors: boolean) {
		this.#keyboard = keyboard;
		this.#layout = layout;
		this.#showFingerColors = showFingerColors;
	}

	get keyboard() {
		return this.#keyboard;
	}
	set keyboard(value: KeyboardIndex) {
		this.#keyboard = value;
	}
	get layout() {
		return this.#layout;
	}
	set layout(value: LayoutIndex) {
		this.#layout = value;
	}
	get nextChar() {
		return this.#nextChar;
	}
	set nextChar(value: string) {
		this.#nextChar = value;
	}
	get showFingerColors() {
		return this.#showFingerColors;
	}
	set showFingerColors(value: boolean) {
		this.#showFingerColors = value;
	}
	get typedLength() {
		return this.#typedLength;
	}
	set typedLength(value: number) {
		this.#typedLength = value;
	}
}

export const keyboardState = new KeyboardState();
