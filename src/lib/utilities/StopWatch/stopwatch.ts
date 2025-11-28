import { get, writable } from "svelte/store";

/** Elapsed time in milliseconds */
export const elapsedTime = writable<number>(0);

/** Added to Elapsed time on endLap(), milliseconds */
export const lapTime = writable<number>(0);

/** Start time in milliseconds */
let startTime = 0;

/** Elapsed time in milliseconds at startTime */
let baseTime = 0;

// The timer
let timer: NodeJS.Timeout | null = null;

/**
 * Reset timers and stop
 */
export function resetStopWatch(): void {
	elapsedTime.set(0);
	baseTime = 0;

	resetLap();
}

/**
 * Activate timers and increase elapsedTime
 */
export function startStopWatch() {
	if (timer == null) {
		startTime = Date.now();
		baseTime = get(elapsedTime);
		timer = setInterval(() => {
			const currentTime = Date.now();
			elapsedTime.set(baseTime + currentTime - startTime);
		}, 100);
	}
}

/**
 * Reset timers and stop
 */
export function stopStopWatch() {
	const currentTime = Date.now();
	elapsedTime.set(baseTime + currentTime - startTime);
	if (timer != null) {
		clearInterval(timer);
		timer = null;
	}
}

/**
 * Reset lap timers and stop
 */
export function resetLap(): void {
	// console.log('resetLap  elapsedTime:' + get(elapsedTime));

	lapTime.set(0);
	baseTime = 0;

	if (timer != null) {
		clearInterval(timer);
		timer = null;
	}
}

/**
 * Activate timers and increase lapTime
 */
export function startLap() {
	// console.log('startLap elapsedTime:' + get(elapsedTime));

	if (timer == null) {
		// console.log('startLap starting');
		startTime = Date.now();
		baseTime = get(lapTime);
		timer = setInterval(() => {
			const currentTime = Date.now();
			lapTime.set(baseTime + currentTime - startTime);
		}, 100);
	}
}

/**
 * Clear timers and end lap, increase elapsedTime
 */
export function endLap() {
	if (timer != null) {
		const currentTime = Date.now();
		lapTime.set(baseTime + currentTime - startTime);
		// console.log('endLap lapTime:' + (baseTime + currentTime - startTime));
		elapsedTime.set(get(elapsedTime) + get(lapTime));
		// console.log('endLap elapsedTime:' + get(elapsedTime));
		resetLap();
	}
}

/**
 * Toggle between start and stop
 * TODO handle lap toggle
 */
export function toggleStopWatch() {
	if (timer != null) {
		stopStopWatch();
	} else {
		startStopWatch();
	}
}

/**
 * Clear timer if needed
 */
export function destroyStopWatch() {
	if (timer != null) {
		clearInterval(timer);
		timer = null;
	}
}
