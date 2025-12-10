import { CodeIndex } from "./code";
import { idbCodes } from "./SourceXG.svelte";

/**
 * Dynamically generated Programming Language words
 */
export const codeWords: string[] = $state([]);

export const OtherNames: string[] = ["Code", "CustomS"];
export enum OtherIndex {
	code = 0,
	custom,
}

export function updateCodeWords(idbCodeWords: typeof codeWords) {
	codeWords.length = 0;
	codeWords.push(
		...(idbCodeWords[CodeIndex.cpp] ? idbCodes.current.cpp : []),
		...(idbCodeWords[CodeIndex.cs] ? idbCodes.current.cs : []),
		...(idbCodeWords[CodeIndex.go] ? idbCodes.current.go : []),
		...(idbCodeWords[CodeIndex.java] ? idbCodes.current.java : []),
		...(idbCodeWords[CodeIndex.javascript] ? idbCodes.current.javascript : []),
		...(idbCodeWords[CodeIndex.python] ? idbCodes.current.python : []),
		...(idbCodeWords[CodeIndex.rust] ? idbCodes.current.rust : []),
		...(idbCodeWords[CodeIndex.swift] ? idbCodes.current.swift : []),
		...(idbCodeWords[CodeIndex.typescript] ? idbCodes.current.typescript : [])
	);
}
