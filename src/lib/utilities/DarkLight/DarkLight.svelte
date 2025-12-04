<script lang="ts">
	import { onMount } from "svelte";
	// DarkLight Service
	import { TrinaryValue } from "./trinary";
	import { LocalStorage } from "$lib/LocalStorage.svelte.ts";

	let { dark, light, os } = $props();
	let userDarkLight = $state(new LocalStorage<TrinaryValue>("userDarkLight", TrinaryValue.neither));

	/** Get the OS Preference for light/dark mode */
	function getOSDarkLight(): boolean {
		const osDarkLight = window.matchMedia("(prefers-color-scheme: light)").matches;
		return osDarkLight;
	}

	/**
	 * toggleBack false -> neither -> true -> false ...
	 */
	function toggleBackUserDarkLight(): TrinaryValue {
		userDarkLight.current = Math.abs((userDarkLight.current + 2) % 3);
		return userDarkLight.current;
	}

	/** Adjust the final dark light mode from combined user and OS preferences */
	export function adjustFinalDarkLight(): boolean {
		let finalDarkLight;
		if (!("userDarkLight" in localStorage)) {
			userDarkLight.current = TrinaryValue.neither;
		}
		switch (userDarkLight.current) {
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
		return finalDarkLight;
	}

	onMount(async () => {
		adjustFinalDarkLight();
	});

	function onToggleHandler(): void {
		userDarkLight.current = toggleBackUserDarkLight();
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
	title="Toggle {userDarkLight.current == 2 ? 'Use OS'
	: userDarkLight.current == 1 ? 'Light'
	: 'Dark'} Mode"
	tabindex="0"
>
	{#if userDarkLight.current == TrinaryValue.false}
		{@render light()}
	{:else if userDarkLight.current == 1}
		{@render dark()}
	{:else if userDarkLight.current == 2}
		{@render os()}
	{/if}
</div>
