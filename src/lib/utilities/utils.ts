/**
 * Copy `src` to `dest` if different
 * Assuming primitive types
 * @param src
 * @param dest
 * @returns true if `dest` was changed
 */
export function arrayCopy<T>(src: T[], dest: T[]): boolean {
	let didChange = false;
	if (src.length !== dest.length) {
		dest.length = src.length;
		didChange = true;
	}
	for (let i = 0; i < src.length; i++) {
		if (dest[i] !== src[i]) {
			dest[i] = src[i]!;
			didChange = true;
		}
	}
	return didChange;
}

/**
 * Copy a plain object
 * Assumes same object type with identical and shallow properties
 * @param src
 * @param dest
 * @returns true if any changes were made
 */
export const copyObject = (src: object, dest: object): boolean => {
	let didChange = false;
	for (const [key, value] of Object.entries(src)) {
		const destKey = key as keyof typeof dest;
		if (dest[destKey] != value) {
			dest[destKey] = value as (typeof dest)[typeof destKey];
			didChange = true;
		}
	}
	return didChange;
};

/**
 * Copy a Map of objects
 * Assumes same object types with identical and shallow properties
 * TODO: implement generic version
 * @param srcMap
 * @param destMap
 * @returns true if any changes were made
 */
export const copyStringMap = (srcMap: Map<string, object>, destMap: Map<string, object>): boolean => {
	let didChange = false;

	for (const [key, value] of srcMap) {
		const destValue = destMap.get(key);
		if (destValue !== undefined) {
			const changed = copyObject(value, destValue);
			if (changed) {
				didChange = true;
			}
		}
	}
	return didChange;
};

/**
 * Find in space delimited `target` one of `candidates`
 * @param target
 * @param removals
 * @param add
 * @returns string `candidate` or ''
 */
export const findStrings = (target: string, candidates: string[]): string => {
	for (const candidate of candidates) {
		if (target.includes(candidate)) {
			return candidate;
		}
	}
	return "";
};

/**
 * Remove from space delimited `target` all `removals` and leave one `add`
 * @param target
 * @param removals
 * @param add
 * @returns string
 */
export const replaceStrings = (target: string, removals: string[], add: string): string => {
	for (const candidate of removals) {
		// console.log('removing:`' + candidate + '`');
		target = target.replace(candidate, "");
	}
	target += add;
	return target;
};

/**
 * Get all combinations of `base` <= `maxLength`
 * @param base
 * @param maxLength
 * @returns string[]
 */
export const getCombinations = (base: string[], maxLength: number): string[] => {
	const result: string[] = [];

	function searchCombination(start: number, current: string[], length: number) {
		if (current.length > 0) {
			result.push(current.join(""));
		}
		if (length === 0) return;

		for (let i = start; i < base.length; i++) {
			searchCombination(i + 1, [...current, base[i]!], length - 1);
		}
	}

	searchCombination(0, [], maxLength);
	return result;
};

/**
 * Creates a deep clone of an object.
 * @param original
 * @returns the deep clone
 */
// eslint-disable-next-line
export function deepClone(original: any): any {
	return structuredClone(original);
}

/**
 * Range in src array to select from.
 * Starts with the smallest scope of 50 from ScopeValues[ScopeIndex.top50]
 */
const currentRange: number = 50;
/**
 * Shuffle indices to get random selection.
 * Max is the smallest scope of 50 from ScopeValues[ScopeIndex.top50]
 */
const shuffleIndices: number[] = Array.from({ length: currentRange }, (_, index) => index);
/**
 * Randomly select n elements from src array into dest array.
 * Adjust dest length to fit
 * @param src source array
 * @param dest destination array
 * @param n number of elements to select
 */
export function selectRandomInto<T>(src: T[], dest: T[], n: number, range: number) {
	if (src.length <= n) {
		dest.length = src.length;
		arrayCopy(src, dest);
		return;
	}

	// Adjust range to match src
	let newRange = range;
	if (newRange > src.length) newRange = src.length;

	// Adjust shuffleIndices to match range
	if (newRange > shuffleIndices.length) {
		const padArray = Array.from(
			{ length: newRange - shuffleIndices.length },
			(_, index) => index + shuffleIndices.length
		);
		shuffleIndices.push(...padArray);
	} else if (newRange < shuffleIndices.length) {
		shuffleIndices.length = newRange;
		shuffleIndices.forEach((_, index) => {
			shuffleIndices[index] = index;
		});
	}

	// Shuffle and select
	shuffle(shuffleIndices, n);
	dest.length = n;
	for (let i = 0; i < n; i++) {
		dest[i] = src[shuffleIndices[i]!]!;
	}
}

/**
 * Shuffle array in place
 * @param  array
 * @param n shuffle elements 0 to n-1, coerce n to array.length-1 if nonsense
 */
export function shuffle<T>(array: T[], n?: number): void {
	if (n === undefined || n >= array.length || n < 1) {
		n = array.length - 1;
	}
	let range = array.length - 1;
	for (let i = 0; i < n; i++) {
		const j = Math.floor(Math.random() * range + i + 1);
		[array[i]!, array[j]!] = [array[j]!, array[i]!];
		range--;
	}
}

/**
 * Pad `array` to a multiple of `multiple` by random duplication
 * @param array
 * @param multiple
 */
export function padToMultiple(array: string[], multiple: number) {
	while (array.length % multiple > 0) {
		const j = Math.floor(Math.random() * (array.length - 1));
		array.push(array[j]!);
	}
}
