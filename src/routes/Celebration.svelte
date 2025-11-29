<script module lang="ts">
	import { browser } from '$app/environment';
	// import { onMount, onDestroy } from 'svelte';
	// import Worker from './CelebrationWorker.js?worker';
	export let duration = 8000;
	// export let duration = 10000;
	export let fadeIn = 3000;
	export let fadeOut = 4000;

	let emojii = [
		'🥳',
		'🪅',
		'🎉',
		'🎊',
		'✨',
		'🎭',
		'🤩',
		'🫧',
		'🥳',
		'🥰',
		'❤️‍🔥',
		'🎁',
		'💫',
		'🌟',
		'🐣',
		'🌟',
		'🌜',
		'🌛',
		'🌝',
		'⚡',
	];

	class Confetti {
		emoji: string = $state('⚡');
		x: number = $state(Math.random() * 100);
		y: number = $state(-20 - Math.random() * 100);
		r: number = 0.1 + Math.random();
		d: string = '';
		opacity: number = $state(0.0);
		constructor(emoji: string, x: number, y: number, r: number, d: string, opacity: number) {
			this.emoji = emoji;
			this.x = x;
			this.y = y;
			this.r = r;
			this.d = d;
			this.opacity = opacity;
		}
	}

	const confettiiMaxCount = 80;
	let confettii = $state(
		Array.from({ length: confettiiMaxCount }, (_, index) => {
			return new Confetti(
				emojii[index % emojii.length],
				Math.random() * 100,
				-20 - Math.random() * 100,
				0.1 + Math.random(),
				'',
				0.0
			);
		})
	);
	const confettiMax = confettii.length;

	/**
	 * Prepare for celebration by linking DOM elements.
	 */
	function preCelebration(): void {
		// console.log('preCelebration');
		for (let i = 0; i < confettiMax; i++) {
			var confetti = confettii[i];
			confetti.d = 'emoj' + i;
			confetti.emoji = emojii[i % emojii.length];
		}
	}
	if (browser) {
		preCelebration();
	}

	let janitorial: boolean = true;
	let frame: number;
	/**
	 * Fade in and animate the celebration.
	 */
	export function startCelebration(): void {
		console.log('\nstartCelebration');
		if (janitorial) {
			janitorial = false;
		}
		let done = false;
		let start: DOMHighResTimeStamp, previousTimeStamp: DOMHighResTimeStamp;
		function loop(timestamp: DOMHighResTimeStamp): void {
			if (start === undefined) {
				start = timestamp;
			}
			let elapsed = timestamp - start;
			let deltaOpacity = 0;
			if (elapsed < fadeIn) {
				deltaOpacity = 0.005;
			} else if (elapsed > duration - fadeOut) {
				deltaOpacity = -0.005;
			} else {
				deltaOpacity = 0.0;
			}

			if (previousTimeStamp !== timestamp) {
				for (let i = 0; i < confettiMax; i++) {
					var emoji = confettii[i];
					emoji.y += 0.4 * emoji.r;
					if (emoji.y > 120) {
						emoji.x = Math.random() * 100;
						emoji.y = -20;
					}
					if (emoji.opacity < 1) {
						if (deltaOpacity > 0.00001) emoji.opacity = Math.min(emoji.opacity + deltaOpacity, 1);
						else if (deltaOpacity < -0.00001) emoji.opacity = Math.max(emoji.opacity + deltaOpacity, 0);
						else emoji.opacity = Math.min(emoji.opacity + deltaOpacity, 1);
					}
				}
			}
			if (elapsed < duration) {
				previousTimeStamp = timestamp;
				if (!done) {
					frame = window.requestAnimationFrame(loop);
				}
			} else {
				done = true;
				endCelebration();
			}
		}
		window.requestAnimationFrame(loop);
	}

	/**
	 * Fade out opacity and end the celebration.
	 */
	export function endCelebration() {
		let done = true;
		for (let i = 0; i < confettiMax; i++) {
			var emoji = confettii[i];
			if (emoji.opacity > 0) {
				emoji.opacity = 0;
				done = false;
			}
		}
		if (done) {
			cancelAnimationFrame(frame);
		}
	}

	// TODO: Use Worker to animate confetti in background
	// let result;
	// let worker: Worker;
	// if (browser) {
	// 	worker = new Worker();
	// 	// ... use the worker
	// 	worker.onmessage = (event) => {
	// 		result = event.data;
	// 		console.log('Worker said: ', result);
	// 	};
	// }

	// onMount(() => {
	// 	console.log('onMount Celebration');
	// });
	// onDestroy(() => {
	// 	if (worker) {
	// 		worker.terminate();
	// 	}
	// });

	// export function unleashWorker() {
	// 	console.log('unleashWorker');
	// 	worker.postMessage(6); // Send data to our heroic worker
	// }
</script>

<div>
	{#each confettii as c (c.d)}
		<span id={c.d} style:opacity={c.opacity} style:left="{c.x}%" style:top="{c.y}%" style:transform="scale({c.r})"
			>{c.emoji}</span
		>
	{/each}
</div>

<style>
	span {
		position: absolute;
		font-size: 5vw;
		user-select: none;
		pointer-events: none; /* invisible to clicks */
	}
</style>
