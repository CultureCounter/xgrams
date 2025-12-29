<script lang="ts">
	import Darklight from "$lib/utilities/DarkLight/DarkLight.svelte";
	import Settings from "./Settings.svelte";
	import Keyboard from "./Keyboard.svelte";
	import Lesson from "./Lesson.svelte";

	import iconGithub from "$lib/images/github-mark-white.svg";
	import iconSkeleton from "$lib/images/skeleton-ui.svg";
	import iconSvelte from "$lib/images/svelte-logo.svg";
	import iconTailwind from "$lib/images/tailwindcss.svg";
	import iconX from "$lib/images/x.svg";

	import { IDBStore } from "$lib/store/IDBStore.svelte";
	import { currentVersion, LessonsDB } from "$lib/store/LessonsDB.svelte";
	import { LessonDB, transferTo } from "$lib/store/LessonDB.svelte";
	import { SettingsDB } from "$lib/store/SettingsDB.svelte";
	import { CodeXG } from "$lib/store/code";
	import { SourceAllIndex, SourceXG } from "$lib/store/SourceDB.svelte";
	import { LoadState } from "$lib/store/LoadState.svelte";
	import { ServerStore } from "$lib/store/ServerStore.svelte";
	import { CodeKeys } from "$lib/store/code";
	import { SourceKeys } from "$lib/store/SourceDB.svelte";
	import { arrayCopyBoolean, arrayCopyString, arrayEqualBoolean, arrayEqualString } from "$lib/utilities/utils";
	import { settingsState } from "$lib/store/SettingsState.svelte";

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	function clearAll() {
		idbStore.clearIDB(); // For testing purposes only, clear the database on each load
		localStorage.clear();
		LoadState.clearDatabase = true;
	}

	// TODO: minimal defaults for server data

	const IDBKeys = ["idbLessons", "idbSettings", "idbCustomWords", "idbCodeChoices", "idbLessonIndex"];
	const AllKeys = [...IDBKeys, ...CodeKeys, ...SourceKeys];

	const isTracing = false;
	// svelte-ignore non_reactive_update
	let idbCodes = new ServerStore<CodeXG>(
		"idbCodes",
		CodeKeys,
		CodeKeys as (keyof CodeXG)[],
		"/api/code",
		new CodeXG(),
		isTracing
	);

	// svelte-ignore non_reactive_update
	let idbSources = new ServerStore<SourceXG>(
		"idbSources",
		SourceKeys,
		SourceKeys as (keyof SourceXG)[],
		"/api/sources",
		new SourceXG(),
		isTracing
	);

	// svelte-ignore non_reactive_update
	let idbLessons = null as unknown as LessonsDB;
	// svelte-ignore non_reactive_update
	let idbSettings = null as unknown as SettingsDB;
	// svelte-ignore non_reactive_update
	let idbCustomWords: string[] = [];
	// svelte-ignore non_reactive_update
	let idbCodeChoices: boolean[] = [];
	// svelte-ignore non_reactive_update
	let idbLessonIndex = SourceAllIndex.bigrams;

	// svelte-ignore non_reactive_update
	let currentLesson = null as unknown as LessonDB;

	let idbStore = new IDBStore();
	let idbLoading = $state(true);
	idbStore
		.getValues(
			IDBKeys,
			[
				new LessonsDB(),
				new SettingsDB(),
				[] as string[],
				[true, false, false, false, false, false, false, false, false] as boolean[],
				SourceAllIndex.bigrams,
			],
			isTracing
		)
		.then((values) => {
			idbLessons = new LessonsDB(values[0] as LessonsDB);
			if (currentVersion > idbLessons.version) {
				console.log("currentVersion > idbLessons.version: " + currentVersion + " > " + idbLessons.version);
				idbStore.cleanIDB(AllKeys, idbLessons.version, currentVersion);
				idbLessons.version = currentVersion;
				idbStore.setValue("idbLessons", idbLessons);
			}
			idbSettings = new SettingsDB(values[1] as SettingsDB);
			if (currentVersion < 4) {
				if (idbSettings.volume > 1) idbSettings.volume = 0.5;
			}
			arrayCopyString(values[2] as string[], idbCustomWords);
			arrayCopyBoolean(values[3] as boolean[], idbCodeChoices);
			idbLessonIndex = (values[4] as SourceAllIndex) || SourceAllIndex.bigrams;
			currentLesson = new LessonDB(idbLessons.sourceLessons[idbLessonIndex]);
			settingsState.update(idbSettings);
			idbLoading = false;
		})
		.catch((error) => {
			console.error("Error loading values from IDB:", error);
			idbLoading = true;
		});

	// svelte-ignore non_reactive_update
	let lesson: Lesson;

	function onLessonChanged(
		settingsDB: SettingsDB,
		newLessonIndex: SourceAllIndex,
		currentLesson: LessonDB,
		lessonsDB: LessonsDB,
		codeChoices?: boolean[],
		customWords?: string[]
	) {
		// Save dirty settings
		onSettingsChanged(settingsDB, idbLessonIndex, currentLesson, lessonsDB, codeChoices, customWords);

		if (currentLesson !== idbLessons.sourceLessons[newLessonIndex]!) {
			transferTo(idbLessons.sourceLessons[newLessonIndex]!, currentLesson);
			idbLessonIndex = newLessonIndex;
			idbStore.setValue("idbLessonIndex", idbLessonIndex);
			lesson?.initializeLesson();
		}
	}

	/**
	 * Update lesson and stores if settings have changed
	 */
	function onSettingsChanged(
		settingsDB: SettingsDB,
		lessonIndex: SourceAllIndex,
		currentLesson: LessonDB,
		lessonsDB: LessonsDB,
		codeChoices?: boolean[],
		customWords?: string[]
	) {
		let needsUpdate = false;
		if (settingsDB.isDirty) {
			idbStore.setValue("idbSettings", settingsDB);
			idbSettings.isDirty = false;
			settingsDB.isDirty = false;
			// No update needed
		}
		if (lessonsDB.isDirty) {
			let target = lessonsDB.sourceLessons[idbLessonIndex]!;
			transferTo(currentLesson, target);
			idbStore.setValue("idbLessons", lessonsDB);
			lessonsDB.isDirty = false;
			currentLesson.isDirty = false;
			needsUpdate = true;
		}
		if (codeChoices) {
			if (!arrayEqualBoolean(codeChoices, idbCodeChoices)) {
				arrayCopyBoolean(codeChoices, idbCodeChoices);
				idbStore.setValue("idbCodeChoices", idbCodeChoices);
				needsUpdate = true;
			}
		}
		if (customWords) {
			if (!arrayEqualString(customWords, idbCustomWords)) {
				idbStore.setValue("idbCustomWords", customWords);
				arrayCopyString(customWords, idbCustomWords);
				needsUpdate = true;
			}
		}
		if (needsUpdate) {
			lesson?.initializeLesson();
		}
	}
</script>

<div class="flex h-full w-full flex-col overflow-y-auto">
	{#if idbLoading || !idbSources.isLoaded() || !idbCodes.isLoaded()}
		<div class="flex h-full w-full items-center justify-center"><h1>Loading...</h1></div>
	{:else}
		<div class="flex items-start justify-between h-24">
			<div class="object-left p-6">
				<Darklight>
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
			<!-- <div class="object-left p-6">
				<button class="btn" onclick={clearAll}>Debug Clears Data</button>
			</div> -->
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
					bind:idbLessonIndex
					bind:currentLesson
					bind:idbLessons
					bind:idbSettings
					{idbCodeChoices}
					{idbCustomWords}
					{onLessonChanged}
					{onSettingsChanged}
				></Settings>
			</div>
		</div>
		<Lesson
			bind:idbLessonIndex
			bind:idbLessons
			bind:currentLesson
			bind:idbSettings
			bind:idbSources
			bind:idbCodes
			bind:idbCodeChoices
			bind:idbCustomWords
			bind:this={lesson}
		></Lesson>
		<Keyboard></Keyboard>
	{/if}
	<div class="flex items-center justify-center gap-8 p-4">
		<a
			href="https://github.com/dirk-bester/xgrams"
			target="_blank"
			rel="noreferrer"
			aria-label="GitHub"
			id="github-link"
		>
			<img width="40" height="40" src={iconGithub} alt="GitHub" />
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
			<img width="40" height="40" src={iconSkeleton} alt="Skeleton UI" />
		</a>
	</div>
</div>
