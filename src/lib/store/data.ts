import { browser } from '$app/environment';
import { TrinaryValue } from '$lib/utilities/DarkLight/trinary';
import { localStorageStore } from '@skeletonlabs/skeleton';
import type { Writable } from 'svelte/store';
import { get, writable } from 'svelte/store';
import typia from 'typia';
import bigrams from './bigrams';
import type { CodeLanguages, CodeMap } from './code';
import code from './code';
import hexagrams from './hexagrams';
import pangrams from './pangrams';
import pentagrams from './pentagrams';
import tetragrams from './tetragrams';
import trigrams from './trigrams';
import words from './words';

export const currentVersion: number = 0.01; // increment for schema changes.

export enum SoundIndex {
	rightletter = 0,
	wrongletter,
	passedGoals,
	failedGoals,
	lessonsDone,
}
export const SoundNames = ['Right Letter', 'Wrong Letter', 'Passed Goals', 'Failed Goals', 'Lessons Done'];

export const ScopeNames = ['Top 50', 'Top 100', 'Top 200', 'Top 500', 'Top 1000', 'Top 2000', 'Top 4000', 'Top 8000', 'Top 16000'];
export const ScopeValues = [50, 100, 200, 500, 1000, 2000, 4000, 8000, 16000];

export enum LanguageIndex {
	languageCpp = 0,
	languageCs,
	languageGo,
	languageJava,
	languageJavascript,
	languagePython,
	languageRust,
	languageSwift,
	languageTypescript,
}
export const LanguageNames = ['C++', 'C#', 'Go', 'Java', 'Javascript', 'Python', 'Rust', 'Swift', 'Typescript'];

// Indexes both Sources and their options
export enum OptionIndex {
	bigrams = 0,
	trigrams,
	tetragrams,
	pentagrams,
	hexagrams,
	pangrams,
	words,
	code_words,
	custom_words,
}
export const SourceNames = ['Bigrams', 'Trigrams', 'Tetragrams', 'Pentagrams', 'Hexagrams', 'Pangrams', 'Words']; // Code Words, Custom Words
class SourceOptions {
	scope: number = 50;
	combination: number = 2;
	repetition: number = 5;
	filter: string = '';
	WPMs: number[] = [];
	lines: string[] = [];
	linesCurrentIndex: number = 0;
}
class OptionsClass {
	'bigrams'?: SourceOptions;
	'trigrams'?: SourceOptions;
	'tetragrams'?: SourceOptions;
	'pentagrams'?: SourceOptions;
	'hexagrams'?: SourceOptions;
	'pangrams'?: SourceOptions;
	'words'?: SourceOptions;
	'code_words'?: SourceOptions;
	'custom_words'?: SourceOptions;
}

export class XgramSources {
	source: string[][] = [bigrams, trigrams, tetragrams, pentagrams, hexagrams, pangrams, words, [], []];
	code: CodeMap = code;
}

// These do not cause changes to typing lessons
export class XgramSettings {
	minimumWPM: number = 40;
	minimumAccuracy: number = 100;
	public sounds: boolean[] = [true, true, true, true, true];
	font: string = ' ';
}

export class XgramData {
	version: number = currentVersion;

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

	public source: number = OptionIndex.bigrams;
	public currentOptions: SourceOptions = new SourceOptions();
}

function dataParse(): XgramData {
	let aData: XgramData;
	try {
		aData = typia.assertParse<XgramData>(localStorage.getItem('data') ?? '');
	} catch (error) {
		aData = new XgramData();
	}
	return aData;
}

function settingsParse(): XgramSettings {
	let aSettings: XgramSettings;
	try {
		aSettings = typia.assertParse<XgramSettings>(localStorage.getItem('settings') ?? '');
	} catch (error) {
		aSettings = new XgramSettings();
	}
	// console.log('settingsParse aSettings.font:' + aSettings.font);

	return aSettings;
}

class MyStore {
	constructor(
		public data: Writable<XgramData> = writable<XgramData>(browser && 'data' in localStorage ? dataParse() : new XgramData()),
		public settings: Writable<XgramSettings> = writable<XgramSettings>(browser && 'settings' in localStorage ? settingsParse() : new XgramSettings()),
		public sources: Writable<XgramSources> = writable<XgramSources>(
			browser && 'sources' in localStorage ? typia.assertParse<XgramSources>(localStorage.getItem('sources') ?? '') ?? '' : new XgramSources()
		)
	) {
		// public userDarkLight: Writable<TrinaryValue> = writable<TrinaryValue>(
		// 	browser && 'userDarkLight' in localStorage ? typia.assertParse<TrinaryValue>(localStorage.getItem('userDarkLight') ?? '') : TrinaryValue.neither

		if (browser) {
			this.data.subscribe((value) => {
				// Skanky data manipulation TODO move to a dialog triggered function
				value.currentOptions = value.sourceOptions[value.source];

				localStorage.data = typia.assertStringify<XgramData>(value);
				// let s = typia.assertStringify<XgramData>(value);
				// localStorage.data = s;
				// console.log('data assertStringify:' + s.slice(0, 100));
			});
			this.settings.subscribe((value) => {
				localStorage.settings = typia.assertStringify<XgramSettings>(value);
				// console.log('localStorage.settings font:' + value.font);
			});
			this.sources.subscribe((value) => {
				localStorage.sources = typia.assertStringify<XgramSources>(value);
			});
			// this.userDarkLight.subscribe((value) => {
			// 	// get(this.userDarkLight).toggleBack();
			// 	// console.log('data assertStringify:' + JSON.stringify(value));
			// 	localStorage.userDarkLight = typia.assertStringify<TrinaryValue>(value);
			// });
		}
	}
}

// if (browser) {
// 	sessionStorage.clear();
// 	localStorage.clear();
// 	console.log('\nCLEARED\n');
// }

export const myStore = new MyStore();

export function deepCopy(original: any) {
	let clone = structuredClone(original);
	return clone;
}
