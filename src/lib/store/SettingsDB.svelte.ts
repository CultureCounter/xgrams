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

export const FontFamilyCSS = [
	"font-sans ",
	"font-arial ",
	"font-notoSans ",
	"font-roboto ",
	"font-segoeUI ",
	"font-tahoma ",
	"font-verdana ",
	"font-serif ",
	"font-century ",
	"font-garamond ",
	"font-georgia ",
	"font-notoSerif ",
	"font-palatino ",
	"font-timesNewRoman ",
	"font-mono ",
	"font-cascadiaMono ",
	"font-courierNew ",
	"font-sourceCodePro ",
	"font-ubuntuMono ",
];

export const FontFamilyNames = [
	"---Sans-Serif---",
	"Arial",
	"Noto Sans",
	"Roboto",
	"Segoe UI",
	"Tahoma",
	"Verdana",
	"---Serif---",
	"Century",
	"Garamond",
	"Georgia",
	"Noto Serif",
	"Palatino Linotype",
	"Times New Roman",
	"---Mono---",
	"Cascadia Mono",
	"Courier New",
	"Source Code Pro",
	"Ubuntu Mono",
];
export const FontSizeCSS = [
	"text-xs ",
	"text-sm ",
	"text-base ",
	"text-lg ",
	"text-xl ",
	"text-2xl ",
	"text-3xl ",
	"text-4xl ",
	"text-5xl ",
	"text-6xl ",
	"text-7xl ",
	"text-8xl ",
	"text-9xl ",
];
export const FontSizeNames = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "8xl", "9xl"];
export const FontWeightCSS = [
	"font-thin ",
	"font-extralight ",
	"font-light ",
	"font-normal ",
	"font-medium ",
	"font-semibold ",
	"font-bold ",
	"font-extrabold ",
	"font-black ",
];
export const FontWeightNames = [
	"thin",
	"extra light",
	"light",
	"normal",
	"medium",
	"bold",
	"semibold",
	"extrabold",
	"black",
];
export const FontSpacingCSS = [
	"tracking-tighter ",
	"tracking-tight ",
	"tracking-normal ",
	"tracking-wide ",
	"tracking-wider ",
	"tracking-widest ",
];

// These do not cause changes to typing lessons
export class SettingsDB {
	minimumWPM: number = 40;
	minimumAccuracy: number = 100;
	sounds: boolean[] = [true, true, true, true, true];
	volume: number = 100;
	font: string = " ";
	colorIndex: ColorIndex = ColorIndex.fuchsia;
	keyboard: KeyboardIndex = KeyboardIndex.matrix;
	layout: LayoutIndex = LayoutIndex.colemakDH;

	constructor(init?: Partial<SettingsDB>) {
		if (init) {
			if (init.minimumWPM !== undefined) this.minimumWPM = init.minimumWPM;
			if (init.minimumAccuracy !== undefined) this.minimumAccuracy = init.minimumAccuracy;
			if (init.sounds !== undefined) this.sounds = init.sounds;
			if (init.volume !== undefined) this.volume = init.volume;
			if (init.font !== undefined) this.font = init.font;
			if (init.colorIndex !== undefined) this.colorIndex = init.colorIndex;
			if (init.keyboard !== undefined) this.keyboard = init.keyboard;
			if (init.layout !== undefined) this.layout = init.layout;
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
	}
}
