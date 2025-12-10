import { tick } from "svelte";

export enum LoadIndex {
	initialized = 0,
	default,
	checkingIDB,
	loadingIDB,
	retrievingIDB,
	savingIDB,
	loadingServer,
	loadingLocal,
	loaded,
	clearing,
	cleared,
	error,
}
export const LoadNames: string[] = [
	"Initialized",
	"Default",
	"Checking IndexedDB",
	"Loading from IndexedDB",
	"Retrieving from IndexedDB",
	"Saving to IndexedDB",
	"Loading Server",
	"Loading Local",
	"Loaded",
	"Clearing",
	"Cleared",
	"Error",
];

/**
 * Track loading states.
 * TODO: display a loading spinner.
 *
 */
export class LoadState {
	name: string = "";
	state: LoadIndex = $state(LoadIndex.initialized);
	traceDatabase: boolean = false;
	static clearDatabase: boolean = false;

	constructor(name: string, traceDatabase: boolean = false) {
		this.name = name;
		this.traceDatabase = traceDatabase;
	}

	setState(index: LoadIndex): void {
		if (index == LoadIndex.loaded) {
			tick().then(() => {
				this.state = index;
			});
		}
		this.state = index;
		if (this.traceDatabase) console.log(this.name, "LoadState:", LoadNames[index]);
	}
}
