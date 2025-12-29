// The main structure is a keymap, which is an array of rows, each of which is an array of columns of single characters.
// Each <row,column> provides a character for each KeyCap of the Keyboard.
// Keyboards come in matrix, ansi, and iso types. Not all keys need to be present.
// Each key layout like Colemak-DH or Nordrassil has keymap(s) for one or more keyboard types.
// There are finger assignments for each keyboard type.
// Had to migrate from array of strings to array of array of character strings to get reactivity.
// Settings will have to coalesce the keyboard types for each layout.

// TODO: assignments for angle mod? Or is that another keyboard type with variant finger assignments?
// NOT DOING: Maybe add variant layouts in the same manner as keyboard types?
// Oh wow no. Saw the list on MonkeyType. Zero appetite for that in noncommercial software.

// TODO: direct pasting of custom keymaps from other sources

export class KeyMap {
	layout: LayoutIndex;
	keyboard: KeyboardIndex;
	keyCaps: string[][];
	leftKeys: string[] = [];
	rightKeys: string[] = [];
	justify = "justify-center";
	thumbRow: boolean = false; // Whether this layout has a dedicated thumb row
	constructor(
		layout: LayoutIndex,
		keyboard: KeyboardIndex,
		keyCaps: string[][],
		leftKeys: string[],
		rightKeys: string[],
		justify: string,
		thumbRow: boolean = false
	) {
		this.layout = layout;
		this.keyboard = keyboard;
		this.keyCaps = keyCaps;
		this.leftKeys = leftKeys;
		this.rightKeys = rightKeys;
		this.justify = justify;
		this.thumbRow = thumbRow;
		if (this.keyboard === KeyboardIndex.ansi) {
			console.assert(keyCaps.length === 4, LayoutNames[this.layout], "KeyCaps rows must be 4 for ANSI keyboard");
			console.assert(
				keyCaps[0]!.length === 13,
				LayoutNames[this.layout],
				"KeyCaps[0] needs 13 keys for ANSI keyboard"
			);
			console.assert(
				keyCaps[1]!.length === 13,
				LayoutNames[this.layout],
				"KeyCaps[1] needs 13 keys for ANSI keyboard"
			);
			console.assert(
				keyCaps[2]!.length === 11,
				LayoutNames[this.layout],
				"KeyCaps[2] needs 11 keys for ANSI keyboard"
			);
			console.assert(
				keyCaps[3]!.length === 10,
				LayoutNames[this.layout],
				"KeyCaps[3] needs 10 keys for ANSI keyboard"
			);
		}
		if (this.keyboard === KeyboardIndex.iso) {
			console.assert(keyCaps.length === 4, LayoutNames[this.layout], "KeyCaps rows must be 4 for ISO keyboard");
			console.assert(
				keyCaps[0]!.length === 13,
				LayoutNames[this.layout],
				"KeyCaps[0] needs 13 keys for ISO keyboard"
			);
			console.assert(
				keyCaps[1]!.length === 12,
				LayoutNames[this.layout],
				"KeyCaps[1] needs 12 keys for ISO keyboard"
			);
			console.assert(
				keyCaps[2]!.length === 12,
				LayoutNames[this.layout],
				"KeyCaps[2] needs 12 keys for ISO keyboard"
			);
			console.assert(
				keyCaps[3]!.length === 11,
				LayoutNames[this.layout],
				"KeyCaps[3] needs 11 keys for ISO keyboard"
			);
		}
		if (this.keyboard === KeyboardIndex.matrix) {
			console.assert(
				keyCaps.length === 5,
				LayoutNames[this.layout],
				"KeyCaps rows must be 5 for Matrix keyboard"
			);
			console.assert(
				keyCaps[0]!.length === 12,
				LayoutNames[this.layout],
				"KeyCaps[0] needs 12 keys for Matrix keyboard"
			);
			console.assert(
				keyCaps[1]!.length === 12,
				LayoutNames[this.layout],
				"KeyCaps[1] needs 12 keys for Matrix keyboard"
			);
			console.assert(
				keyCaps[2]!.length === 12,
				LayoutNames[this.layout],
				"KeyCaps[2] needs 12 keys for Matrix keyboard"
			);
			console.assert(
				keyCaps[3]!.length === 12,
				LayoutNames[this.layout],
				"KeyCaps[3] needs 12 keys for Matrix keyboard"
			);
			console.assert(
				keyCaps[4]!.length === 6,
				LayoutNames[this.layout],
				"KeyCaps[4] needs 6 keys for Matrix keyboard"
			);
		}
	}
}

// Layout sources:
// https://github.com/empressabyss/nordrassil
// https://github.com/sunaku/enthium
// https://github.com/rdavison/graphite-layout
// https://sites.google.com/alanreiser.com/handsdown/home/hands-down-neu (Vibranium)
// https://cyanophage.github.io/
export enum LayoutIndex {
	colemakDH = 0,
	dvorak,
	enthium,
	gallium,
	graphite,
	halmak,
	nordrassil,
	prometheum,
	qwerty,
	sturdy,
	vibranium,
}
export const LayoutNames = [
	"Colemak-DH",
	"Dvorak",
	"Enthium",
	"Gallium",
	"Graphite",
	"Halmak",
	"Nordrassil",
	"Prometheum",
	"Qwerty",
	"Sturdy",
	"Vibranium",
];

export enum KeyboardIndex {
	matrix = 0,
	ansi,
	iso,
}
export const KeyboardNames = ["Matrix", "ANSI", "ISO"];

// Finger assignments for touch typing
export enum FingerIndex {
	leftPinky = 0,
	leftRing,
	leftMiddle,
	leftIndex,
	leftThumb,
	rightThumb,
	rightIndex,
	rightMiddle,
	rightRing,
	rightPinky,
}

/** Standard 10-finger assignments for each keyboard type
 * Each row maps column index to FingerIndex
 * TODO: Angle mod and stuff and such
 * TODO: Double thumb row?
 * TODO: Make this configurable
 * TODO: Handle home row mods, magic key, etc.
 */
export const fingerAssignments: Record<KeyboardIndex, FingerIndex[][]> = {
	[KeyboardIndex.matrix]: [
		// Row 0-3: 12 keys split 6+6, Row 4: thumb keys
		//1 2  3  4  5  6  7  8  9  10 11 12
		[0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9], // numbers
		[0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9], // top
		[0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9], // home
		[0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9], // bottom
		[4, 4, 4, 5, 5, 5], // thumb (left 4, right 5)
	],
	[KeyboardIndex.ansi]: [
		//1 2  3  4  5  6  7  8  9  10 11 12 13
		[0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9, 9], // numbers
		[0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9, 9, 9], // top
		[0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9], // home
		[0, 1, 2, 3, 3, 6, 6, 7, 8, 9], // bottom
	],
	[KeyboardIndex.iso]: [
		//1 2  3  4  5  6  7  8  9  10 11 12 13
		[0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9, 9], // numbers
		[0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9, 9], // top
		[0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9, 9], // home
		[0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9], // bottom
	],
};

const keyAltLeft = `\u2387`;
const keyAltRight = `\u2387`;
const keyArcane = `\u27D0`;
const keyBackspace = `\u232B`;
const keyCapslock = `\u21ED`;
const keyCommand = `\u2318`;
const keyControl = `\u2388`;
const keyDelete = `\u2326`;
const keyEscape = `\u238B`;
const keyEnter = `\u23CE`;
const keyMagic = `\u29C9`; // ⧉ (arcane/magic key symbol)
const keyReturn = `\u238C`;
const keyShift = `\u21E7`;
const keySpace = `\u2423`; // ␣
const keyTab = `\u21E5`;

// \"          1         2         3         4           5         6\",
// \"0123456789012345678901234567890123456789012 3 45678901234567890123456789\",
// Layout string format: characters map to positions based on keyMaps indices

const hasThumbRow = true;

// https://colemakmods.github.io/mod-dh/
const colemakDHMap = new Map<KeyboardIndex, KeyMap>();
export const keyboards: Map<LayoutIndex, Map<KeyboardIndex, KeyMap>> = new Map();
keyboards.set(LayoutIndex.colemakDH, colemakDHMap);
const defaultColemakDHKeyMap = new KeyMap(
	LayoutIndex.colemakDH,
	KeyboardIndex.matrix,
	[
		["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ";"],
		["=", "Q", "W", "F", "P", "B", "J", "L", "U", "Y", ";", "-"],
		[keyTab, "A", "R", "S", "T", "G", "M", "N", "E", "I", "O", "'"],
		["[", "Z", "X", "C", "D", "V", "K", "H", ",", ".", "/", "\\"],
		[keyBackspace, keyDelete, keyEscape, keyMagic, keyReturn, keySpace],
	],
	["", "", "", "", ""],
	["", "", "", "", ""],
	"justify-center",
	hasThumbRow
);
colemakDHMap.set(KeyboardIndex.matrix, defaultColemakDHKeyMap);

const dvorakMap = new Map<KeyboardIndex, KeyMap>();
keyboards.set(LayoutIndex.dvorak, dvorakMap);
dvorakMap.set(
	KeyboardIndex.matrix,
	new KeyMap(
		LayoutIndex.dvorak,
		KeyboardIndex.matrix,
		[
			["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-"],
			["=", "'", ",", ".", "p", "y", "f", "g", "c", "r", "l", "/"],
			[keyTab, "a", "o", "e", "u", "i", "d", "h", "t", "n", "s", "-"],
			["\\", ";", "q", "j", "k", "x", "b", "m", "w", "v", "z", "]"],
			[keyBackspace, keyDelete, keyEscape, keyMagic, keyReturn, keySpace],
		],
		["", "", "", "", ""],
		["", "", "", "", ""],
		"justify-center",
		hasThumbRow
	)
);

// https://github.com/sunaku/enthium
const enthiumMap = new Map<KeyboardIndex, KeyMap>();
keyboards.set(LayoutIndex.enthium, enthiumMap);
enthiumMap.set(
	KeyboardIndex.matrix,
	new KeyMap(
		LayoutIndex.enthium,
		KeyboardIndex.matrix,
		[
			["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-"],
			["=", "q", "y", "o", "u", "=", "x", "l", "d", "w", "z", "/"],
			["b", "c", "i", "a", "e", "-", "k", "h", "t", "n", "s", "f"],
			["\\", "'", ",", ".", ";", "/", "j", "m", "g", "p", "v", "]"],
			[keyBackspace, keyDelete, keyEscape, keyMagic, keyReturn, "r"],
		],
		["", "", "", "", ""],
		["", "", "", "", ""],
		"justify-center",
		hasThumbRow
	)
);
enthiumMap.set(
	KeyboardIndex.ansi,
	new KeyMap(
		LayoutIndex.enthium,
		KeyboardIndex.ansi,
		[
			["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", keyCapslock, keyAltRight],
			["q", "y", "o", "u", "=", "x", "l", "d", "w", "z", "[", "]", "\\"],
			["c", "i", "a", "e", "-", "k", "h", "t", "n", "s", "f"],
			["'", ",", ".", ";", "/", "j", "m", "g", "p", "v"],
		],
		["", keyTab, "b", keyShift],
		[keyBackspace, "", keyEnter, keyShift],
		"justify-center"
	)
);
// TODO: Right Alt key is an R.

//github.com/GalileoBlues/Gallium
const galliumMap = new Map<KeyboardIndex, KeyMap>();
keyboards.set(LayoutIndex.gallium, galliumMap);
galliumMap.set(
	KeyboardIndex.matrix,
	new KeyMap(
		LayoutIndex.gallium,
		KeyboardIndex.matrix,
		[
			["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "["],
			["=", "b", "l", "d", "c", "v", "z", "y", "o", "u", ",", "-"],
			[keyTab, "n", "r", "t", "s", "g", "p", "h", "a", "e", "i", "/"],
			["\\", "q", "x", "m", "w", "j", "k", "f", "'", ";", ".", "]"],
			[keyBackspace, keyDelete, keyEscape, keyMagic, keyReturn, keySpace],
		],
		["", "", "", "", ""],
		["", "", "", "", ""],
		"justify-center",
		hasThumbRow
	)
);
galliumMap.set(
	KeyboardIndex.ansi,
	new KeyMap(
		LayoutIndex.gallium,
		KeyboardIndex.ansi,
		[
			["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
			["b", "l", "d", "c", "v", "j", "f", "o", "u", ",", "[", "]", "\\"],
			["n", "r", "t", "s", "g", "y", "h", "a", "e", "i", "/"],
			["x", "q", "m", "w", "z", "k", "p", "'", ";", "."],
		],
		["", keyTab, keyCapslock, keyShift],
		[keyBackspace, "", keyEnter, keyShift],
		"justify-center"
	)
);

// https://github.com/rdavison/graphite-layout/blob/main/README.md
const graphiteMap = new Map<KeyboardIndex, KeyMap>();
keyboards.set(LayoutIndex.graphite, graphiteMap);
graphiteMap.set(
	KeyboardIndex.ansi,
	new KeyMap(
		LayoutIndex.graphite,
		KeyboardIndex.ansi,
		[
			["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "[", "]"],
			["b", "l", "d", "w", "z", "'", "f", "o", "u", "j", ";", "=", "\\"],
			["n", "r", "t", "s", "g", "y", "h", "a", "e", "i", ","],
			["q", "x", "m", "c", "v", "k", "p", ".", "-", "/"],
		],
		["", keyTab, keyCapslock, keyShift],
		[keyBackspace, "", keyEnter, keyShift],
		"justify-center"
	)
);

// https://github.com/kaievns/halmak
const halmakMap = new Map<KeyboardIndex, KeyMap>();
keyboards.set(LayoutIndex.halmak, halmakMap);
halmakMap.set(
	KeyboardIndex.matrix,
	new KeyMap(
		LayoutIndex.halmak,
		KeyboardIndex.matrix,
		[
			["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "["],
			["=", "w", "l", "r", "b", "z", "q", "g", "u", "d", "j", "-"],
			[keyTab, "s", "h", "n", "t", ",", ".", "a", "e", "o", "i", "/"],
			["\\", "f", "m", "v", "c", "/", ";", "p", "x", "k", "y", "]"],
			[keyBackspace, keyDelete, keyEscape, keyMagic, keyReturn, keySpace],
		],
		["", "", "", "", ""],
		["", "", "", "", ""],
		"justify-center",
		hasThumbRow
	)
);
halmakMap.set(
	KeyboardIndex.ansi,
	new KeyMap(
		LayoutIndex.halmak,
		KeyboardIndex.ansi,
		[
			["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
			["w", "l", "r", "b", "z", "q", "g", "u", "d", "j", "[", "]", "\\"],
			["s", "h", "n", "t", ",", ".", "a", "e", "o", "i", "/"],
			["f", "m", "v", "c", "/", ";", "p", "x", "k", "y"],
		],
		["", keyTab, keyCapslock, keyShift],
		[keyBackspace, "", keyEnter, keyShift],
		"justify-center"
	)
);
halmakMap.set(
	KeyboardIndex.iso,
	new KeyMap(
		LayoutIndex.halmak,
		KeyboardIndex.iso,
		[
			["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
			["w", "l", "r", "b", "z", "q", "g", "u", "d", "j", "[", "]"],
			["s", "h", "n", "t", ",", ".", "a", "e", "o", "i", "'", "#"],
			["f", "m", "v", "c", "/", ";", "p", "x", "k", "y", "/"],
		],
		["", keyTab, keyCapslock, keyShift],
		[keyBackspace, keyEnter, keyEnter, keyShift],
		"justify-center"
	)
);

// https://github.com/empressabyss/nordrassil/blob/main/README.md
// www.reddit.com/r/KeyboardLayouts/comments/1oqqfql/%F0%96%A3%82nordrassils_rejuvenation%EF%BE%9F_a_refinement_of_the/
const nordrassilMap = new Map<KeyboardIndex, KeyMap>();
keyboards.set(LayoutIndex.nordrassil, nordrassilMap);
nordrassilMap.set(
	KeyboardIndex.matrix,
	new KeyMap(
		LayoutIndex.nordrassil,
		KeyboardIndex.matrix,
		[
			["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-"],
			["=", "j", "y", "o", "u", "-", "q", "g", "n", "w", "k", "["],
			[keyTab, "h", "i", "e", "a", ".", "m", "d", "r", "s", "p", "v"],
			["\\", "x", "/", "'", ",", ";", "z", "c", "l", "f", "b", "]"],
			[keySpace, keyArcane, keyBackspace, keyCommand, keyArcane, "t"],
		],
		["", "", "", "", ""],
		["", "", "", "", ""],
		"justify-center",
		hasThumbRow
	)
);

// https://www.reddit.com/r/KeyboardLayouts/comments/1g66ivi/hands_down_promethium_snth_meets_hd_silverengram/
// https://cyanophage.github.io/index.html#hd-promethium
const prometheumMap = new Map<KeyboardIndex, KeyMap>();
keyboards.set(LayoutIndex.prometheum, prometheumMap);
prometheumMap.set(
	KeyboardIndex.matrix,
	new KeyMap(
		LayoutIndex.prometheum,
		KeyboardIndex.matrix,
		[
			["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-"],
			["[", "f", "p", "d", "l", "x", ";", "u", "o", "y", "b", "z"],
			[keyTab, "s", "n", "t", "h", "k", ",", "a", "e", "i", "c", "q"],
			["\\", "v", "w", "g", "m", "j", "-", ".", "'", "=", "/", "]"],
			[keyBackspace, keyAltLeft, keyControl, keyCommand, keyReturn, keySpace],
		],
		["", "", "", "", ""],
		["", "", "", "", ""],
		"justify-center",
		hasThumbRow
	)
);

const qwertyMap = new Map<KeyboardIndex, KeyMap>();
keyboards.set(LayoutIndex.qwerty, qwertyMap);
qwertyMap.set(
	KeyboardIndex.matrix,
	new KeyMap(
		LayoutIndex.qwerty,
		KeyboardIndex.matrix,
		[
			["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-"],
			["=", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "["],
			[keyTab, "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
			["\\", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "]"],
			[keyBackspace, keyAltLeft, keyControl, keyCommand, keyReturn, keySpace],
		],
		["", "", "", "", ""],
		["", "", "", "", ""],
		"justify-center",
		hasThumbRow
	)
);
qwertyMap.set(
	KeyboardIndex.ansi,
	new KeyMap(
		LayoutIndex.qwerty,
		KeyboardIndex.ansi,
		[
			["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
			["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
			["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
			["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
		],
		["", keyTab, keyCapslock, keyShift],
		[keyBackspace, "", keyEnter, keyShift],
		"justify-center"
	)
);
qwertyMap.set(
	KeyboardIndex.iso,
	new KeyMap(
		LayoutIndex.qwerty,
		KeyboardIndex.iso,
		[
			["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
			["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]"],
			["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "#"],
			["\\", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
		],
		["", keyTab, keyCapslock, keyShift],
		[keyBackspace, keyEnter, keyEnter, keyShift],
		"justify-center"
	)
);

// https://oxey.dev/sturdy/index.html
const sturdyMap = new Map<KeyboardIndex, KeyMap>();
keyboards.set(LayoutIndex.sturdy, sturdyMap);
sturdyMap.set(
	KeyboardIndex.matrix,
	new KeyMap(
		LayoutIndex.sturdy,
		KeyboardIndex.matrix,
		[
			["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-"],
			["=", "v", "m", "l", "c", "p", "x", "f", "o", "u", "j", "["],
			[keyTab, "s", "t", "r", "d", "y", ".", "n", "a", "e", "i", "-"],
			["\\", "z", "k", "q", "g", "w", "b", "h", "'", ";", ",", "/"],
			[keyShift, keyCommand, keyArcane, keyArcane, keyBackspace, keySpace],
		],
		["", "", "", "", ""],
		["", "", "", "", ""],
		"justify-center",
		hasThumbRow
	)
);
sturdyMap.set(
	KeyboardIndex.ansi,
	new KeyMap(
		LayoutIndex.sturdy,
		KeyboardIndex.ansi,
		[
			["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
			["v", "m", "l", "c", "p", "x", "f", "o", "u", "j", "[", "]", "\\"],
			["s", "t", "r", "d", "y", ".", "n", "a", "e", "i", "'"],
			["z", "k", "q", "g", "w", "b", "h", "'", ";", ","],
		],
		["", keyTab, keyCapslock, keyShift],
		[keyBackspace, "", keyEnter, keyShift],
		"justify-center"
	)
);
sturdyMap.set(
	KeyboardIndex.iso,
	new KeyMap(
		LayoutIndex.sturdy,
		KeyboardIndex.iso,
		[
			["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
			["v", "m", "l", "c", "p", "x", "f", "o", "u", "j", "[", "]"],
			["s", "t", "r", "d", "y", ".", "n", "a", "e", "i", "'", "#"],
			["\\", "z", "k", "q", "g", "w", "b", "h", "'", ";", ","],
		],
		["", keyTab, keyCapslock, keyShift],
		[keyBackspace, keyEnter, keyEnter, keyShift],
		"justify-center"
	)
);

// https://cyanophage.github.io/index.html#hd-vibranium
// What a mess, is there even an actual layout or just a bunch of vaguely similar layouts?
// Picking the cyanophage layout as it has real testing.
const vibraniumMap = new Map<KeyboardIndex, KeyMap>();
keyboards.set(LayoutIndex.vibranium, vibraniumMap);
vibraniumMap.set(
	KeyboardIndex.matrix,
	new KeyMap(
		LayoutIndex.vibranium,
		KeyboardIndex.matrix,
		[
			["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-"],
			["=", "x", "w", "m", "g", "q", "z", ".", "'", "j", "b", "["],
			[keyTab, "s", "c", "n", "t", "k", ",", "a", "e", "i", "h", "-"],
			["\\", "v", "p", "l", "d", "/", "-", "u", "o", "y", "f", "]"],
			["r", keyCommand, keyArcane, keyArcane, keyBackspace, keySpace],
		],
		["", "", "", "", ""],
		["", "", "", "", ""],
		"justify-center",
		hasThumbRow
	)
);

/**
 * Map from 'layouts' to 'keyCaps'
 * TODO avoid recalculations?
 * @param layoutIndex
 * @returns string[]
 */
export function getKeyCaps(keyboardIndex: KeyboardIndex, layoutIndex: LayoutIndex): string[][] {
	// console.log("getKeyCaps keyboardIndex:", keyboardIndex, "layoutIndex:", layoutIndex);
	if (keyboardIndex === undefined || layoutIndex === undefined) {
		return [];
	}
	const keyboardSettings = keyboards.get(layoutIndex)?.get(keyboardIndex);
	if (!keyboardSettings) {
		return [];
	}

	// console.table(keyboardSettings.keyCaps);

	return keyboardSettings.keyCaps;
}

export function getKeyboard(keyboardIndex: KeyboardIndex, layoutIndex: LayoutIndex): KeyMap {
	if (keyboardIndex === undefined || layoutIndex === undefined) {
		console.error("getKeyboard: keyboardIndex or layoutIndex is undefined");
		return defaultColemakDHKeyMap;
	}
	const keyMap = keyboards.get(layoutIndex)?.get(keyboardIndex);
	if (!keyMap) {
		console.error("getKeyboard: keyMap not found for keyboardIndex:", keyboardIndex, "layoutIndex:", layoutIndex);
		return defaultColemakDHKeyMap;
	}
	return keyMap;
}
