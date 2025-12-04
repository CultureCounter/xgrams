/* eslint-disable @typescript-eslint/no-unused-expressions */
import { tick } from "svelte";
import { get, set } from "idb-keyval";

export class IDBStorage<T> {
	#key: string;
	#version = $state(0);
	#listeners = 0;
	#value: T | undefined;
	#channel: BroadcastChannel | undefined;

	#handler = (event: MessageEvent) => {
		if (event.data?.key !== this.#key) return;

		// Reload from IDB when another tab updates it
		get(this.#key).then((val) => {
			if (val !== undefined) {
				this.#value = val;
				this.#version += 1;
			}
		});
	};

	constructor(key: string, initial?: T) {
		this.#key = key;
		this.#value = initial;

		if (typeof window !== "undefined") {
			this.#channel = new BroadcastChannel("xgrams_idb_sync");

			get(key).then((val) => {
				if (val === undefined && initial !== undefined) {
					set(key, initial);
				} else if (val !== undefined) {
					this.#value = val;
					this.#version += 1;
				}
			});
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
							set(this.#key, root).then(() => {
								this.#channel?.postMessage({ key: this.#key });
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

		// If root is undefined (not loaded yet and no initial), we might return undefined cast as T
		// or we rely on the user providing an initial value.
		return proxy(root) as T;
	}

	set current(value: T) {
		this.#value = value;
		this.#version += 1;

		if (typeof window !== "undefined") {
			set(this.#key, value).then(() => {
				this.#channel?.postMessage({ key: this.#key });
			});
		}
	}
}
