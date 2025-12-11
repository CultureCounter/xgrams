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
	"helveticaNeue ",
	"calibri ",
	"candara ",
	"century ",
	"dejavu ",
	"notoSans ",
	"optima ",
	"roboto ",
	"ubuntu ",
	"verdana ",

	"font-serif ",
	"baskerville ",
	"calistoMT ",
	"cambria ",
	"didot ",
	"garamond ",
	"georgia ",
	"notoSerif ",
	"palatino ",

	"font-mono ",
	"font-andaleMono ",
	"font-consolas ",
	"font-courierNew ",
	"ubuntuMono ",
	"font-luminari ",
	"font-comicSansMS ",
];

export const FontFamilyNames = [
	"---Sans-Serif---",
	"Helvetica Neue",
	"Calibri",
	"Candara",
	"Century",
	"Dejavu Sans",
	"Noto Sans",
	"Optima",
	"Roboto",
	"Ubuntu",
	"Verdana",
	"---Serif---",
	"Baskerville",
	"Calisto MT",
	"Cambria",
	"Didot",
	"Garamond",
	"Georgia",
	"Noto Serif",
	"Palatino",
	"---Mono---",
	"Andale Mono",
	"Consolas",
	"Courier New",
	"Ubuntu Mono",
	"Luminari",
	"Comic Sans MS",
];

export enum ColorIndex {
	red = 0,
	orange,
	amber,
	yellow,
	lime,
	green,
	emerald,
	teal,
	cyan,
	sky,
	blue,
	indigo,
	violet,
	purple,
	fuchsia,
	pink,
	rose,
	slate,
	gray,
	zinc,
	neutral,
	stone,
}
export const ColorNames = [
	"red",
	"orange",
	"amber",
	"yellow",
	"lime",
	"green",
	"emerald",
	"teal",
	"cyan",
	"sky",
	"blue",
	"indigo",
	"violet",
	"purple",
	"fuchsia",
	"pink",
	"rose",
	"slate",
	"gray",
	"zinc",
	"neutral",
	"stone",
];

// These do not cause changes to typing lessons
export class SettingsXG {
	minimumWPM: number = 40;
	minimumAccuracy: number = 100;
	sounds: boolean[] = [true, true, true, true, true];
	volume: number = 100;
	font: string = " ";
	color: ColorIndex = ColorIndex.fuchsia;
	keyboard: KeyboardIndex = KeyboardIndex.matrix;
	layout: LayoutIndex = LayoutIndex.colemakDH;

	constructor(init?: Partial<SettingsXG>) {
		if (init) {
			if (init.minimumWPM !== undefined) this.minimumWPM = init.minimumWPM;
			if (init.minimumAccuracy !== undefined) this.minimumAccuracy = init.minimumAccuracy;
			if (init.sounds !== undefined) this.sounds = init.sounds;
			if (init.volume !== undefined) this.volume = init.volume;
			if (init.font !== undefined) this.font = init.font;
			if (init.color !== undefined) this.color = init.color;
			if (init.keyboard !== undefined) this.keyboard = init.keyboard;
			if (init.layout !== undefined) this.layout = init.layout;
		}
	}
}

// const key = "idbSettings";
// const idbSettingsLoadState: LoadState = new LoadState("idbSettings", true);
// export const idbSettings: SettingsXG =
// 	!browser ?
// 		$state(new SettingsXG())
// 	:	$state(
// 			get(key).then((val: SettingsXG | undefined): SettingsXG => {
// 				if (val === undefined) {
// 					idbSettingsLoadState.setState(LoadIndex.default);
// 					const settings = new SettingsXG();
// 					set(key, settings);
// 					idbSettingsLoadState.setState(LoadIndex.loaded);
// 					return settings;
// 				} else {
// 					idbSettingsLoadState.setState(LoadIndex.loaded);
// 					return val;
// 				}
// 			})
// 		);
