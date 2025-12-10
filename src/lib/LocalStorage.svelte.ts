/* eslint-disable @typescript-eslint/no-unused-expressions */
import { LoadState, LoadIndex } from "./store/loadState.svelte";

export class LocalStorage<T> {
	#key: string;
	#version = $state(0);
	#value: T;
	#loadState: LoadState;

	constructor(key: string, loadState: LoadState, initial: T) {
		this.#key = key;
		this.#loadState = loadState;
		this.#value = initial;

		if (typeof localStorage !== "undefined") {
			this.#loadState.setState(LoadIndex.loadingLocal);
			const oldkey = localStorage.getItem(key);
			if (oldkey === null || oldkey === undefined) {
				this.#loadState.setState(LoadIndex.default);
				try {
					localStorage.setItem(key, JSON.stringify(initial));
					this.#loadState.setState(LoadIndex.loaded);
				} catch (e) {
					console.error(`LocalStorage: Error setting initial value for ${this.#key}`, e);
					this.#loadState.setState(LoadIndex.error);
				}
			}
		}
	}

	get current(): T {
		this.#version;

		const root =
			typeof localStorage !== "undefined" ? JSON.parse(localStorage.getItem(this.#key) as string) : this.#value;
		// if (typeof localStorage !== 'undefined') {
		// 	console.log(`localStorage.getItem(this.#key) =`, localStorage.getItem(this.#key));
		// 	console.log(`LocalStorage: Get ${this.#key} =`, root);
		// }
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

						if (typeof localStorage !== "undefined") {
							localStorage.setItem(this.#key, JSON.stringify(root));
						}

						return true;
					},
				});

				proxies.set(value, p);
			}

			return p;
		};

		return proxy(root);
	}

	set current(value) {
		if (typeof localStorage !== "undefined") {
			localStorage.setItem(this.#key, JSON.stringify(value));
			// console.log(`LocalStorage: Set ${this.#key} to`, value);
		}

		this.#version += 1;
	}
}
