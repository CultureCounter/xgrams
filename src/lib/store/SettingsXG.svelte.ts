import { get, set, keys, clear } from "idb-keyval";
import { tags } from "typia";
import { KeyboardIndex, LayoutIndex } from "./keyboard";
import { loadState, LoadIndex } from "./loadState.svelte";

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
	minimumWPM: number & tags.Type<"int32"> & tags.Minimum<0> & tags.Maximum<400> & tags.Default<40> = $state(40);
	minimumAccuracy: number & tags.Type<"int32"> & tags.Minimum<0> & tags.Maximum<100> & tags.Default<100> =
		$state(100);
	public sounds: boolean[] = $state([true, true, true, true, true]);
	volume: number & tags.Type<"int32"> & tags.Minimum<0> & tags.Maximum<100> & tags.Default<100> = $state(100);
	font: string = $state(" ");
	color: ColorIndex = $state(ColorIndex.fuchsia);
	keyboard: KeyboardIndex = $state(KeyboardIndex.matrix);
	layout: LayoutIndex = $state(LayoutIndex.colemakDH);
}

export const idbSettings = $state(new SettingsXG());
const idbSettingsKey = "idbSettings";

export async function loadSettings() {
	// Detect if IndexedDB is available if not use localStorage
	if (!("indexedDB" in window)) {
		console.log("This browser does not support IndexedDB.");
		return;
	}

	if (loadState.clearDatabase) {
		clear().then(() => console.log("IndexedDB cleared"));
		return;
	}

	loadState.settingsXG = LoadIndex.checkingIDB;
	keys().then((keys) => {
		if (keys.includes(idbSettingsKey)) {
			if (loadState.traceDatabase) console.log("IndexedDB has idbSettings so it is initialized");
			get(idbSettingsKey).then((value) => {
				if (value) {
					Object.assign(idbSettings, value);
				} else {
					console.log("loadSettings() did not find settings");
					saveSettings();
				}
			});
		} else {
			loadState.settingsXG = LoadIndex.loadingServer;
			if (loadState.traceDatabase) console.log("IndexedDB missing idbSettings, loading from server");
		}
	});
}

/** Saves the settings to IndexedDB
 */
export async function saveSettings(): Promise<void> {
	console.log("saveSettings() idbSettings:" + idbSettings);
	set(idbSettingsKey, idbSettings);
}
