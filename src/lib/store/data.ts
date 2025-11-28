import { browser } from "$app/environment";
import type { Writable } from "svelte/store";
import { writable } from "svelte/store";
import typia, { tags } from "typia";
import { KeyboardIndex, LayoutIndex } from "./keyboard";
import { SourceIndex } from "./xgramSources.svelte";

export const currentVersion = 1; // increment for schema changes.

export enum SoundIndex {
	rightletter = 0,
	wrongletter,
	passedGoals,
	failedGoals,
	lessonsDone,
}
export const SoundNames = [
	"Right Letter",
	"Wrong Letter",
	"Passed Goals",
	"Failed Goals",
	"Lessons Done",
];

export const ScopeNames = [
	"Top 50",
	"Top 100",
	"Top 200",
	"Top 500",
	"Top 1000",
	"Top 2000",
	"Top 4000",
	"Top 8000",
	"Top 16000",
];
export const ScopeValues = [50, 100, 200, 500, 1000, 2000, 4000, 8000, 16000];

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

class SourceOptions {
	scope: number & tags.Type<"int32"> & tags.Default<50> = 50;
	combination: number & tags.Type<"int32"> & tags.Default<2> = 2;
	repetition: number & tags.Type<"int32"> & tags.Default<20> = 20;
	filter = "";
	WPMs: number[] = [];
	lines: string[] = [];
	linesCurrentIndex: number & tags.Type<"int32"> & tags.Default<0> = 0;
}

// These do not cause changes to typing lessons
export class SettingsXG {
	minimumWPM = 40;
	minimumAccuracy = 100;
	public sounds: boolean[] = [true, true, true, true, true];
	font = " ";
	color: ColorIndex = ColorIndex.fuchsia;
	keyboard: KeyboardIndex = KeyboardIndex.matrix;
	layout: LayoutIndex = LayoutIndex.colemakDH;
}

export class DataXG {
	version: number & tags.Type<"int32"> = currentVersion;

	public languages: boolean[] = [false, false, false, false, false, false, false, false, false];

	public sourceOptions: SourceOptions[] = [
		new SourceOptions(),
		new SourceOptions(),
		new SourceOptions(),
		new SourceOptions(),
		new SourceOptions(),
		new SourceOptions(),
		new SourceOptions(),
		new SourceOptions(),
		new SourceOptions(),
	];

	public source: number & tags.Minimum<0> & tags.Maximum<8> = SourceIndex.bigrams;
	public currentOptions: SourceOptions = new SourceOptions();
}

function dataParse(): DataXG {
	let aData: DataXG;
	try {
		aData = typia.json.assertParse<DataXG>(localStorage.getItem("data") ?? "");
	} catch {
		aData = new DataXG();
	}
	return aData;
}

function settingsParse(): SettingsXG {
	let aSettings: SettingsXG;
	try {
		aSettings = typia.json.assertParse<SettingsXG>(localStorage.getItem("settings") ?? "");
	} catch {
		aSettings = new SettingsXG();
	}
	// console.log('settingsParse aSettings.font:' + aSettings.font);

	return aSettings;
}

class MyStore {
	constructor(
		public data: Writable<DataXG> = writable<DataXG>(
			browser && "data" in localStorage ? dataParse() : new DataXG()
		),
		public settings: Writable<SettingsXG> = writable<SettingsXG>(
			browser && "settings" in localStorage ? settingsParse() : new SettingsXG()
		)
	) {
		// public userDarkLight: Writable<TrinaryValue> = writable<TrinaryValue>(
		// 	browser && 'userDarkLight' in localStorage ? typia.json.assertParse<TrinaryValue>(localStorage.getItem('userDarkLight') ?? '') : TrinaryValue.neither

		if (browser) {
			this.data.subscribe((value) => {
				// Skanky data manipulation TODO move to a dialog triggered function
				value.currentOptions = value.sourceOptions[value.source];

				localStorage.setItem("data", typia.json.assertStringify<DataXG>(value));
			});
			this.settings.subscribe((value) => {
				localStorage.setItem("settings", typia.json.assertStringify<SettingsXG>(value));
			});
		}
	}
}

// if (browser) {
// 	sessionStorage.clear();
// 	localStorage.clear();
// 	console.log('\nCLEARED\n');
// }

export const myStore = new MyStore();

/**
 * Creates a deep clone of an object.
 * @param original
 * @returns the deep clone
 */
// eslint-disable-next-line
export function deepClone(original: any): any {
	return structuredClone(original);
}
