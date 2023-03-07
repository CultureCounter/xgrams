import { get, writable } from 'svelte/store';

// Elapsed time in milliseconds
export let elapsedTime = writable<number>(0);

// Start time in milliseconds
let startTime = 0;

// Elapsed time in milliseconds at startTime
let baseTime = 0;

// The timer
let timer: NodeJS.Timer | null = null;

export function resetStopWatch(): void {
	startTime = Date.now();
	elapsedTime.set(0);
	baseTime = 0;

	if (timer != null) {
		clearInterval(timer);
	}
	timer = setInterval(() => {
		let currentTime = Date.now();
		elapsedTime.set(baseTime + currentTime - startTime);
	}, 100);
}
export function pauseStopWatch() {
	let currentTime = Date.now();
	elapsedTime.set(baseTime + currentTime - startTime);
	if (timer != null) {
		clearInterval(timer);
		timer = null;
	}
}
export function resumeStopWatch() {
	startTime = Date.now();
	baseTime = get(elapsedTime);
	timer = setInterval(() => {
		let currentTime = Date.now();
		elapsedTime.set(baseTime + currentTime - startTime);
	}, 100);
}
export function toggleStopWatch() {
	if (timer != null) {
		pauseStopWatch();
	} else {
		resumeStopWatch();
	}
}
export function destroyStopWatch() {
	if (timer != null) {
		clearInterval(timer);
		timer = null;
	}
}
