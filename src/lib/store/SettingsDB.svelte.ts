import { ColorIndex } from "./Colors.svelte";
import { KeyboardIndex, LayoutIndex } from "./keyboard";

export enum SoundIndex {
	rightletter = 0,
	wrongletter,
	passedGoals,
	failedGoals,
	lessonsDone,
}
export const SoundNames = ["Right Letter", "Wrong Letter", "Passed Goals", "Failed Goals", "Lessons Done"];

// These do not cause changes to typing lessons
export class SettingsDB {
	colorIndex: ColorIndex = ColorIndex.fuchsia;
	font: string = "font-sourceCodePro ";
	keyboard: KeyboardIndex = KeyboardIndex.matrix;
	layout: LayoutIndex = LayoutIndex.colemakDH;
	minimumAccuracy: number = 100;
	minimumWPM: number = 40;
	showFingerColors: boolean = true;
	sounds: boolean[] = [true, true, true, true, true];
	volume: number = 0.5;

	constructor(init?: Partial<SettingsDB>) {
		if (init) {
			if (init.colorIndex !== undefined) this.colorIndex = init.colorIndex;
			if (init.font !== undefined) this.font = init.font;
			if (init.keyboard !== undefined) this.keyboard = init.keyboard;
			if (init.layout !== undefined) this.layout = init.layout;
			if (init.minimumAccuracy !== undefined) this.minimumAccuracy = init.minimumAccuracy;
			if (init.minimumWPM !== undefined) this.minimumWPM = init.minimumWPM;
			if (init.showFingerColors !== undefined) this.showFingerColors = init.showFingerColors;
			if (init.sounds !== undefined) this.sounds = init.sounds;
			if (init.volume !== undefined) this.volume = init.volume;
		}
	}

	#isDirty: boolean = false;
	set isDirty(value: boolean) {
		this.#isDirty = value;
	}
	get isDirty() {
		return this.#isDirty;
	}

	transferTo(settings: SettingsDB): void {
		console.log("SettingsState transferTo: ", this, settings);
		settings.minimumWPM = this.minimumWPM;
		settings.minimumAccuracy = this.minimumAccuracy;
		settings.sounds.length = 0;
		this.sounds.forEach((sound, i) => {
			if (settings.sounds[i] != sound) return false;
		});
		settings.sounds = this.sounds;
		settings.volume = this.volume;
		settings.font = this.font;
		settings.colorIndex = this.colorIndex;
		settings.keyboard = this.keyboard;
		settings.layout = this.layout;
		settings.showFingerColors = this.showFingerColors;
	}
}
