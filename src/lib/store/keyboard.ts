export class KeyboardSettings {
	keyCaps: string[];
	leftKeys: string[] = [];
	rightKeys: string[] = [];
	keyMaps: number[][] = [];
	justify = "justify-center";
	thumbRow: boolean = false; // Whether this keyboard has a dedicated thumb row
	constructor(
		keyCaps: string[],
		leftKeys: string[],
		rightKeys: string[],
		keyMaps: number[][],
		justify: string,
		thumbRow: boolean = false
	) {
		this.keyCaps = keyCaps;
		this.leftKeys = leftKeys;
		this.rightKeys = rightKeys;
		this.keyMaps = keyMaps;
		this.justify = justify;
		this.thumbRow = thumbRow;
	}
}

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
		[0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9], // numbers
		[0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9], // top
		[0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9], // home
		[0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9], // bottom
		[4, 4, 4, 5, 5, 5], // thumb (left 4, right 5)
	],
	[KeyboardIndex.ansi]: [
		//1 2  3  4  5  6  7  8  9  10 11 12 13
		[0, 0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9], // numbers
		[0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9, 9], // top
		[0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9], // home
		[0, 1, 2, 3, 3, 6, 6, 7, 8, 9], // bottom
	],
	[KeyboardIndex.iso]: [
		//1 2  3  4  5  6  7  8  9  10 11 12 13
		[0, 0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9], // numbers
		[0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9], // top
		[0, 1, 2, 3, 3, 3, 6, 6, 6, 7, 8, 9], // home
		[0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9], // bottom
	],
};

// Layout sources:
// https://github.com/empressabyss/nordrassil
// https://github.com/sunaku/enthium
// https://github.com/rdavison/graphite-layout
// https://sites.google.com/alanreiser.com/handsdown/home/hands-down-neu (Vibranium)
export enum LayoutIndex {
	colemakDH = 0,
	dvorak,
	qwerty,
	carpalx,
	halmak,
	norman,
	workman,
	nordrassil,
	enthium,
	graphite,
	vibraniumV,
	vibraniumP,
	vibraniumF,
	vibraniumB,
}
export const LayoutNames = [
	"Colemak-DH",
	"Dvorak",
	"Qwerty",
	"Carpalx",
	"Halmak",
	"Norman",
	"Workman",
	"Nordrassil",
	"Enthium",
	"Graphite",
	"Vibranium-V",
	"Vibranium-P",
	"Vibranium-F",
	"Vibranium-B",
];

const keyAlt = `\u2387`;
const keyBackspace = `\u232B`;
const keyCapslock = `\u21ED`;
const keyCommand = `\u2318`;
const keyControl = `\u2388`;
const keyEnter = `\u23CE`;
const keyShift = `\u21E7`;
const keyTab = `\u21E5`;
const keySpace = `\u2423`; // ␣
const keyMagic = `\u29C9`; // ⧉ (arcane/magic key symbol)

// \"          1         2         3         4           5         6\",
// \"0123456789012345678901234567890123456789012 3 45678901234567890123456789\",
// Layout string format: characters map to positions based on keyMaps indices

export const keyboards: KeyboardSettings[] = [];
keyboards[KeyboardIndex.matrix] = new KeyboardSettings(
	// 5 rows: numbers, top, home, bottom, thumbs
	["1234567890-=", "QWERTYUIOP[]", "ASDFGHJKL;'", "ZXCVBNM,./", keySpace + keyMagic + "  " + keyMagic + "T"],
	["", "", "", "", ""],
	["", "", "", "", ""],
	[
		[41, 37, 35, 33, 31, 39, 38, 30, 32, 34, 36, 47],
		[15, 13, 11, 9, 27, 26, 8, 10, 12, 14, 49, 50],
		[7, 5, 3, 1, 25, 24, 0, 2, 4, 6, 40, 46],
		[23, 21, 19, 17, 29, 28, 16, 18, 20, 22, 42, 48],
		[109, 110, 110, 110, 110, 27], // thumb row: space, magic, magic, magic, magic, T (special indices)
	],
	"justify-center",
	true // has thumb row
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
	"justify-center",
	false
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
	"justify-center",
	false
);

/**
 * Layout strings: map positions to characters.
 * Indices 0-47: letters and basic punctuation
 * Indices 48+: extended punctuation and special chars
 * Index 109: space, 110: magic/arcane, 111: T (thumb-alpha)
 *
 * Format: positions 0-7 = home row (NTES IROA), 8-15 = top row, etc.
 */
export const layouts = [
	// Colemak-DH
	"NTESIROALPUFYW;QHD,C.X/ZMGJBKV7483920165'`\\\"_:=-+[]{}()<>|?~&$*#@!^%",
	// Dvorak
	"HUTENOSAGPC.R,L'MKWJVQZ;DIFYBX8594032176-`\\\"_:][+/={}()<>|?~&$*#@!^%",
	// Qwerty
	"JFKDLS;AURIEOWPQMV,C.X/ZHGYTNB7483920165'`\\\"_:=-+[]{}()<>|?~&$*#@!^%",
	// TODO fix these fake ones:
	// Carpalx (placeholder - same as Colemak-DH for now)
	"NTESIROALPUFYW;QHD,C.X/ZMGJBKV7483920165'`\\\"_:=-+[]{}()<>|?~&$*#@!^%",
	// Halmak (placeholder)
	"NTESIROALPUFYW;QHD,C.X/ZMGJBKV7483920165'`\\\"_:=-+[]{}()<>|?~&$*#@!^%",
	// Norman (placeholder)
	"NTESIROALPUFYW;QHD,C.X/ZMGJBKV7483920165'`\\\"_:=-+[]{}()<>|?~&$*#@!^%",
	// Workman (placeholder)
	"NTESIROALPUFYW;QHD,C.X/ZMGJBKV7483920165'`\\\"_:=-+[]{}()<>|?~&$*#@!^%",
	// Nordrassil: j y o u - / q g n w k / h i e a . / m d r s p / v x / ' , ; z c l f b / ␣ ⟐ ⟐ t
	"HIEA.MDRSPHGQWKNTYOUJVX/',;ZCLFB7483920165'`\\\"_:=-+[]{}()<>|?~&$*#@!^%",
	// Enthium: q y o u = / x l d w z / b c i a e / - k h t n s / f ' , . ; / j m g p v
	"BCIA-EKHTNSXQZWLDYOU=F',.;JMGPV7483920165'`\\\"_:=-+[]{}()<>|?~&$*#@!^%",
	// Graphite: b l d w z / n r t s g / q x m c v / k p . - /
	"NRTSGYHAEIBQZWLDFOUJ;KXMCVP.-/7483920165'`\\\"_:=-+[]{}()<>|?~&$*#@!^%",
	// Vibranium-V: s c n t k / a e i h / f l d v / u o y b
	"AEIHTSCNKFLDVUOYB7483920165'`\\\"_:=-+[]{}()<>|?~&$*#@!^%',.;XZWQMGJ-+",
	// Vibranium-P: c s n t k / a e i h / f l d p / u o y b
	"AEIHTCSNKFLDPUOYB7483920165'`\\\"_:=-+[]{}()<>|?~&$*#@!^%',.;XZWQMGJ-+",
	// Vibranium-F: s c n t k / a e i h / p l d f / u o y b
	"AEIHTSCNKPLDVUOYB7483920165'`\\\"_:=-+[]{}()<>|?~&$*#@!^%',.;XZWQMGJ-+",
	// Vibranium-B: s c n t k / a e i h / p l d b / u o y f
	"AEIHTSCNKPLDBUOYF7483920165'`\\\"_:=-+[]{}()<>|?~&$*#@!^%',.;XZWQMGJ-+",
];

/**
 * Map from 'layouts' to 'keyCaps'
 * TODO avoid recalculations?
 * @param layoutIndex
 * @returns string[]
 */
export function getKeyCaps(keyboardIndex: KeyboardIndex, layoutIndex: LayoutIndex): string[] {
	console.log("getKeyCaps keyboardIndex:", keyboardIndex, "layoutIndex:", layoutIndex);
	if (keyboardIndex === undefined || layoutIndex === undefined) {
		return [];
	}
	const keyboardSettings = keyboards[keyboardIndex];
	const keyCaps = keyboardSettings.keyCaps;
	const layout = layouts[layoutIndex];
	// console.log("\ngetKeyCaps keyboardIndex:", keyboardIndex, "layoutIndex:", layoutIndex, "layout:", layout);
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
					case 9:
						s += keySpace;
						break;
					case 10:
						s += keyMagic;
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
