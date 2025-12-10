<script lang="ts">
	import Darklight from "$lib/utilities/DarkLight/DarkLight.svelte";

	import iconTailwind from "$lib/images/tailwindcss.svg";
	import githubDark from "$lib/images/github-mark-white.svg";
	import iconSvelte from "$lib/images/svelte-logo.svg";
	import iconX from "$lib/images/x.svg";

	import { onMount } from "svelte";
	import Settings from "./Settings.svelte";
	import Typist from "./Typist.svelte";
	import Keyboard from "./Keyboard.svelte";
	import { IDBStore } from "$lib/store/IDBStore.svelte";
	import { LessonsXG } from "$lib/store/LessonsXG.svelte";
	import { LessonXG } from "$lib/store/LessonXG.svelte";
	import { SettingsXG } from "$lib/store/SettingsXG.svelte";

	let darkLight: Darklight;

	let idbLessons = $state<LessonsXG>(new LessonsXG());
	let idbSettings = $state<SettingsXG>(new SettingsXG());
	let idbCustomWords = $state<string[]>([]);
	let idbCodeWords = $state<boolean[]>([false, false, false, false, false, false, false, false, false]);

	let currentLesson = $state(new LessonXG());

	let idbStore = new IDBStore();
	let values = await idbStore.getValues(
		["idbLessons", "idbSettings", "customWords", "idbCodeWords"],
		[
			new LessonsXG(),
			new SettingsXG(),
			[] as string[],
			[false, false, false, false, false, false, false, false, false] as boolean[],
		],
		false
	);
	idbLessons = new LessonsXG(values[0] as LessonsXG);
	idbSettings = new SettingsXG(values[1] as SettingsXG);
	let idbLessonsLoadState = idbStore.getLoadState("idbLessons");
	let idbSettingsLoadState = idbStore.getLoadState("idbSettings");
	let idbCustomWordsLoadState = idbStore.getLoadState("customWords");
	let idbCodeWordsLoadState = idbStore.getLoadState("idbCodeWords");

	onMount(() => {
		// idbStore.clearDatabase(); // For testing purposes only, clear the database on each load

		// Respond to OS color scheme changes
		let prefersDarkSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
		function handleColorSchemeChange() {
			if (darkLight !== null) darkLight.adjustFinalDarkLight();
		}
		prefersDarkSchemeQuery.addEventListener("change", handleColorSchemeChange);

		return () => {
			prefersDarkSchemeQuery.removeEventListener("change", handleColorSchemeChange);
		};
	});
</script>

<div class="flex h-full w-full flex-col overflow-y-auto">
	<div class="flex items-start justify-between">
		<div class="object-left p-6">
			<Darklight bind:this={darkLight}>
				<!-- 🌚🌑 🌓 🌔🌜🌕🌛☀️🌞 -->
				{#snippet dark()}
					<button class="btn-icon"><h1 style="font-size: 3em">🌑</h1></button>
				{/snippet}
				{#snippet os()}
					<button class="btn-icon"><h1 style="font-size: 3em">🌓</h1></button>
				{/snippet}
				{#snippet light()}
					<button class="btn-icon"><h1 style="font-size: 3em">☀️</h1></button>
				{/snippet}
			</Darklight>
		</div>
		<div class="object-center">
			<h1
				style="font-size: 3em"
				class="dark:from-white-300 bg-linear-to-br from-yellow-300 to-red-800 box-decoration-clone bg-clip-text text-transparent dark:to-red-800"
			>
				Xgrams
			</h1>
		</div>
		<div class="object-right">
			<Settings
				bind:idbLessons
				bind:currentLesson
				bind:idbSettings
				bind:idbCustomWords
				bind:idbCodeWords
				{idbLessonsLoadState}
				{idbSettingsLoadState}
				{idbCustomWordsLoadState}
				{idbCodeWordsLoadState}
			></Settings>
		</div>
	</div>
	<Typist bind:idbLessons bind:currentLesson bind:idbSettings></Typist>
	<Keyboard bind:idbSettings {idbSettingsLoadState}></Keyboard>

	<div class="flex items-center justify-center gap-8 p-4">
		<a
			href="https://github.com/dirk-bester/xgrams"
			target="_blank"
			rel="noreferrer"
			aria-label="GitHub"
			id="github-link"
		>
			<img width="40" height="40" src={githubDark} alt="GitHub" />
		</a>
		<a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X" id="x-link">
			<img width="40" height="40" src={iconX} alt="X" />
		</a>
		<a href="https://kit.svelte.dev">
			<img width="40" height="40" src={iconSvelte} alt="SvelteKit" />
		</a>
		<a
			href="https://tailwindcss.com/"
			target="_blank"
			rel="noreferrer"
			aria-label="Tailwind CSS"
			id="tailwind-link"
		>
			<img width="40" height="40" src={iconTailwind} alt="Tailwind CSS" />
		</a>
		<a
			href="https://www.skeleton.dev/"
			target="_blank"
			rel="noreferrer"
			aria-label="Skeleton UI"
			id="skeletonui-link"
		>
			<svg class="fill-token" width="40px" height="40px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
				<g fill-rule="evenodd">
					<path
						d="M17.355 10.21c5.07 0 9.398 1.736 12.495 4.588l.057-.017c.388-.12.72-.244.994-.37.879-.406 2.032-1.236 3.46-2.492-.232 2.188-.48 3.794-.747 4.818a19.306 19.306 0 0 1-.662 1.994 15.855 15.855 0 0 1 1.707 4.672c1.221 6.057-.871 8.735-5.727 10.23.037.18.065.373.086.58.173 1.772-.733 4.633-1.82 4.633-.716 0-1.181-.986-1.68-2.426-.155 1.666-.923 3.58-1.813 3.58-.958 0-1.467-1.767-2.21-4.022C21.118 37.75 20.55 40 19.546 40c-1.02 0-.46-3.177-2.181-4.523-8.721.47-16.057-2.718-16.057-11.916 0-1.693.405-3.346 1.147-4.88-.132-.257-.255-.51-.37-.761C1.505 16.656.81 14.744 0 12.183c2.074 1.53 3.665 2.442 4.772 2.735.11.029.226.055.346.077 2.906-2.879 7.248-4.785 12.237-4.785ZM15.32 22.62c-2.947 0-5.336 2.294-5.336 5.124 0 2.83 2.389 5.124 5.336 5.124 2.946 0 5.335-2.294 5.335-5.124 0-2.76-2.27-5.009-5.115-5.12Zm7.573 6.4c-.891 0-1.362 1.883-1.362 2.727 0 .66.224 1.024.589 1.09.885.082.615-1.194 1.056-1.194.47 0 1.02 1.305 1.48 1.128.547-.322.338-1.024.149-1.578-.665-1.394-1.02-2.173-1.912-2.173Zm5.801-6.7c-2.03 0-3.676 2.014-3.676 4.5 0 2.485 1.646 4.5 3.676 4.5 2.03 0 3.677-2.015 3.677-4.5 0-2.486-1.646-4.5-3.677-4.5ZM16 25a3 3 0 1 1-.5 5.958 3 3 0 0 0 0-5.917c.162-.027.33-.041.5-.041Zm12.5-1c1.38 0 2.5 1.343 2.5 3s-1.12 3-2.5 3c-.171 0-.339-.02-.5-.06 1.141-.278 2-1.489 2-2.94 0-1.451-.859-2.662-2-2.94.161-.04.329-.06.5-.06Zm.284-18.586.324.207c.146.093.19.288.096.434l-2.39 3.655a.314.314 0 0 1-.433.093l-.324-.207a.314.314 0 0 1-.095-.434l2.39-3.655a.314.314 0 0 1 .432-.093Zm-23.177.554 1.94 2.75c.1.141.066.337-.076.437l-.319.22a.314.314 0 0 1-.435-.077l-1.94-2.749a.314.314 0 0 1 .076-.438l.318-.22a.314.314 0 0 1 .436.077ZM18.183 0l.58 4.826 2.146-2.385.06 5.942-.426-.094c-1.242-.273-2.369-.41-3.379-.41a9.635 9.635 0 0 0-2.821.399l-.474.143.382-7.432 1.967 3.675L18.183 0Z"
					></path>
				</g>
			</svg>
		</a>
	</div>
</div>
