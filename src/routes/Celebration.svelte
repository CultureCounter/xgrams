<script lang="ts" context="module">
	let characters = ['🥳', '🪅', '🎉', '🎊', '✨', '🎭', '🤩', '🫧', '🥳', '🥰', '❤️‍🔥', '🎁', '💫', '🌟', '🐣', '🌟', '🌜', '🌛', '🌝', '⚡'];
	export let duration = 10000;
	export let fadeIn = 3000;
	export let fadeOut = 3000;
	export let confetti = new Array(97)
		.fill('🥳')
		.map((_, i) => {
			return {
				character: characters[i % characters.length],
				x: Math.random() * 100,
				y: -20 - Math.random() * 100,
				r: 0.1 + Math.random() * 1.5,
				d: 'emoj' + i,
				o: 0,
				e: null as any,
			};
		})
		.sort((a, b) => a.r - b.r);

	function preCelebration() {
		confetti = confetti.map((emoji) => {
			var d = document.getElementById(emoji.d);
			emoji.e = d;
			return emoji;
		});
	}

	let janitorial = false;
	let frame: number;
	export function startCelebration() {
		if (!janitorial) {
			preCelebration();
			janitorial = true;
		}
		let done = false;
		let start: DOMHighResTimeStamp, previousTimeStamp: DOMHighResTimeStamp;
		function loop(timestamp: DOMHighResTimeStamp) {
			if (start === undefined) {
				start = timestamp;
			}
			let elapsed = timestamp - start;
			let delta = 0;
			if (elapsed < fadeIn) {
				delta = 0.005;
			} else if (elapsed > duration - fadeOut) {
				delta = -0.01;
			} else {
				delta = 0.0;
			}

			if (previousTimeStamp !== timestamp) {
				confetti = confetti.map((emoji) => {
					emoji.y += 0.4 * emoji.r;
					if (emoji.y > 120) {
						emoji.x = Math.random() * 100;
						emoji.y = -20;
						emoji.e.style.left = emoji.x + '%';
					}
					emoji.e.style.top = emoji.y + '%';
					if (emoji.o < 1) {
						if (delta > 0.00001) emoji.o = Math.min(emoji.o + delta, 1);
						else if (delta < -0.00001) emoji.o = Math.max(emoji.o + delta, 0);
						else emoji.o = Math.min(emoji.o + delta, 1);
						emoji.e.style.opacity = emoji.o;
					}
					return emoji;
				});
			}
			if (elapsed < duration) {
				// Stop the animation after 2 seconds
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

	export function endCelebration() {
		let done = true;
		confetti = confetti.map((emoji) => {
			if (emoji.o > 0) {
				emoji.o = Math.max(emoji.o - 0.01, 0);
				emoji.e.style.opacity = emoji.o;
				done = false;
			}
			return emoji;
		});
		if (done) {
			cancelAnimationFrame(frame);
		} else if (!done) {
			frame = window.requestAnimationFrame(endCelebration);
		}
	}
</script>

<div>
	<slot>
		{#each confetti as c}
			<span id={c.d} style="left: {c.x}%; top: {c.y}%; transform: scale({c.r})">{c.character}</span>
		{/each}
	</slot>
</div>

<style>
	span {
		position: absolute;
		font-size: 5vw;
		user-select: none;
		pointer-events: none; /* invisible to clicks */
	}
</style>
