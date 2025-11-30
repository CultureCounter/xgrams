import { browser } from "$app/environment";
import type { Writable } from "svelte/store";
import { writable } from "svelte/store";
import typia, { tags } from "typia";
import { SourceIndex } from "./xgramSources.svelte";
import { settingsParse, SettingsXG } from "./SettingsXG.svelte";
import { LessonXG } from "./LessonXG";

export const currentVersion = 1; // increment for schema changes.

export class DataXG {
	version: number & tags.Type<"int32"> = currentVersion;

	public languages: boolean[] = [false, false, false, false, false, false, false, false, false];

	public sourceOptions: LessonXG[] = [
		new LessonXG(),
		new LessonXG(),
		new LessonXG(),
		new LessonXG(),
		new LessonXG(),
		new LessonXG(),
		new LessonXG(),
		new LessonXG(),
		new LessonXG(),
	];

	public source: number & tags.Minimum<0> & tags.Maximum<8> = SourceIndex.bigrams;
	public currentOptions: LessonXG = new LessonXG();
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
