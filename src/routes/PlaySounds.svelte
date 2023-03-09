<script context="module" lang="ts">
	let rightLetterSound: HTMLAudioElement = null as unknown as HTMLAudioElement;
	let wrongLetterSound: HTMLAudioElement = null as unknown as HTMLAudioElement;
	let failedGoalsSound: HTMLAudioElement = null as unknown as HTMLAudioElement;
	let passedGoalsSound: HTMLAudioElement = null as unknown as HTMLAudioElement;
	let lessonsDoneSound: HTMLAudioElement = null as unknown as HTMLAudioElement;

	let currentPlayingSound: HTMLAudioElement = null as unknown as HTMLAudioElement;

	let TheSounds: HTMLAudioElement[] = [];

	export enum Sounds {
		'rightLetter' = 0,
		'wrongLetter' = 1,
		'failedGoals' = 2,
		'passedGoals' = 3,
		'lessonsDone' = 4,
	}

	function stopPlayingSound(): void {
		// Sounds at the end of each phrase/lesson
		// dont need to be played from the beginning.
		if (currentPlayingSound == passedGoalsSound || currentPlayingSound == failedGoalsSound || currentPlayingSound == lessonsDoneSound) {
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
		if (TheSounds.length == 0) {
			TheSounds = [rightLetterSound, wrongLetterSound, failedGoalsSound, passedGoalsSound, lessonsDoneSound];
			// console.log(TheSounds);
		}
		stopPlayingSound();
		let theSound = TheSounds[sound];
		theSound.play();
		currentPlayingSound = theSound;
	}
</script>

<audio src="/click.mp3" bind:this={rightLetterSound} />
<audio src="/clack.mp3" bind:this={wrongLetterSound} />
<audio src="/failed.mp3" bind:this={failedGoalsSound} />
<audio src="/ding.wav" bind:this={passedGoalsSound} />
<audio src="/tng_transporter9.mp3" bind:this={lessonsDoneSound} />
