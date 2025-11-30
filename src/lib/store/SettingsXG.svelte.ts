import typia, { tags } from "typia";
import { KeyboardIndex, LayoutIndex } from "./keyboard";

// These do not cause changes to typing lessons

export class SettingsXG {
	minimumWPM: number & tags.Type<"int32"> & tags.Minimum<0> & tags.Maximum<400> & tags.Default<40> = 40;
	minimumAccuracy: number & tags.Type<"int32"> & tags.Minimum<0> & tags.Maximum<100> & tags.Default<100> = 100;
	public sounds: boolean[] = [true, true, true, true, true];
	font: string = $state(" ");
	color: ColorIndex = ColorIndex.fuchsia;
	keyboard: KeyboardIndex = KeyboardIndex.matrix;
	layout: LayoutIndex = LayoutIndex.colemakDH;
}
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

export function settingsParse(): SettingsXG {
	let aSettings: SettingsXG;
	try {
		aSettings = typia.json.assertParse<SettingsXG>(localStorage.getItem("settings") ?? "");
	} catch {
		aSettings = new SettingsXG();
	}
	// console.log('settingsParse aSettings.font:' + aSettings.font);
	return aSettings;
}
