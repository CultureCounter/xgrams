import { browser } from "$app/environment";
import { CodeXG, CodeIndex, CodeKeys, CodeNames } from "./code";
import { keys, getMany, setMany, clear } from "idb-keyval";
import typia from "typia";
// import typia, { tags } from "typia";

// Debugging flags
const clearDatabase = false;
const traceDatabase = true;

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
	codeWords: string[] = $state([]);
	customWords: string[] = $state([]);
}

// TODO switch to IDB completely
// TODO decompose the data structures
// TODO async fetch example

export const idbLanguages = $state(new CodeXG());
export const idbSources = $state(new SourceXG());

async function applyServerSources(data: SourceXG) {
	if (traceDatabase) {
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
			if (traceDatabase) console.log("setMany idbSources succeeded");
		})
		.catch((err) => {
			if (traceDatabase) console.log("setMany idbSources failed!", err);
		});
}

async function applyServerLanguages(code: CodeXG) {
	if (traceDatabase) {
		console.log("applyServerLanguages code:", code);
		const key: string = CodeKeys[CodeIndex.languageCpp];
		// console.log("applyServerLanguages key:", key);
		// console.log("applyServerLanguages code.languageCpp:", code[key]);
		// console.log("applyServerLanguages code['languageCpp']:", code["languageCpp"]);
		// console.log("applyServerLanguages code['languageCpp']:", code.languageCpp);
		console.log("applyServerLanguages code.languageCpp.length:", code[key].length);
	}

	setMany([
		[CodeNames[CodeIndex.languageCpp], code.languageCpp],
		[CodeNames[CodeIndex.languageCs], code.languageCs],
		[CodeNames[CodeIndex.languageGo], code.languageGo],
		[CodeNames[CodeIndex.languageJava], code.languageJava],
		[CodeNames[CodeIndex.languageJavascript], code.languageJavascript],
		[CodeNames[CodeIndex.languagePython], code.languagePython],
		[CodeNames[CodeIndex.languageRust], code.languageRust],
		[CodeNames[CodeIndex.languageSwift], code.languageSwift],
		[CodeNames[CodeIndex.languageTypescript], code.languageTypescript],
	])
		.then(() => {
			if (traceDatabase) console.log("setMany idbLanguages succeeded");
		})
		.catch((err) => {
			if (traceDatabase) console.log("setMany idbLanguages failed!", err);
		});
}

async function getServerSources() {
	const response = await fetch("/api/sources");
	if (!response.ok) {
		if (traceDatabase)
			console.log("Client getServerSources() failed: ", response.status, response.statusText);
		return;
	}

	let data: SourceXG;
	const preString: string = await response.text();
	// if (traceDatabase) console.log("Client getServerSources() preString ->", preString);

	try {
		data = typia.json.assertParse<SourceXG>(preString);
		if (traceDatabase) console.log("Client getServerSources() <SourceXG>(preString) ->", data);
	} catch (e) {
		data = new SourceXG();
		if (traceDatabase) console.log("Client getServerSources() typia failure ->", e);
		return;
	}

	return applyServerSources(data);
}

async function getServerLanguages() {
	const response = await fetch("/api/code");
	if (!response.ok) {
		if (traceDatabase)
			console.log("Client getServerLanguages() failed: ", response.status, response.statusText);
		return;
	}

	let data: CodeXG;
	const preString = await response.text();
	if (traceDatabase) console.log("Client getServerLanguages() preString ->", preString);

	try {
		data = typia.json.assertParse<CodeXG>(preString);
		if (traceDatabase) console.log("Client getServerLanguages() typia data ->", data);
	} catch {
		data = new CodeXG();
		if (traceDatabase) console.log("Client getServerLanguages() typia failure ->", data);
		return;
	}
	if (traceDatabase) console.log("Client getServerLanguages() data ->", data);

	return applyServerLanguages(data);
}

if (browser) {
	if (clearDatabase) {
		clear().then(() => console.log("IndexedDB cleared"));
	} else {
		keys().then((keys) => {
			if (keys.length == 18) {
				if (traceDatabase) console.log("IndexedDB 18 keys exists so it is initialized");
			} else {
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
				// console.log('getMany retrieved');
				idbSources.bigrams = bigramsIDB;
				idbSources.trigrams = trigramsIDB;
				idbSources.tetragrams = tetragramsIDB;
				idbSources.pentagrams = pentagramsIDB;
				idbSources.hexagrams = hexagramsIDB;
				idbSources.pangrams = pangramsIDB;
				idbSources.words = wordsIDB;
				idbSources.codeWords = codeWordsIDB;
				idbSources.customWords = customWordsIDB;

				idbLanguages.languageCpp = languageCppIDB;
				idbLanguages.languageCs = languageCsIDB;
				idbLanguages.languageGo = languageGoIDB;
				idbLanguages.languageJava = languageJavaIDB;
				idbLanguages.languageJavascript = languageJavascriptIDB;
				idbLanguages.languagePython = languagePythonIDB;
				idbLanguages.languageRust = languageRustIDB;
				idbLanguages.languageSwift = languageSwiftIDB;
				idbLanguages.languageTypescript = languageTypescriptIDB;
			}
		);
	}
}
// import { clear } from 'idb-keyval';
// if (browser) clear().then(() => console.log('IndexedDB cleared'));
