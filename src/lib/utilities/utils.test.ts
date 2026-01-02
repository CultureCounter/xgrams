import { describe, it, expect } from "vitest";
import {
	arrayCopy,
	copyObject,
	copyStringMap,
	replaceStrings,
	findStrings,
	getCombinations,
	deepClone,
	selectRandomInto,
	shuffle,
	padToMultiple,
} from "./utils";

describe("utils", () => {
	describe("arrayCopy", () => {
		it("should copy elements from src to dest", () => {
			const src = [1, 2, 3];
			const dest: number[] = [];
			const changed = arrayCopy(src, dest);
			expect(dest).toEqual(src);
			expect(changed).toBe(true);
		});

		it("should return true if dest was changed (length diff)", () => {
			const src = [1, 2];
			const dest = [1, 2, 3];
			const changed = arrayCopy(src, dest);
			expect(dest).toEqual(src);
			expect(changed).toBe(true);
		});

		it("should return true if dest was changed (content diff)", () => {
			const src = [1, 3];
			const dest = [1, 2];
			const changed = arrayCopy(src, dest);
			expect(dest).toEqual(src);
			expect(changed).toBe(true);
		});

		it("should return false if dest is identical to src", () => {
			const src = [1, 2];
			const dest = [1, 2];
			const changed = arrayCopy(src, dest);
			expect(dest).toEqual(src);
			expect(changed).toBe(false);
		});
	});

	describe("copyObject", () => {
		it("should shallow copy properties", () => {
			const src = { a: 1, b: 2 };
			const dest = { a: 1, b: 3 };
			const changed = copyObject(src, dest);
			expect(dest).toEqual(src);
			expect(changed).toBe(true);
		});

		it("should return false if objects are identical", () => {
			const src = { a: 1 };
			const dest = { a: 1 };
			const changed = copyObject(src, dest);
			expect(changed).toBe(false);
		});
	});

	describe("copyStringMap", () => {
		it("should copy map values", () => {
			const src = new Map([["key1", { val: 1 }]]);
			const dest = new Map([["key1", { val: 0 }]]);
			const changed = copyStringMap(src, dest);
			// copyStringMap mutates the objects inside dest if they exist
			expect(dest.get("key1")).toEqual({ val: 1 });
			expect(changed).toBe(true);
		});
	});

	describe("replaceStrings", () => {
		it("should remove targets and append add string", () => {
			const res = replaceStrings("foo bar baz", ["bar"], " qux");
			expect(res).toBe("foo  baz qux");
		});
	});

	describe("findStrings", () => {
		it("should find exact match", () => {
			const res = findStrings("foo bar", ["bar", "baz"]);
			expect(res).toBe("bar");
		});

		it("should return empty string if not found", () => {
			const res = findStrings("foo", ["bar"]);
			expect(res).toBe("");
		});
	});

	describe("getCombinations", () => {
		it("should generate all combinations of base <= maxLength", () => {
			const base = ["a", "b"];
			// Expect combinations of length 1 and 2: 'a', 'ab', 'b'
			const res = getCombinations(base, 2);
			expect(res).toHaveLength(3);
			expect(res).toEqual(expect.arrayContaining(["a", "b", "ab"]));
		});

		it("should respect maxLength", () => {
			const base = ["a", "b", "c"];
			const res = getCombinations(base, 2);
			// Should validation that no result is longer than 2
			res.forEach((comb) => {
				expect(comb.length).toBeLessThanOrEqual(2);
			});
			// Should contain length 1 and 2 combinations
			expect(res).toEqual(expect.arrayContaining(["a", "b", "c", "ab", "ac", "bc"]));
			// Should NOT contain 'abc'
			expect(res).not.toContain("abc");
		});
	});

	describe("deepClone", () => {
		it("should deep clone an object", () => {
			const original = { a: { b: 1 } };
			const clone = deepClone(original);
			expect(clone).toEqual(original);
			expect(clone).not.toBe(original);
			expect(clone.a).not.toBe(original.a);
		});
	});

	describe("selectRandomInto", () => {
		it("should select n elements correctly", () => {
			const src = [1, 2, 3, 4, 5];
			const dest: number[] = [];
			selectRandomInto(src, dest, 3, 5);
			expect(dest.length).toBe(3);
			dest.forEach((d) => expect(src).toContain(d));
		});

		it("should handle asking for more than src length", () => {
			const src = [1, 2];
			const dest: number[] = [];
			selectRandomInto(src, dest, 5, 5);
			expect(dest.length).toBe(2);
			expect(dest).toEqual(src);
		});
	});

	describe("shuffle", () => {
		it("should shuffle array in place", () => {
			const arr = [1, 2, 3, 4, 5];
			const original = [...arr];
			shuffle(arr);
			expect(arr.sort()).toEqual(original.sort());
			// It's possible but unlikely it returns to same order, so checking elements exist is safer suitable for unit test
		});
	});

	describe("padToMultiple", () => {
		it("should pad array validity", () => {
			const arr = ["a", "b"];
			padToMultiple(arr, 5); // multiple of 5
			expect(arr.length % 5).toBe(0);
			// check original content is still there
			expect(arr).toEqual(expect.arrayContaining(["a", "b"]));
		});
	});
});
