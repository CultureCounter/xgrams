<script lang="ts">
	import { onMount } from "svelte";
	// DarkLight Service
	import { TrinaryValue } from "./trinary";
	import { LocalStore } from "$lib/LocalStore.svelte";
	import { LoadState } from "$lib/store/loadState.svelte";

	let { dark, light, os } = $props();

	let userDarkLight = $state(TrinaryValue.neither);
	let userDarkLightLoadState = $state(new LoadState("userDarkLight", false));
	let userDarkLightStore = new LocalStore<TrinaryValue>(
		"userDarkLight",
		TrinaryValue.neither,
		userDarkLightLoadState
	);
	userDarkLight = await userDarkLightStore.getValue();

	/** Get the OS Preference for light/dark mode */
	function getOSDarkLight(): boolean {
		const osDarkLight = window.matchMedia("(prefers-color-scheme: light)").matches;
		return osDarkLight;
	}

	/**
	 * toggleBack false -> neither -> true -> false ...
	 */
	function toggleBackUserDarkLight(): TrinaryValue {
		userDarkLight = Math.abs((userDarkLight + 2) % 3);
		return userDarkLight;
	}

	/** Adjust the final dark light mode from combined user and OS preferences */
	export function adjustFinalDarkLight() {
		let finalDarkLight;

		if (!("userDarkLight" in localStorage)) {
			userDarkLight = TrinaryValue.neither;
		}
		switch (userDarkLight) {
			case TrinaryValue.neither:
				// The user respects the OS preference
				finalDarkLight = getOSDarkLight();
				if (finalDarkLight) {
					document.documentElement.classList.remove("dark");
				} else {
					document.documentElement.classList.add("dark");
				}
				break;
			case TrinaryValue.true:
				finalDarkLight = true;
				// Whenever the user explicitly chooses dark mode
				console.log("getFinalDarkLight() finalDarkLight light:" + finalDarkLight);
				document.documentElement.classList.toggle("dark", true);
				break;
			default:
				finalDarkLight = false;
				// Whenever the user explicitly chooses light mode
				console.log("getFinalDarkLight() finalDarkLight dark:" + finalDarkLight);
				document.documentElement.classList.toggle("dark", false);
				break;
		}
	}

	onMount(async () => {
		adjustFinalDarkLight();
	});

	function onToggleHandler(): void {
		userDarkLight = toggleBackUserDarkLight();
		adjustFinalDarkLight();
	}

	// A11y Input Handlers
	type OnKeyDownEvent = KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement };
	function onKeyDown(event: OnKeyDownEvent): void {
		// Enter/Space triggers selecton event
		if (["Enter", "Space"].includes(event.code)) {
			event.preventDefault();
			event.currentTarget.click();
		}
	}

	// TODO what is this even
	// Reactive
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const cTransition = `transition-all duration-[200ms]`;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const cTrack = "cursor-pointer";
	let classesTrack = $derived("{cTrack} {cTransition} {width} {height}");
</script>

<div
	class={classesTrack ?? ""}
	onclick={onToggleHandler}
	onkeydown={onKeyDown}
	role="button"
	aria-label="Dark Mode Button"
	title="Toggle {userDarkLight == 2 ? 'Use OS'
	: userDarkLight == 1 ? 'Light'
	: 'Dark'} Mode"
	tabindex="0"
>
	{#if userDarkLight == TrinaryValue.false}
		{@render light()}
	{:else if userDarkLight == 1}
		{@render dark()}
	{:else if userDarkLight == 2}
		{@render os()}
	{/if}
</div>
