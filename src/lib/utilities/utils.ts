export const arrayEqualBoolean = (a1: boolean[], a2: boolean[]) => {
	// Check if lengths are the same
	if (a1.length !== a2.length) {
		return false;
	}
	// Check if every element in a1 strictly equals the corresponding element in a2
	return a1.every((element, index) => {
		return element === a2[index];
	});
};

export const arrayCopyBoolean = (a1: boolean[], a2: boolean[]) => {
	if (a1.length !== a2.length) {
		a2.length = a1.length;
	}
	for (let i = 0; i < a1.length; i++) {
		a2[i] = a1[i];
	}
};

export const arrayEqualString = (a1: string[], a2: string[]) => {
	// Check if lengths are the same
	if (a1.length !== a2.length) {
		return false;
	}
	// Check if every element in a1 strictly equals the corresponding element in a2
	return a1.every((element, index) => {
		return element === a2[index];
	});
};

export const arrayCopyString = (a1: string[], a2: string[]) => {
	if (a1.length !== a2.length) {
		a2.length = a1.length;
	}
	for (let i = 0; i < a1.length; i++) {
		a2[i] = a1[i];
	}
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
 * Creates a deep clone of an object.
 * @param original
 * @returns the deep clone
 */
// eslint-disable-next-line
export function deepClone(original: any): any {
	return structuredClone(original);
}
