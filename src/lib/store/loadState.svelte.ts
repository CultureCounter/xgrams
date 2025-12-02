export enum LoadIndex {
	checkingIDB = 0,
	loadingServer,
	retrievingIDB,
	savingIDB,
	loaded,
}
export const LoadNames: string[] = [
	"Checking IndexedDB",
	"Loading from Server",
	"Retrieving from IndexedDB",
	"Saving to IndexedDB",
	"Loaded",
];

/**
 * Track loading states.
 * It is used to display a loading spinner and to determine when the application is ready to be used.
 *
 * @property sourceXG - The loading state of the source XG.
 * @property settingsXG - The loading state of the settings XG.
 */
export const loadState = $state({
	sourceXG: LoadIndex.checkingIDB,
	settingsXG: LoadIndex.checkingIDB,
	idbLessons: LoadIndex.checkingIDB,
	clearDatabase: false,
	traceDatabase: true,
});
