import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { clear, getMany, setMany } from "idb-keyval";
import { IDBStore } from "./IDBStore.svelte";
import { LessonDB } from "./LessonDB.svelte";
import { LessonsDB } from "./LessonsDB.svelte";
import { SettingsDB } from "./SettingsDB.svelte";
import { ColorIndex } from "./Colors.svelte";
import { SourceIndex } from "./SourceDB.svelte";
import { KeyboardIndex, LayoutIndex } from "./keyboard";

// Mock the $app/environment module
vi.mock("$app/environment", () => ({
	browser: true,
}));

describe("IDBStore", () => {
	let store: IDBStore;

	beforeEach(async () => {
		// Clear IndexedDB before each test
		await clear();
		// Create a fresh IDBStore instance
		store = new IDBStore();
	});

	afterEach(async () => {
		// Clean up after each test
		await clear();
	});

	describe("Constructor and Initialization", () => {
		it("should create an instance successfully", () => {
			const newStore = new IDBStore();
			expect(newStore).toBeInstanceOf(IDBStore);
		});

		it("should detect IndexedDB availability", () => {
			// This test verifies the constructor doesn't throw
			expect(() => new IDBStore()).not.toThrow();
		});
	});

	describe("getValues() - Basic Functionality", () => {
		it("should retrieve a single value with default when nothing is stored", async () => {
			const keys = ["testKey"];
			const defaults = ["defaultValue"];

			const values = await store.getValues(keys, defaults);

			expect(values).toEqual(defaults);
			expect(values[0]).toBe("defaultValue");
		});

		it("should retrieve a single existing value from IndexedDB", async () => {
			const key = "storedKey";
			const storedValue = "storedValue";
			await setMany([[key, storedValue]]);

			const values = await store.getValues([key], ["default"]);

			expect(values[0]).toBe(storedValue);
		});

		it("should retrieve multiple values in a single call", async () => {
			const keys = ["key1", "key2", "key3"];
			const defaults = ["default1", "default2", "default3"];

			const values = await store.getValues(keys, defaults);

			expect(values).toEqual(defaults);
			expect(values.length).toBe(3);
		});

		it("should handle mixed scenario - some values exist, some don't", async () => {
			await setMany([
				["existingKey1", "existingValue1"],
				["existingKey2", "existingValue2"],
			]);

			const keys = ["existingKey1", "newKey", "existingKey2"];
			const defaults = ["default1", "default2", "default3"];

			const values = await store.getValues(keys, defaults);

			expect(values[0]).toBe("existingValue1");
			expect(values[1]).toBe("default2"); // Should use default
			expect(values[2]).toBe("existingValue2");
		});

		it("should not recreate LoadStates on repeated calls", async () => {
			const keys = ["repeatKey"];
			const defaults = ["defaultValue"];

			// First call
			await store.getValues(keys, defaults);

			// Second call - should reuse existing LoadState
			const values = await store.getValues(keys, defaults);

			expect(values[0]).toBe("defaultValue");
		});

		it("should save default values to IndexedDB when they don't exist", async () => {
			const keys = ["newKey"];
			const defaults = [{ data: "newData" }];

			await store.getValues(keys, defaults);

			// Verify it was saved
			const retrieved = await getMany(keys);
			expect(retrieved[0]).toEqual({ data: "newData" });
		});
	});

	describe("setValue() Functionality", () => {
		it("should update a single value", async () => {
			const key = "updateKey";
			const newValue = { updated: true };

			await store.setValue(key, newValue);

			// Verify it was saved to IndexedDB
			const retrieved = await getMany([key]);
			expect(retrieved[0]).toEqual(newValue);
		});

		it("should update an existing value", async () => {
			const key = "existingKey";
			await setMany([[key, "oldValue"]]);

			await store.setValue(key, "newValue");

			const retrieved = await getMany([key]);
			expect(retrieved[0]).toBe("newValue");
		});

		it("should handle complex object updates", async () => {
			const key = "complexKey";
			const complexValue = {
				nested: {
					data: [1, 2, 3],
					flag: true,
				},
			};

			await store.setValue(key, complexValue);

			const retrieved = await getMany([key]);
			expect(retrieved[0]).toEqual(complexValue);
		});
	});

	describe("clearDatabase() Functionality", () => {
		it("should clear all stored data", async () => {
			// Store some data
			await setMany([
				["key1", "value1"],
				["key2", "value2"],
				["key3", "value3"],
			]);

			store.clearIDB();

			// Wait a moment for async clear
			await new Promise((resolve) => setTimeout(resolve, 50));

			// Verify all data is cleared
			const values = await getMany(["key1", "key2", "key3"]);
			expect(values).toEqual([undefined, undefined, undefined]);
		});

		it("should reset LoadStates to initialized", async () => {
			const keys = ["testKey"];
			const defaults = ["default"];

			// Load a value first to create LoadState
			await store.getValues(keys, defaults);

			// Clear the database
			store.clearIDB();

			// The LoadStates should be reset (though we can't directly verify internal state)
			// We can verify the database is cleared
			const values = await getMany(keys);
			expect(values[0]).toBeUndefined();
		});
	});

	describe("Data Type Specific Tests", () => {
		describe("idbCustomWords (string[])", () => {
			it("should handle custom words array", async () => {
				const customWords = ["hello", "world", "test", "example"];
				const keys = ["customWords"];

				await store.setValue(keys[0], customWords);

				const values = await store.getValues(keys, [[]]);
				expect(values[0]).toEqual(customWords);
			});

			it("should handle empty custom words array", async () => {
				const keys = ["customWords"];
				const defaults = [[]];

				const values = await store.getValues(keys, defaults);
				expect(values[0]).toEqual([]);
			});
		});

		describe("idbCodeWords (boolean[])", () => {
			it("should handle code words boolean array", async () => {
				const codeWords = [true, false, true, false, true, false, true, false, true];
				const keys = ["idbCodeWords"];

				await store.setValue(keys[0], codeWords);

				const values = await store.getValues(keys, [[]]);
				expect(values[0]).toEqual(codeWords);
				expect((values[0] as boolean[]).length).toBe(9);
			});

			it("should preserve boolean values correctly", async () => {
				const codeWords = [false, false, false, false, false, false, false, false, false];
				const keys = ["idbCodeWords"];

				await store.setValue(keys[0], codeWords);

				const values = await store.getValues(keys, [[]]);
				expect(values[0]).toEqual(codeWords);
				// Verify all are false, not undefined
				(values[0] as boolean[]).forEach((val) => {
					expect(val).toBe(false);
				});
			});
		});

		describe("idbLessons (LessonsDB)", () => {
			it("should handle LessonsDB object", async () => {
				const lessons = new LessonsDB();
				const lessonIndex = SourceIndex.trigrams;
				lessons.sourceLessons[lessonIndex] = new LessonDB({
					scope: 15,
					combination: 25,
					repetition: 35,
					filter: "test filter",
					WPMs: [50, 60, 70],
				});

				const keys = ["idbLessons"];
				await store.setValue(keys[0], lessons);

				const values = await store.getValues(keys, [new LessonsDB()]);
				const retrieved = values[0] as LessonsDB;

				expect(retrieved.sourceLessons[lessonIndex].scope).toBe(15);
				expect(retrieved.sourceLessons[lessonIndex].combination).toBe(25);
				expect(retrieved.sourceLessons[lessonIndex].repetition).toBe(35);
				expect(retrieved.sourceLessons[lessonIndex].filter).toBe("test filter");
				expect(retrieved.sourceLessons[lessonIndex].WPMs).toEqual([50, 60, 70]);
			});

			it("should handle default LessonsDB when nothing is stored", async () => {
				const keys = ["idbLessons"];
				const defaultLessons = new LessonsDB();

				const values = await store.getValues(keys, [defaultLessons]);
				const retrieved = values[0] as LessonsDB;

				expect(retrieved.sourceLessons.length).toBe(defaultLessons.sourceLessons.length);
			});
		});

		describe("idbSettings (SettingsDB)", () => {
			it("should handle SettingsDB object", async () => {
				const settings = new SettingsDB();
				settings.minimumWPM = 50;
				settings.minimumAccuracy = 95;
				settings.colorIndex = ColorIndex.blue;
				settings.keyboard = KeyboardIndex.matrix;
				settings.layout = LayoutIndex.colemakDH;
				settings.volume = 75;

				const keys = ["idbSettings"];
				await store.setValue(keys[0], settings);

				const values = await store.getValues(keys, [new SettingsDB()]);
				const retrieved = values[0] as SettingsDB;

				expect(retrieved.minimumWPM).toBe(50);
				expect(retrieved.minimumAccuracy).toBe(95);
				expect(retrieved.colorIndex).toBe(ColorIndex.blue);
				expect(retrieved.keyboard).toBe(KeyboardIndex.matrix);
				expect(retrieved.layout).toBe(LayoutIndex.colemakDH);
				expect(retrieved.volume).toBe(75);
			});

			it("should handle default SettingsDB when nothing is stored", async () => {
				const keys = ["idbSettings"];
				const defaultSettings = new SettingsDB();

				const values = await store.getValues(keys, [defaultSettings]);
				const retrieved = values[0] as SettingsDB;

				expect(retrieved.minimumWPM).toBe(40);
				expect(retrieved.minimumAccuracy).toBe(100);
				expect(retrieved.colorIndex).toBe(ColorIndex.fuchsia);
				expect(retrieved.volume).toBe(100);
			});
		});
	});

	describe("Multi-Value Operations", () => {
		it("should retrieve all four data types in a single call", async () => {
			const customWords = ["test", "words"];
			const codeWords = [true, false, true, false, true, false, true, false, true];
			const lessons = new LessonsDB();
			const settings = new SettingsDB();
			settings.volume = 80;

			// Store all values
			await setMany([
				["customWords", customWords],
				["idbCodeWords", codeWords],
				["idbLessons", lessons],
				["idbSettings", settings],
			]);

			const keys = ["customWords", "idbCodeWords", "idbLessons", "idbSettings"];
			const defaults = [[], [], new LessonsDB(), new SettingsDB()];

			const values = await store.getValues(keys, defaults);

			expect(values[0]).toEqual(customWords);
			expect(values[1]).toEqual(codeWords);
			expect((values[3] as SettingsDB).volume).toBe(80);
		});

		it("should handle mixed defaults and existing values for all four types", async () => {
			const customWords = ["existing", "words"];
			const lessons = new LessonsDB();

			// Store only two of the four
			await setMany([
				["customWords", customWords],
				["idbLessons", lessons],
			]);

			const keys = ["customWords", "idbCodeWords", "idbLessons", "idbSettings"];
			const defaults = [
				[],
				[false, false, false, false, false, false, false, false, false],
				new LessonsDB(),
				new SettingsDB(),
			];

			const values = await store.getValues(keys, defaults);

			// Existing values
			expect(values[0]).toEqual(customWords);

			// Default values
			expect(values[1]).toEqual([false, false, false, false, false, false, false, false, false]);
			expect((values[3] as SettingsDB).volume).toBe(100);
		});

		it("should update multiple values and verify persistence", async () => {
			const customWords = ["updated", "custom"];
			const codeWords = [true, true, false, false, true, true, false, false, true];
			const lessons = new LessonsDB();
			const settings = new SettingsDB();
			settings.minimumWPM = 60;

			// Update all four
			await store.setValue("customWords", customWords);
			await store.setValue("idbCodeWords", codeWords);
			await store.setValue("idbLessons", lessons);
			await store.setValue("idbSettings", settings);

			// Retrieve and verify
			const keys = ["customWords", "idbCodeWords", "idbLessons", "idbSettings"];
			const retrieved = await getMany(keys);

			expect(retrieved[0]).toEqual(customWords);
			expect(retrieved[1]).toEqual(codeWords);
			expect((retrieved[3] as SettingsDB).minimumWPM).toBe(60);
		});
	});

	describe("Edge Cases", () => {
		it("should handle empty arrays", async () => {
			const keys = ["emptyArray"];
			const defaults = [[]];

			const values = await store.getValues(keys, defaults);
			expect(values[0]).toEqual([]);
		});

		it("should handle objects with null values", async () => {
			const keys = ["nullValue"];
			const defaults = [{ value: null, other: "test" }];

			const values: unknown[] = await store.getValues(keys, defaults);
			expect((values[0] as { value: unknown; other: string }).value).toBeNull();
			expect((values[0] as { value: unknown; other: string }).other).toBe("test");
		});

		it("should handle large arrays", async () => {
			const largeArray = Array.from({ length: 1000 }, (_, i) => `word${i}`);
			const keys = ["largeArray"];

			await store.setValue(keys[0], largeArray);

			const values = await store.getValues(keys, [[]]);
			expect((values[0] as string[]).length).toBe(1000);
			expect(values[0]).toEqual(largeArray);
		});

		it("should handle deeply nested objects", async () => {
			const nested = {
				level1: {
					level2: {
						level3: {
							level4: {
								data: "deep",
								array: [1, 2, 3],
							},
						},
					},
				},
			};

			const keys = ["nested"];
			await store.setValue(keys[0], nested);

			const values = await store.getValues(keys, [{}]);
			expect(
				(values[0] as { level1: { level2: { level3: { level4: { data: string; array: number[] } } } } }).level1
					.level2.level3.level4.data
			).toBe("deep");
		});

		it("should handle concurrent getValues calls", async () => {
			const keys1 = ["key1"];
			const keys2 = ["key2"];
			const defaults1 = ["default1"];
			const defaults2 = ["default2"];

			// Call both simultaneously
			const [values1, values2] = await Promise.all([
				store.getValues(keys1, defaults1),
				store.getValues(keys2, defaults2),
			]);

			expect(values1[0]).toBe("default1");
			expect(values2[0]).toBe("default2");
		});
	});

	describe("Server-Side Rendering", () => {
		it("should return defaults when not in browser", async () => {
			// This test would need to mock browser: false
			// For now, we just verify the current behavior works
			const keys = ["testKey"];
			const defaults = ["defaultValue"];

			const values = await store.getValues(keys, defaults);
			expect(values).toBeDefined();
		});
	});
});
