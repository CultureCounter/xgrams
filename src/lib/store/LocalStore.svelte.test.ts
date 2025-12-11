// Mock typia globally
Object.defineProperty(window, "typia", {
	value: {
		json: {
			assertParse: (str: string) => JSON.parse(str),
			stringify: (obj: unknown) => JSON.stringify(obj),
		},
	},
	writable: true,
});

import { describe, it, expect, beforeEach, afterEach, vi, type Mock } from "vitest";
import { LocalStore } from "./LocalStore.svelte";
import { LoadState, LoadIndex } from "./store/loadState.svelte";

describe("LocalStore", () => {
	let mockLoadState: LoadState;
	let originalLocalStorage: Storage | undefined;

	beforeEach(() => {
		// Mock LoadState
		mockLoadState = new LoadState("test", false);

		// Store original localStorage reference
		originalLocalStorage = window.localStorage;

		// Mock localStorage with default implementation
		const mockStorage = {
			getItem: vi.fn(),
			setItem: vi.fn(),
			removeItem: vi.fn(),
			clear: vi.fn(),
			key: vi.fn(),
			length: 0,
		};

		Object.defineProperty(window, "localStorage", {
			value: mockStorage,
			writable: true,
		});
	});

	afterEach(() => {
		// Restore original localStorage if it existed
		if (typeof originalLocalStorage !== "undefined") {
			Object.defineProperty(window, "localStorage", {
				value: originalLocalStorage,
				writable: true,
			});
		} else {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			delete (window as any).localStorage;
		}

		vi.restoreAllMocks();
	});

	describe("Constructor", () => {
		it("should create an instance with correct initial values", () => {
			const initialValue = { data: "test" };
			const store = new LocalStore("testKey", initialValue, mockLoadState);

			expect(store).toBeInstanceOf(LocalStore);
		});
	});

	describe("getValue - Browser Environment", () => {
		it("should load existing value from localStorage", async () => {
			const storedValue = { data: "stored", count: 42 };
			const jsonString = JSON.stringify(storedValue);

			(localStorage.getItem as Mock).mockReturnValue(jsonString);

			const store = new LocalStore("testKey", { data: "default" }, mockLoadState);
			const result = await store.getValue();

			expect(localStorage.getItem).toHaveBeenCalledWith("testKey");
			expect(result).toEqual(storedValue);
			expect(mockLoadState.state).toBe(LoadIndex.loaded);
		});

		it("should use default value when nothing is stored", async () => {
			(localStorage.getItem as Mock).mockReturnValue(null);

			const defaultValue = { data: "default", active: false };
			const store = new LocalStore("testKey", defaultValue, mockLoadState);
			const result = await store.getValue();

			expect(localStorage.getItem).toHaveBeenCalledWith("testKey");
			expect(result).toEqual(defaultValue);
			expect(localStorage.setItem).toHaveBeenCalledWith("testKey", JSON.stringify(defaultValue));
			expect(mockLoadState.state).toBe(LoadIndex.loaded);
		});

		it("should handle null return from localStorage", async () => {
			(localStorage.getItem as Mock).mockReturnValue(null);

			const defaultValue = "default string";
			const store = new LocalStore("testKey", defaultValue, mockLoadState);
			const result = await store.getValue();

			expect(result).toBe(defaultValue);
			expect(localStorage.setItem).toHaveBeenCalledWith("testKey", JSON.stringify(defaultValue));
		});

		it("should handle undefined return from localStorage", async () => {
			(localStorage.getItem as Mock).mockReturnValue(undefined);

			const defaultValue = [1, 2, 3];
			const store = new LocalStore("testKey", defaultValue, mockLoadState);
			const result = await store.getValue();

			expect(result).toEqual(defaultValue);
			expect(localStorage.setItem).toHaveBeenCalledWith("testKey", JSON.stringify(defaultValue));
		});

		it("should handle invalid JSON gracefully", async () => {
			(localStorage.getItem as Mock).mockReturnValue("{invalid json: missing quote}");

			const defaultValue = { data: "default" };
			const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

			const store = new LocalStore("testKey", defaultValue, mockLoadState);
			const result = await store.getValue();

			expect(result).toEqual(defaultValue);
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				"LocalStore: Error parsing value for testKey",
				expect.any(Error)
			);
			expect(mockLoadState.state).toBe(LoadIndex.error);

			consoleErrorSpy.mockRestore();
		});

		it("should handle typia validation failures gracefully", async () => {
			// Valid JSON but wrong structure for the expected type
			const wrongStructure = { wrongField: "wrong", unexpected: 123 };
			(localStorage.getItem as Mock).mockReturnValue(JSON.stringify(wrongStructure));

			const defaultValue = { correctField: "correct" };
			const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

			const store = new LocalStore("testKey", defaultValue, mockLoadState);
			const result = await store.getValue();

			expect(result).toEqual(defaultValue);
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				"LocalStore: Error parsing value for testKey",
				expect.any(Error)
			);
			expect(mockLoadState.state).toBe(LoadIndex.error);

			consoleErrorSpy.mockRestore();
		});

		it("should update the internal value when loading from storage", async () => {
			const storedValue = { newData: "loaded" };
			(localStorage.getItem as Mock).mockReturnValue(JSON.stringify(storedValue));

			const store = new LocalStore("testKey", { oldData: "initial" }, mockLoadState);
			const result = await store.getValue();

			expect(result).toEqual(storedValue);
			// Verify internal value was updated by calling getValue again without storage access
			(localStorage.getItem as Mock).mockClear();
			(localStorage.setItem as Mock).mockClear();

			// This should not access localStorage again since we have the value loaded
			const result2 = await store.getValue();
			expect(result2).toEqual(storedValue);
			expect(localStorage.getItem).not.toHaveBeenCalled();
		});

		it("should handle primitive types", async () => {
			(localStorage.getItem as Mock).mockReturnValue('"hello world"');

			const store = new LocalStore("stringKey", "default", mockLoadState);
			const result = await store.getValue();

			expect(result).toBe("hello world");
		});

		it("should handle numbers", async () => {
			(localStorage.getItem as Mock).mockReturnValue("42");

			const store = new LocalStore("numberKey", 0, mockLoadState);
			const result = await store.getValue();

			expect(result).toBe(42);
		});

		it("should handle booleans", async () => {
			(localStorage.getItem as Mock).mockReturnValue("true");

			const store = new LocalStore("booleanKey", false, mockLoadState);
			const result = await store.getValue();

			expect(result).toBe(true);
		});

		it("should handle arrays", async () => {
			const storedArray = [1, "two", true, { nested: "object" }];
			(localStorage.getItem as Mock).mockReturnValue(JSON.stringify(storedArray));

			const store = new LocalStore("arrayKey", [], mockLoadState);
			const result = await store.getValue();

			expect(result).toEqual(storedArray);
		});
	});

	describe("getValue - Server Environment", () => {
		beforeEach(() => {
			// Simulate server environment by removing localStorage
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			delete (window as any).localStorage;
		});

		it("should return default value when localStorage is undefined", async () => {
			const defaultValue = { server: "default" };
			const store = new LocalStore("serverKey", defaultValue, mockLoadState);
			const result = await store.getValue();

			expect(result).toEqual(defaultValue);
			expect(mockLoadState.state).toBe(LoadIndex.loaded);
		});

		it("should handle primitive defaults on server", async () => {
			const store = new LocalStore("serverString", "server default", mockLoadState);
			const result = await store.getValue();

			expect(result).toBe("server default");
		});
	});

	describe("setValue", () => {
		it("should save value to localStorage", () => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const store = new LocalStore("testKey", {} as any, mockLoadState);
			const newValue = { updated: "value", count: 10 };

			store.setValue(newValue);

			expect(localStorage.setItem).toHaveBeenCalledWith("testKey", JSON.stringify(newValue));
			expect(mockLoadState.state).toBe(LoadIndex.loaded);
		});

		it("should handle stringify errors gracefully", () => {
			// Create a circular reference object that would cause stringify to fail
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const circularObj: Record<string, any> = {};
			circularObj.self = circularObj;

			const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

			const store = new LocalStore("circularKey", {}, mockLoadState);
			store.setValue(circularObj);

			expect(consoleErrorSpy).toHaveBeenCalledWith(
				"LocalStore: Error setting value for circularKey",
				expect.any(Error)
			);
			expect(mockLoadState.state).toBe(LoadIndex.error);

			consoleErrorSpy.mockRestore();
		});

		it("should handle primitive values", () => {
			// Test string values
			const stringStore = new LocalStore("stringKey", "", mockLoadState);
			stringStore.setValue("test string");
			expect(localStorage.setItem).toHaveBeenCalledWith("stringKey", '"test string"');

			// Test number values
			const numberStore = new LocalStore("numberKey", 0, mockLoadState);
			numberStore.setValue(42);
			expect(localStorage.setItem).toHaveBeenCalledWith("numberKey", "42");

			// Test boolean values
			const booleanStore = new LocalStore("booleanKey", false, mockLoadState);
			booleanStore.setValue(true);
			expect(localStorage.setItem).toHaveBeenCalledWith("booleanKey", "true");
		});

		it("should update internal value", () => {
			const store = new LocalStore("internal", "initial", mockLoadState);

			store.setValue("updated");

			// This should not access storage again
			(localStorage.getItem as Mock).mockClear();
			store.setValue("updated again");
			expect(localStorage.setItem).toHaveBeenCalledWith("internal", '"updated again"');
		});

		it("should skip localStorage when not available", () => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			delete (window as any).localStorage;

			const store = new LocalStore("noStorage", "default", mockLoadState);

			// Should not throw
			expect(() => store.setValue("new value")).not.toThrow();
			expect(mockLoadState.state).toBe(LoadIndex.loaded);
		});
	});

	describe("LoadState Integration", () => {
		it("should set correct states during getValue", async () => {
			(localStorage.getItem as Mock).mockReturnValue(JSON.stringify("stored"));

			mockLoadState.setState = vi.fn();

			const store = new LocalStore("stateKey", "default", mockLoadState);
			await store.getValue();

			expect(mockLoadState.setState).toHaveBeenCalledWith(LoadIndex.loadingLocal);
			expect(mockLoadState.setState).toHaveBeenCalledWith(LoadIndex.loaded);
		});

		it("should set default state when using default value", async () => {
			(localStorage.getItem as Mock).mockReturnValue(null);

			mockLoadState.setState = vi.fn();

			const store = new LocalStore("defaultKey", "default", mockLoadState);
			await store.getValue();

			expect(mockLoadState.setState).toHaveBeenCalledWith(LoadIndex.loadingLocal);
			expect(mockLoadState.setState).toHaveBeenCalledWith(LoadIndex.default);
			expect(mockLoadState.setState).toHaveBeenCalledWith(LoadIndex.loaded);
		});

		it("should set error state on parse failure", async () => {
			(localStorage.getItem as Mock).mockReturnValue("{invalid json");

			mockLoadState.setState = vi.fn();
			const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

			const store = new LocalStore("errorKey", "default", mockLoadState);
			await store.getValue();

			expect(mockLoadState.setState).toHaveBeenCalledWith(LoadIndex.loadingLocal);
			expect(mockLoadState.setState).toHaveBeenCalledWith(LoadIndex.error);

			consoleErrorSpy.mockRestore();
		});
	});

	describe("Edge Cases", () => {
		it("should handle empty string keys", async () => {
			const store = new LocalStore("", "default", mockLoadState);
			await store.getValue();

			expect(localStorage.getItem).toHaveBeenCalledWith("");
		});

		it("should handle special characters in keys", async () => {
			const store = new LocalStore("key with spaces & symbols!@#", "default", mockLoadState);
			await store.getValue();

			expect(localStorage.getItem).toHaveBeenCalledWith("key with spaces & symbols!@#");
		});

		it("should handle complex nested objects", async () => {
			interface ComplexObject {
				users: Array<{
					id: number;
					name: string;
					roles?: string[];
					metadata?: {
						lastLogin: string;
						preferences: { theme: string };
					};
				}>;
				settings: {
					notifications: boolean;
					timeout: number;
				};
			}

			const complexValue: ComplexObject = {
				users: [
					{ id: 1, name: "Alice", roles: ["admin", "user"] },
					{
						id: 2,
						name: "Bob",
						metadata: { lastLogin: new Date().toISOString(), preferences: { theme: "dark" } },
					},
				],
				settings: {
					notifications: true,
					timeout: 30000,
				},
			};

			const store = new LocalStore("complex", {} as ComplexObject, mockLoadState);
			store.setValue(complexValue);

			expect(localStorage.setItem).toHaveBeenCalledWith("complex", JSON.stringify(complexValue));
		});
	});
});
