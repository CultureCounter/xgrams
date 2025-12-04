/* eslint-disable @typescript-eslint/no-unused-expressions */
import { tick } from "svelte";
import { getMany, setMany } from "idb-keyval";
import { loadState } from "./store/loadState.svelte";

export class ServerStorage<T extends object> {
	#name: string;
	#keys: string[];
	#props: (keyof T)[];
	#url: string;
	#parser: (text: string) => T;
	#version = $state(0);
	#listeners = 0;
	#value: T;
	#channel: BroadcastChannel | undefined;

	#handler = (event: MessageEvent) => {
		if (event.data?.name !== this.#name) return;

		// Reload from IDB when another tab updates it
		getMany(this.#keys).then((vals) => {
			if (vals.every((v) => v !== undefined)) {
				this.#updateValueFromIDB(vals);
				this.#version += 1;
			}
		});
	};

	constructor(
		name: string,
		keys: string[],
		props: (keyof T)[],
		url: string,
		parser: (text: string) => T,
		initial: T
	) {
		this.#name = name;
		this.#keys = keys;
		this.#props = props;
		this.#url = url;
		this.#parser = parser;
		this.#value = initial;

		if (typeof window !== "undefined") {
			this.#channel = new BroadcastChannel("xgrams_server_storage_sync");

			// Initial load
			getMany(this.#keys).then((vals) => {
				// Check if we have data for all keys
				const hasAllData = vals.every((v) => v !== undefined);

				if (hasAllData) {
					if (loadState.traceDatabase) console.log(`ServerStorage[${this.#name}] loaded from IDB`);
					this.#updateValueFromIDB(vals);
					this.#version += 1;
					// We might want to update loadState here, but it's shared global state.
					// For now, we'll let the caller handle global loadState or add a callback if needed.
					// But based on SourceXG, it updates loadState.sourceXG.
				} else {
					if (loadState.traceDatabase)
						console.log(`ServerStorage[${this.#name}] missing data in IDB, fetching from server`);
					this.#fetchFromServer();
				}
			});
		}
	}

	#updateValueFromIDB(vals: T[keyof T][]) {
		for (let i = 0; i < this.#props.length; i++) {
			const prop = this.#props[i];
			const val = vals[i];
			this.#value[prop] = val;
		}
	}

	async #fetchFromServer() {
		try {
			const response = await fetch(this.#url);
			if (!response.ok) {
				console.error(`ServerStorage[${this.#name}] fetch failed:`, response.status, response.statusText);
				return;
			}

			const text = await response.text();
			let data: T;
			try {
				data = this.#parser(text);
			} catch (e) {
				console.error(`ServerStorage[${this.#name}] parse failed:`, e);
				// Fallback to initial or empty?
				// For now, just return and keep initial
				return;
			}

			// Update internal value
			// We assume the parsed data matches the structure of T
			Object.assign(this.#value, data);
			this.#version += 1;

			// Save to IDB
			const entries: [IDBValidKey, unknown][] = [];
			for (let i = 0; i < this.#props.length; i++) {
				const prop = this.#props[i];
				const key = this.#keys[i];
				entries.push([key, data[prop]]);
			}

			await setMany(entries);
			if (loadState.traceDatabase) console.log(`ServerStorage[${this.#name}] saved to IDB`);

			this.#channel?.postMessage({ name: this.#name });
		} catch (e) {
			console.error(`ServerStorage[${this.#name}] error:`, e);
		}
	}

	get current(): T {
		this.#version; // Subscribe to changes

		const root = this.#value;
		const proxies = new WeakMap();

		const proxy = (value: unknown) => {
			if (typeof value !== "object" || value === null) {
				return value;
			}

			let p = proxies.get(value);

			if (!p) {
				p = new Proxy(value, {
					get: (target, property) => {
						this.#version;
						return proxy(Reflect.get(target, property));
					},
					set: (target, property, value) => {
						this.#version += 1;
						Reflect.set(target, property, value);

						if (typeof window !== "undefined") {
							// Save all keys? Or try to optimize?
							// For simplicity, we'll save all keys managed by this storage.
							// This might be expensive if T is huge.
							// But SourceXG splits data into chunks (bigrams, etc).
							// If we modify one array, we probably want to save just that array.
							// But here we don't know which key 'property' belongs to easily without searching #props.

							// Optimization: Find which prop changed.
							// But 'target' might be a nested object.
							// If it's the root object, 'property' is one of #props.

							if (target === root) {
								const index = this.#props.indexOf(property as keyof T);
								if (index !== -1) {
									const key = this.#keys[index];
									setMany([[key, value]]).then(() => {
										this.#channel?.postMessage({ name: this.#name });
									});
									return true;
								}
							}

							// If nested change, we might need to save everything or find the root prop.
							// For now, let's save everything to be safe, or maybe just log a warning that deep updates might be slow.
							// Actually, SourceXG arrays are top-level properties.
							// So mostly we are setting 'bigrams = ...'.

							// If we do `idbSources.current.bigrams.push(...)`, that's a nested change.
							// We need to find which top-level prop owns this object.

							// Let's iterate props to find which one contains 'target'.
							// This is slow.

							// Alternative: Just save everything.
							const entries: [IDBValidKey, unknown][] = [];
							for (let i = 0; i < this.#props.length; i++) {
								const prop = this.#props[i];
								const key = this.#keys[i];
								entries.push([key, this.#value[prop]]);
							}
							setMany(entries).then(() => {
								this.#channel?.postMessage({ name: this.#name });
							});
						}

						return true;
					},
				});

				proxies.set(value, p);
			}

			return p;
		};

		if ($effect.tracking()) {
			$effect(() => {
				if (this.#listeners === 0) {
					this.#channel?.addEventListener("message", this.#handler);
				}

				this.#listeners += 1;

				return () => {
					tick().then(() => {
						this.#listeners -= 1;
						if (this.#listeners === 0) {
							this.#channel?.removeEventListener("message", this.#handler);
						}
					});
				};
			});
		}

		return proxy(root) as T;
	}

	set current(value: T) {
		this.#value = value;
		this.#version += 1;

		if (typeof window !== "undefined") {
			const entries: [IDBValidKey, unknown][] = [];
			for (let i = 0; i < this.#props.length; i++) {
				const prop = this.#props[i];
				const key = this.#keys[i];
				entries.push([key, value[prop]]);
			}
			setMany(entries).then(() => {
				this.#channel?.postMessage({ name: this.#name });
			});
		}
	}
}
