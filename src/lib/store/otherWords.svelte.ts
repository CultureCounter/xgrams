import { CodeIndex } from "./code";
import { SourceXG } from "./SourceXG.svelte";

/**
 * Dynamically generated Programming Language words
 */
export const codeWords: string[] = $state([]);

export const OtherNames: string[] = ["Code", "CustomS"];
export enum OtherIndex {
	code = 0,
	custom,
}

export function updateCodeWords(idbCodeWords: typeof codeWords, idbCodes: SourceXG) {
	codeWords.length = 0;
	codeWords.push(
		...(idbCodeWords[CodeIndex.cpp] ? idbCodes.cpp : []),
		...(idbCodeWords[CodeIndex.cs] ? idbCodes.cs : []),
		...(idbCodeWords[CodeIndex.go] ? idbCodes.go : []),
		...(idbCodeWords[CodeIndex.java] ? idbCodes.java : []),
		...(idbCodeWords[CodeIndex.javascript] ? idbCodes.javascript : []),
		...(idbCodeWords[CodeIndex.python] ? idbCodes.python : []),
		...(idbCodeWords[CodeIndex.rust] ? idbCodes.rust : []),
		...(idbCodeWords[CodeIndex.swift] ? idbCodes.swift : []),
		...(idbCodeWords[CodeIndex.typescript] ? idbCodes.typescript : [])
	);
}
