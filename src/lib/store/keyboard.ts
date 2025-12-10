export class KeyboardSettings {
	keyCaps: string[];
	leftKeys: string[] = [];
	rightKeys: string[] = [];
	keyMaps: number[][] = [];
	justify = "justify-center";
	constructor(keyCaps: string[], leftKeys: string[], rightKeys: string[], keyMaps: number[][], justify: string) {
		this.keyCaps = keyCaps;
		this.leftKeys = leftKeys;
		this.rightKeys = rightKeys;
		this.keyMaps = keyMaps;
		this.justify = justify;
	}
}

export enum KeyboardIndex {
	matrix = 0,
	ansi,
	iso,
}
export const KeyboardNames = ["Matrix", "ANSI", "ISO"];

export enum LayoutIndex {
	colemakDH = 0,
	dvorak,
	qwerty,
	carpalx,
	halmak,
	norman,
	workman,
}
export const LayoutNames = ["Colemak-DH", "Dvorak", "Qwerty", "Carpalx", "Halmak", "Norman", "Workman"];

const keyAlt = `\u2387`;
const keyBackspace = `\u232B`;
const keyCapslock = `\u21ED`;
const keyCommand = `\u2318`;
const keyControl = `\u2388`;
const keyEnter = `\u23CE`;
const keyShift = `\u21E7`;
const keyTab = `\u21E5`;
// "          1         2         3         4           5         6",
// "0123456789012345678901234567890123456789012 3 45678901234567890123456789",
// "NTESIROALPUFYW;QHD,C.X/ZMGJBKV7483920165'`\\\"_:=-+[]{}()<>|?~&$*#@!^%",

export const keyboards: KeyboardSettings[] = [];
keyboards[KeyboardIndex.matrix] = new KeyboardSettings(
	["1234567890-=", "QWERTYUIOP[]", "ASDFGHJKL;'" + keyEnter, "ZXCVBNM,./"],
	["", "", "", ""],
	["", "", "", ""],
	[
		[41, 37, 35, 33, 31, 39, 38, 30, 32, 34, 36, 47],
		[108, 15, 13, 11, 9, 27, 26, 8, 10, 12, 14, 46],
		[103, 7, 5, 3, 1, 25, 24, 0, 2, 4, 6, 40],
		[107, 23, 21, 19, 17, 29, 28, 16, 18, 20, 22, 42],
	],
	"justify-left"
);
keyboards[KeyboardIndex.ansi] = new KeyboardSettings(
	["`1234567890-=", "QWERTYUIOP[]\\", "ASDFGHJKL;'", "ZXCVBNM,."],
	["", keyTab, keyCapslock, keyShift],
	[keyBackspace, "", keyEnter, keyShift],
	[
		[41, 37, 35, 33, 31, 39, 38, 30, 32, 34, 36, 47, 46],
		[15, 13, 11, 9, 27, 26, 8, 10, 12, 14, 49, 50, 42],
		[7, 5, 3, 1, 25, 24, 0, 2, 4, 6, 40],
		[23, 21, 19, 17, 29, 28, 16, 18, 20, 22],
	],
	"justify-center"
);
keyboards[KeyboardIndex.iso] = new KeyboardSettings(
	["`1234567890-=", "QWERTYUIOP[]\\", "ASDFGHJKL;'#", "\\ZXCVBNM,./"],
	["", keyTab, keyCapslock, keyShift],
	[keyBackspace, keyEnter, keyEnter, keyShift],
	[
		[41, 37, 35, 33, 31, 39, 38, 30, 32, 34, 36, 47, 46],
		[15, 13, 11, 9, 27, 26, 8, 10, 12, 14, 49, 50],
		[7, 5, 3, 1, 25, 24, 0, 2, 4, 6, 40, 63],
		[23, 21, 19, 17, 29, 42, 28, 16, 18, 20, 22],
	],
	"justify-center"
);

/**
 * Alternating right half then left half letters.
 * Home row index to pinky, then above that, then below.
 * Middle keys
 * Number keys
 * Punctuation
 * TODO up to 1 map per keyboard type, they vary that way
 * TODO make it mostly input and save based?
 */
export const layouts = [
	// "          1         2         3         4          5        6",
	// "0123456789012345678901234567890123456789012345678901234567890123456789",
	"NTESIROALPUFYW;QHD,C.X/ZMGJBKV7483920165'`\\\"_:=-+[]{}()<>|?~&$*#@!^%",
	"HUTENOSAGPC.R,L'MKWJVQZ;DIFYBX8594032176-`\\\"_:][+/={}()<>|?~&$*#@!^%",
	"JFKDLS;AURIEOWPQMV,C.X/ZHGYTNB7483920165'`\\\"_:=-+[]{}()<>|?~&$*#@!^%",
	"",
	"",
	"",
	"",
];

/**
 * Map from 'layouts' to 'keyCaps'
 * TODO avoid recalculations?
 * @param layoutIndex
 * @returns string[]
 */
export function getKeyCaps(keyboardIndex: KeyboardIndex, layoutIndex: LayoutIndex): string[] {
	if (keyboardIndex === undefined || layoutIndex === undefined) {
		return [];
	}
	const keyboardSettings = keyboards[keyboardIndex];
	const keyCaps = keyboardSettings.keyCaps;
	const layout = layouts[layoutIndex];
	// console.log("\ngetKeyCaps layout:"+layout);
	let i = 0;
	for (const row of keyboardSettings.keyMaps) {
		let s = "";
		for (const index of row) {
			if (index > 100) {
				switch (index - 100) {
					case 1:
						s += keyAlt;
						break;
					case 2:
						s += keyBackspace;
						break;
					case 3:
						s += keyCapslock;
						break;
					case 4:
						s += keyCommand;
						break;
					case 5:
						s += keyControl;
						break;
					case 6:
						s += keyEnter;
						break;
					case 7:
						s += keyShift;
						break;
					case 8:
						s += keyTab;
						break;
					default:
						console.error("unhandled case:" + (index - 100));
						break;
				}
				// console.log("getKeyCaps s:"+s);
			} else {
				s += layout[index];
			}
		}
		keyCaps[i] = s;
		// console.log("getKeyCaps s:"+s);
		i += 1;
	}
	// console.table(keyCaps);
	keyboardSettings.keyCaps = keyCaps;
	return keyboardSettings.keyCaps;
}
