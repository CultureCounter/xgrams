import { LoadState, LoadIndex } from "./store/loadState.svelte";
import typia from "typia";

export class LocalStore<T> {
	#key: string;
	#value: T;
	#loadState: LoadState;

	constructor(key: string, initial: T, loadState: LoadState) {
		this.#key = key;
		this.#value = initial;
		this.#loadState = loadState;
	}

	async getValue(): Promise<T> {
		if (typeof localStorage === "undefined") {
			// use default outside browser
			this.#loadState.setState(LoadIndex.default);
			this.#loadState.setState(LoadIndex.loaded);
			return this.#value;
		}

		this.#loadState.setState(LoadIndex.loadingLocal);
		const currentValue = localStorage.getItem(this.#key);
		if (currentValue === null || currentValue === undefined) {
			// use default/current value and store it
			this.#loadState.setState(LoadIndex.default);
			this.setValue(this.#value);
			this.#loadState.setState(LoadIndex.loaded);
		} else {
			// parse stored value
			try {
				// TODO: skanky, upgrade with an extraction to a real T if we ever store non pojo objects.
				const value: T = typia.json.assertParse<T>(currentValue) as T;
				this.#value = value;
			} catch (error) {
				// Parsing error, use default/current value
				console.error(`LocalStore: Error parsing value for ${this.#key}`, error);
				this.#loadState.setState(LoadIndex.error);
			}
		}
		this.#loadState.setState(LoadIndex.loaded);

		return this.#value;
	}

	setValue(val: T) {
		this.#value = val;
		if (typeof localStorage !== "undefined") {
			try {
				const value = typia.json.stringify<T>(val);
				localStorage.setItem(this.#key, value);
				this.#loadState.setState(LoadIndex.loaded);
			} catch (e) {
				console.error(`LocalStore: Error setting value for ${this.#key}`, e);
				this.#loadState.setState(LoadIndex.error);
			}
		}
	}
}
