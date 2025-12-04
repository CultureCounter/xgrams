import { browser } from "$app/environment";
import { CodeXG, CodeKeys, CodeNames } from "./code";
import { clear } from "idb-keyval";
import typia from "typia";
import { loadState } from "./loadState.svelte";
import { ServerStorage } from "$lib/ServerStorage.svelte";

// Indexes both Sources and their options
export enum SourceIndex {
	bigrams = 0,
	trigrams,
	tetragrams,
	pentagrams,
	hexagrams,
	pangrams,
	words,
	codeWords,
	customWords,
}
export const SourceNames: string[] = [
	"Bigrams",
	"Trigrams",
	"Tetragrams",
	"Pentagrams",
	"Hexagrams",
	"Pangrams",
	"Words",
	"Code",
	"Custom",
];

export const SourceKeys = [
	"bigrams",
	"trigrams",
	"tetragrams",
	"pentagrams",
	"hexagrams",
	"pangrams",
	"words",
	"codeWords",
	"customWords",
];

export class SourceXG {
	[key: string]: string[];

	bigrams: string[] = $state([]);
	trigrams: string[] = $state([]);
	tetragrams: string[] = $state([]);
	pentagrams: string[] = $state([]);
	hexagrams: string[] = $state([]);
	pangrams: string[] = $state([]);
	words: string[] = $state([]);
	codeWords: string[] = [];
	customWords: string[] = [];
}

// TODO decompose the data structures

export const idbCodes = $state(
	new ServerStorage<CodeXG>(
		"idbCodes",
		CodeNames,
		CodeKeys as (keyof CodeXG)[],
		"/api/code",
		(text) => typia.json.assertParse<CodeXG>(text),
		new CodeXG()
	)
);

export const idbSources = $state(
	new ServerStorage<SourceXG>(
		"idbSources",
		SourceNames,
		SourceKeys as (keyof SourceXG)[],
		"/api/sources",
		(text) => typia.json.assertParse<SourceXG>(text),
		new SourceXG()
	)
);

if (browser) {
	if (loadState.clearDatabase) {
		clear().then(() => console.log("IndexedDB cleared"));
	}
}
