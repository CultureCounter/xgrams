import { browser } from "$app/environment";
// import type { Writable } from "svelte/store";
// import { writable } from "svelte/store";
import { tags } from "typia";
import { SourceIndex } from "./SourceXG.svelte";
import { LessonXG } from "./LessonXG.svelte.ts";
import { clear, get, keys, set } from "idb-keyval";
import { LoadIndex, loadState } from "./loadState.svelte";

export const currentVersion = 1; // increment for schema changes.

/**
 * DataXG stores LessonXG for each datasource.
 * Changes cause the lesson or lines to regenerate.
 */
export class DataXG {
	version: number & tags.Type<"int32"> = currentVersion;

	public languages: boolean[] = $state([false, false, false, false, false, false, false, false, false]);

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

export const idbLessons = $state(new DataXG());
const idbLessonsKey = "idbLessons";

export async function loadData() {
	if (!browser) return;

	if (!("indexedDB" in window)) {
		console.log("This browser does not support IndexedDB.");
		return;
	}

	if (loadState.clearDatabase) {
		clear().then(() => console.log("IndexedDB cleared"));
		return;
	}

	loadState.idbLessons = LoadIndex.checkingIDB;
	keys().then((keys) => {
		if (keys.includes(idbLessonsKey)) {
			if (loadState.traceDatabase) console.log("IndexedDB has idbLessons so it is initialized");
			get(idbLessonsKey).then((value) => {
				if (value) {
					loadState.idbLessons = LoadIndex.loaded;
					Object.assign(idbLessons, value);
				} else {
					console.log("loadData() did not find data");
					saveData();
				}
			});
		} else {
			loadState.idbLessons = LoadIndex.loadingServer;
			if (loadState.traceDatabase) console.log("IndexedDB missing idbLessons, loading from server");
		}
	});
}

export async function saveData(): Promise<void> {
	console.log("saveData() idbLessons:" + idbLessons);
	set(idbLessonsKey, idbLessons);
}
loadData();

// function dataParse(): DataXG {
// 	let aData: DataXG;
// 	try {
// 		aData = typia.json.assertParse<DataXG>(localStorage.getItem("data") ?? "");
// 	} catch {
// 		aData = new DataXG();
// 	}
// 	return aData;
// }

// class MyStore {
// 	constructor(
// 		public data: Writable<DataXG> = writable<DataXG>(browser && "data" in localStorage ? dataParse() : new DataXG())
// 	) {
// 		if (browser) {
// 			this.data.subscribe((value) => {
// 				// Skanky data manipulation TODO move to a dialog triggered function
// 				value.currentOptions = value.sourceOptions[value.source];

// 				localStorage.setItem("data", typia.json.assertStringify<DataXG>(value));
// 			});
// 		}
// 	}
// }
// export const myStore = new MyStore();

// if (browser) {
// 	sessionStorage.clear();
// 	localStorage.clear();
// 	console.log('\nCLEARED\n');
// }

/**
 * Creates a deep clone of an object.
 * @param original
 * @returns the deep clone
 */
// eslint-disable-next-line
export function deepClone(original: any): any {
	return structuredClone(original);
}
