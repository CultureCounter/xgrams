<script module lang="ts">
	import { settingsState } from "$lib/store/SettingsState.svelte";

	let rightLetterSound: HTMLAudioElement = null as unknown as HTMLAudioElement;
	let wrongLetterSound: HTMLAudioElement = null as unknown as HTMLAudioElement;
	let failedGoalsSound: HTMLAudioElement = null as unknown as HTMLAudioElement;
	let passedGoalsSound: HTMLAudioElement = null as unknown as HTMLAudioElement;
	let lessonsDoneSound: HTMLAudioElement = null as unknown as HTMLAudioElement;

	let currentPlayingSound: HTMLAudioElement = null as unknown as HTMLAudioElement;

	let theSounds: HTMLAudioElement[] = [];

	export const Sounds = {
		rightLetter: 0,
		wrongLetter: 1,
		failedGoals: 2,
		passedGoals: 3,
		lessonsDone: 4,
	} as const;

	export type Sounds = (typeof Sounds)[keyof typeof Sounds];

	function stopPlayingSound(): void {
		// Sounds at the end of each line/lesson
		// dont need to be played from the beginning.
		if (
			currentPlayingSound == passedGoalsSound
			|| currentPlayingSound == failedGoalsSound
			|| currentPlayingSound == lessonsDoneSound
		) {
			return;
		}

		// Reset any playing sound to handle fast typing,
		// Otherwise, the sound will be intermittent and
		// not in sync with the key presses.
		if (currentPlayingSound) {
			currentPlayingSound.currentTime = 0;
		}
	}

	export function playSound(sound: Sounds): void {
		if (theSounds.length === 0) {
			theSounds = [rightLetterSound, wrongLetterSound, failedGoalsSound, passedGoalsSound, lessonsDoneSound];
		}
		stopPlayingSound();
		let theSound = theSounds[sound];
		theSound.play();
		currentPlayingSound = theSound;
	}
</script>

<audio src="/click.mp3" bind:volume={settingsState.volume} bind:this={rightLetterSound}></audio>
<audio src="/clack.mp3" bind:this={wrongLetterSound}></audio>
<audio src="/failed.mp3" bind:this={failedGoalsSound}></audio>
<audio src="/ding.wav" bind:this={passedGoalsSound}></audio>
<audio src="/tng_transporter9.mp3" bind:this={lessonsDoneSound}></audio>
