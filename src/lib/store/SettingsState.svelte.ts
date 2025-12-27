/**
 * Shared keyboard and typing state for keyboard layout and highlighting.
 * Updated by Typist.svelte and Settings.svelte, consumed by Keyboard.svelte
 */

import { ColorIndex } from "./Colors.svelte";
import { KeyboardIndex, LayoutIndex } from "./keyboard";
import type { SettingsDB } from "./SettingsDB.svelte";

export class SettingsState {
	#colorIndex = $state(ColorIndex.lime);
	#font = $state("font-sourceCodePro ");
	#keyboard = $state(KeyboardIndex.matrix);
	#layout = $state(LayoutIndex.colemakDH);
	#nextChar = $state("");
	#showFingerColors = $state(true);
	#typedLength = $state(0);
	#volume = $state(0.5);

	update(settingsDB: SettingsDB) {
		this.#colorIndex = settingsDB.colorIndex;
		this.#font = settingsDB.font;
		this.#keyboard = settingsDB.keyboard;
		this.#layout = settingsDB.layout;
		this.#showFingerColors = settingsDB.showFingerColors;
		this.#volume = settingsDB.volume;
	}

	get colorIndex() {
		return this.#colorIndex;
	}
	set colorIndex(value: ColorIndex) {
		this.#colorIndex = value;
	}
	get font() {
		return this.#font;
	}
	set font(value: string) {
		this.#font = value;
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
	get volume() {
		return this.#volume;
	}
	set volume(value: number) {
		this.#volume = value;
	}
}

export const settingsState = new SettingsState();
