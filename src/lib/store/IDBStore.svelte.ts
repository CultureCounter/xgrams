import { browser } from "$app/environment";
import { clear, getMany, set, setMany } from "idb-keyval";
import { LoadIndex, LoadState } from "./LoadState.svelte";

export class IDBStore {
	// eslint-disable-next-line svelte/prefer-svelte-reactivity
	#values: Map<string, unknown> = new Map();
	// eslint-disable-next-line svelte/prefer-svelte-reactivity
	#defaults: Map<string, unknown> = new Map();
	// eslint-disable-next-line svelte/prefer-svelte-reactivity
	#loadStates: Map<string, LoadState> = new Map();
	static #idb: boolean | undefined;

	constructor() {
		// Detect if IndexedDB is available
		// TODO: if not use localStorage
		if (!browser) {
			return;
		}
		IDBStore.#idb = "indexedDB" in window;
		if (!IDBStore.#idb) {
			console.log("This browser does not support IndexedDB.");
			return;
		}
	}

	clearDatabase() {
		clear();
		this.#values.clear();
		this.#loadStates.forEach((loadState) => {
			loadState.setState(LoadIndex.initialized);
		});
		// TODO: Keep defaults in case we want to reinitialize
	}

	async getValues(keys: string[], defaultValues: unknown[], trace: boolean = false): Promise<unknown[]> {
		if (LoadState.clearDatabase) {
			return [];
		}

		keys.forEach((key) => {
			if (this.#loadStates.has(key)) {
				return;
			}
			this.#defaults.set(key, defaultValues[keys.indexOf(key)]);
		});

		keys.forEach((key) => {
			const loadState = new LoadState(key, trace);
			this.#loadStates.set(key, loadState);
			if (!browser) {
				loadState.setState(LoadIndex.loaded);
			} else {
				loadState.setState(LoadIndex.loadingIDB);
			}
		});

		if (!browser) {
			// Pure defaults on the server
			return defaultValues;
		}

		const values: unknown[] = await getMany(keys)
			.then((vals) => {
				// Use existing values, defaults otherwise
				const values: unknown[] = [];
				const setValues: [string, unknown][] = [];
				vals.forEach((val, index) => {
					if (val === undefined) {
						values.push(defaultValues[index]);
						this.#values.set(keys[index], defaultValues[index]);
						setValues.push([keys[index], defaultValues[index]]);
					} else {
						values.push(val);
						this.#values.set(keys[index], val);
						setValues.push([keys[index], val]);
					}
					this.#loadStates.get(keys[index])?.setState(LoadIndex.loaded);
				});
				if (setValues.length > 0) {
					setMany(setValues).catch((e) => {
						console.error("IDBStore: Error setting values", e);
					});
				}
				return values;
			})
			.catch((e) => {
				console.error("IDBStore: Error getting values", e);
				return defaultValues;
			});

		return values;
	}

	getLoadState(key: string): LoadState {
		if (!this.#loadStates.has(key)) {
			throw new Error("LoadState not found for key: " + key);
		}
		return this.#loadStates.get(key) as LoadState;
	}

	setValue(key: string, value: unknown) {
		if (!browser || LoadState.clearDatabase) {
			return;
		}
		set(key, value);
		this.#values.set(key, value);
		this.#loadStates.get(key)?.setState(LoadIndex.loaded);
	}

	getValue(key: string): unknown {
		if (!browser || LoadState.clearDatabase) {
			return;
		}
		if (!this.#values.has(key)) {
			throw new Error("Value not found for key: " + key);
		}
		return this.#values.get(key);
	}
}
