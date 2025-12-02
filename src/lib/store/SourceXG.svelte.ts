import { browser } from "$app/environment";
import { CodeXG, CodeIndex, CodeKeys, CodeNames } from "./code";
import { keys, getMany, setMany, clear } from "idb-keyval";
import typia from "typia";
import { loadState, LoadIndex } from "./loadState.svelte";
// import typia, { tags } from "typia";

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

// TODO switch to IDB completely
// TODO decompose the data structures
// TODO async fetch example

export const idbCodes = $state(new CodeXG());
export const idbSources = $state(new SourceXG());

async function applyServerSources(data: SourceXG) {
	if (loadState.traceDatabase) {
		console.log("applyServerSources data:", data);
		const key: string = SourceKeys[SourceIndex.bigrams];
		console.log("applyServerSources key:", key);
		console.log("applyServerSources data.bigrams:", data[key]);
		console.log("applyServerSources data.bigrams.length:", data[key].length);
	}

	setMany([
		[SourceNames[SourceIndex.bigrams], data.bigrams],
		[SourceNames[SourceIndex.trigrams], data.trigrams],
		[SourceNames[SourceIndex.tetragrams], data.tetragrams],
		[SourceNames[SourceIndex.pentagrams], data.pentagrams],
		[SourceNames[SourceIndex.hexagrams], data.hexagrams],
		[SourceNames[SourceIndex.pangrams], data.pangrams],
		[SourceNames[SourceIndex.words], data.words],
		[SourceNames[SourceIndex.codeWords], []],
		[SourceNames[SourceIndex.customWords], []],
	])
		.then(() => {
			if (loadState.traceDatabase) console.log("setMany idbSources succeeded");
		})
		.catch((err) => {
			if (loadState.traceDatabase) console.log("setMany idbSources failed!", err);
		});
}

async function applyServerCodes(code: CodeXG) {
	if (loadState.traceDatabase) {
		console.log("applyServerCodes code:", code);
		const key: string = CodeKeys[CodeIndex.cpp];
		// console.log("applyServerCodes key:", key);
		// console.log("applyServerCodes code.cpp:", code[key]);
		// console.log("applyServerCodes code['cpp']:", code["cpp"]);
		// console.log("applyServerCodes code['cpp']:", code.cpp);
		console.log("applyServerCodes code.cpp.length:", code[key].length);
	}

	setMany([
		[CodeNames[CodeIndex.cpp], code.cpp],
		[CodeNames[CodeIndex.cs], code.cs],
		[CodeNames[CodeIndex.go], code.go],
		[CodeNames[CodeIndex.java], code.java],
		[CodeNames[CodeIndex.javascript], code.javascript],
		[CodeNames[CodeIndex.python], code.python],
		[CodeNames[CodeIndex.rust], code.rust],
		[CodeNames[CodeIndex.swift], code.swift],
		[CodeNames[CodeIndex.typescript], code.typescript],
	])
		.then(() => {
			if (loadState.traceDatabase) console.log("setMany idbCodes succeeded");
		})
		.catch((err) => {
			if (loadState.traceDatabase) console.log("setMany idbCodes failed!", err);
		});
}

async function getServerSources() {
	const response = await fetch("/api/sources");
	if (!response.ok) {
		if (loadState.traceDatabase)
			console.log("Client getServerSources() failed: ", response.status, response.statusText);
		return;
	}

	let data: SourceXG;
	const preString: string = await response.text();
	// if (traceDatabase) console.log("Client getServerSources() preString ->", preString);

	try {
		data = typia.json.assertParse<SourceXG>(preString);
		if (loadState.traceDatabase) console.log("Client getServerSources() <SourceXG>(preString) ->", data);
	} catch (e) {
		data = new SourceXG();
		if (loadState.traceDatabase) console.log("Client getServerSources() typia failure ->", e);
		return;
	}

	return applyServerSources(data);
}

async function getServerLanguages() {
	const response = await fetch("/api/code");
	if (!response.ok) {
		if (loadState.traceDatabase)
			console.log("Client getServerLanguages() failed: ", response.status, response.statusText);
		return;
	}

	let data: CodeXG;
	const preString = await response.text();
	if (loadState.traceDatabase) console.log("Client getServerLanguages() preString ->", preString);

	try {
		data = typia.json.assertParse<CodeXG>(preString);
		if (loadState.traceDatabase) console.log("Client getServerLanguages() typia data ->", data);
	} catch {
		data = new CodeXG();
		if (loadState.traceDatabase) console.log("Client getServerLanguages() typia failure ->", data);
		return;
	}
	if (loadState.traceDatabase) console.log("Client getServerLanguages() data ->", data);

	return applyServerCodes(data);
}

if (browser) {
	if (loadState.clearDatabase) {
		clear().then(() => console.log("IndexedDB cleared"));
	} else {
		keys().then((keys) => {
			if (keys.length >= 18) {
				loadState.sourceXG = LoadIndex.retrievingIDB;
				if (loadState.traceDatabase) console.log("IndexedDB 18 keys exists so it is initialized");
			} else {
				loadState.sourceXG = LoadIndex.loadingServer;
				if (loadState.traceDatabase) console.log("IndexedDB missing keys, loading from server");
				getServerSources();
				getServerLanguages();
			}
		});

		// Kick off the getMany regardless
		// It is async and starts before keys() completes
		getMany([...SourceNames, ...CodeNames]).then(
			([
				bigramsIDB,
				trigramsIDB,
				tetragramsIDB,
				pentagramsIDB,
				hexagramsIDB,
				pangramsIDB,
				wordsIDB,
				codeWordsIDB,
				customWordsIDB,
				languageCppIDB,
				languageCsIDB,
				languageGoIDB,
				languageJavaIDB,
				languageJavascriptIDB,
				languagePythonIDB,
				languageRustIDB,
				languageSwiftIDB,
				languageTypescriptIDB,
			]) => {
				idbSources.bigrams = bigramsIDB;
				idbSources.trigrams = trigramsIDB;
				idbSources.tetragrams = tetragramsIDB;
				idbSources.pentagrams = pentagramsIDB;
				idbSources.hexagrams = hexagramsIDB;
				idbSources.pangrams = pangramsIDB;
				idbSources.words = wordsIDB;
				idbSources.codeWords = codeWordsIDB;
				idbSources.customWords = customWordsIDB;

				idbCodes.cpp = languageCppIDB;
				idbCodes.cs = languageCsIDB;
				idbCodes.go = languageGoIDB;
				idbCodes.java = languageJavaIDB;
				idbCodes.javascript = languageJavascriptIDB;
				idbCodes.python = languagePythonIDB;
				idbCodes.rust = languageRustIDB;
				idbCodes.swift = languageSwiftIDB;
				idbCodes.typescript = languageTypescriptIDB;
				if (loadState.traceDatabase) console.log("getMany retrieved, loadState.sourceXG = LoadIndex.loaded");
				loadState.sourceXG = LoadIndex.loaded;
			}
		);
	}
}
// import { clear } from 'idb-keyval';
// if (browser) clear().then(() => console.log('IndexedDB cleared'));
