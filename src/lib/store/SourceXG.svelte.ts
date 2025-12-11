import { CodeXG, CodeKeys, CodeNames } from "./code";
import typia from "typia";
import { LoadState } from "./LoadState.svelte";
import { ServerStorage } from "$lib/ServerStorage.svelte";

// TODO add rolls sfbs etc.

// Indexes both Sources and their options
export enum SourceIndex {
	bigrams = 0,
	trigrams,
	tetragrams,
	pentagrams,
	hexagrams,
	pangrams,
	words,
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

export const SourceKeys = ["bigrams", "trigrams", "tetragrams", "pentagrams", "hexagrams", "pangrams", "words"];

export class SourceXG {
	[key: string]: string[];

	bigrams: string[] = $state([]);
	trigrams: string[] = $state([]);
	tetragrams: string[] = $state([]);
	pentagrams: string[] = $state([]);
	hexagrams: string[] = $state([]);
	pangrams: string[] = $state([]);
	words: string[] = $state([]);
}

// TODO decompose the data structures

export const idbCodesLoadState = new LoadState("idbCodes", false);
export const idbCodes = $state(
	new ServerStorage<CodeXG>(
		"idbCodes",
		CodeNames,
		CodeKeys as (keyof CodeXG)[],
		"/api/code",
		(text) => typia.json.assertParse<CodeXG>(text),
		new CodeXG(),
		idbCodesLoadState
	)
);

export const idbSourcesLoadState = new LoadState("idbSources", false);
export const idbSources = $state(
	new ServerStorage<SourceXG>(
		"idbSources",
		SourceNames,
		SourceKeys as (keyof SourceXG)[],
		"/api/sources",
		(text) => typia.json.assertParse<SourceXG>(text),
		new SourceXG(),
		idbSourcesLoadState
	)
);

// TODO: move this to a test file
LoadState.clearDatabase = false;
