// DarkLight Service
import { localStorageStore } from '@skeletonlabs/skeleton';
import { get } from 'svelte/store';
import { TrinaryValue } from './trinary';

// Stores ---
// true: light, false: dark, neither: use OS value

/** Store: User Darklight State */
export const userDarkLight = localStorageStore<TrinaryValue>('userDarkLight', TrinaryValue.neither);

/** Store: Current Darklight State */
export const currentDarklight = localStorageStore<boolean>('currentDarklight', false);

// Get ---

/** Get the OS Preference for light/dark mode */
function getOSDarkLight(): boolean {
	const osDarkLight = window.matchMedia('(prefers-color-scheme: light)').matches;
	return osDarkLight;
}

/** Adjust the final dark light mode from combined user and OS preferences */
export function adjustFinalDarkLight(): boolean {
	let finalDarkLight;
	// console.log('\ngetFinalDarkLight() userDarkLight:' + userDarkLight);
	switch (get(userDarkLight)) {
		case TrinaryValue.neither:
			finalDarkLight = getOSDarkLight();
			// console.log('getFinalDarkLight() finalDarkLight os:' + finalDarkLight);
			break;
		case TrinaryValue.true:
			finalDarkLight = true;
			// console.log('getFinalDarkLight() finalDarkLight light:' + finalDarkLight);
			break;
		default:
			finalDarkLight = false;
			// console.log('getFinalDarkLight() finalDarkLight dark:' + finalDarkLight);
			break;
	}
	setCurrentDarkLight(finalDarkLight);
	return finalDarkLight;
}

// Set ---
/** Set the User Preference for light/dark mode */
export function setUserDarkLight(value: TrinaryValue): void {
	userDarkLight.set(value);
}

/**
 * toggle false -> true -> neither -> false ...
 */
export function toggleForwardUserDarkLight(): TrinaryValue {
	userDarkLight.set(Math.abs((get(userDarkLight) + 1) % 3));
	return get(userDarkLight);
}
/**
 * toggleBack false -> neither -> true -> false ...
 */
export function toggleBackUserDarkLight(): TrinaryValue {
	userDarkLight.set(Math.abs((get(userDarkLight) + 2) % 3));
	return get(userDarkLight);
}

/** Set the the current light/dark mode */
function setCurrentDarkLight(value: boolean) {
	const elemHtmlClasses = document.documentElement.classList;
	const classDark = `dark`;
	value === true ? elemHtmlClasses.remove(classDark) : elemHtmlClasses.add(classDark);
	currentDarklight.set(value);
}

export function initializeDarkLight(_node: HTMLElement) {
	adjustFinalDarkLight();
}
