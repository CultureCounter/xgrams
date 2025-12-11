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
