<script lang="ts">
	import discord from '$lib/images/discord-mark-blue.svg';
	import githubDark from '$lib/images/github-mark-white.svg';
	import github from '$lib/images/github-mark.svg';
	import svelte from '$lib/images/svelte-logo.svg';
	import twitter from '$lib/images/twitter-circle-blue.svg';
	import { initializeDarkLight } from '$lib/utilities/DarkLight/darklight';
	import Darklight from '$lib/utilities/DarkLight/DarkLight.svelte';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import { AppBar, AppShell, Drawer, drawerStore, storePopup, type DrawerSettings } from '@skeletonlabs/skeleton';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';
	import '../xgtheme.postcss';
	import Settings from './Settings.svelte';

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	function drawerOpen(): void {
		const settings: DrawerSettings = {
			id: 'settings',
			position: 'bottom',
			// bgDrawer: 'bg-purple-900 text-white',
			bgBackdrop: 'bg-gradient-to-tr from-indigo-500/50 via-purple-500/50 to-pink-500/50',
			width: 'w-[100%] md:w-[100%]',
			padding: 'p-4',
			rounded: 'rounded-xl',
		};
		drawerStore.open(settings);
	}

	function drawerClose(): void {
		drawerStore.close();
	}
</script>

<svelte:head />
<div use:initializeDarkLight />

<Drawer top>
	{#if $drawerStore.id === 'settings'}
		<div>
			<Settings />
		</div>
	{/if}
</Drawer>

<div class="w-full h-full flex-col overflow-y-auto">
	<div class="flex justify-between p-4">
		<div class="object-left">
			<Darklight>
				<!-- 🌚🌑 🌓 🌔🌕🌛🌞 -->
				<button slot="dark" class="btn-icon"><h1>🌑</h1></button>
				<button slot="os" class="btn-icon"><h1>🌓</h1></button>
				<button slot="light" class="btn-icon"><h1>🌕</h1></button>
			</Darklight>
		</div>
		<div class="object-center"><h1><span class="gradient-heading font-kobenhavn">Xgrams</span></h1></div>
		<div class="object-right"><button class="btn-icon" on:click={drawerOpen}><h1>🧜‍♀️</h1></button></div>
	</div>

	<slot />

	<div class="flex justify-center items-center gap-8 p-4">
		<a href="https://kit.svelte.dev">
			<img width="40" height="40" src={svelte} alt="SvelteKit" />
		</a>
		<a href="https://www.skeleton.dev/" target="_blank" rel="noreferrer">
			<svg class="fill-token" width="40px" height="40px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
				<g fill-rule="evenodd">
					<path
						d="M17.355 10.21c5.07 0 9.398 1.736 12.495 4.588l.057-.017c.388-.12.72-.244.994-.37.879-.406 2.032-1.236 3.46-2.492-.232 2.188-.48 3.794-.747 4.818a19.306 19.306 0 0 1-.662 1.994 15.855 15.855 0 0 1 1.707 4.672c1.221 6.057-.871 8.735-5.727 10.23.037.18.065.373.086.58.173 1.772-.733 4.633-1.82 4.633-.716 0-1.181-.986-1.68-2.426-.155 1.666-.923 3.58-1.813 3.58-.958 0-1.467-1.767-2.21-4.022C21.118 37.75 20.55 40 19.546 40c-1.02 0-.46-3.177-2.181-4.523-8.721.47-16.057-2.718-16.057-11.916 0-1.693.405-3.346 1.147-4.88-.132-.257-.255-.51-.37-.761C1.505 16.656.81 14.744 0 12.183c2.074 1.53 3.665 2.442 4.772 2.735.11.029.226.055.346.077 2.906-2.879 7.248-4.785 12.237-4.785ZM15.32 22.62c-2.947 0-5.336 2.294-5.336 5.124 0 2.83 2.389 5.124 5.336 5.124 2.946 0 5.335-2.294 5.335-5.124 0-2.76-2.27-5.009-5.115-5.12Zm7.573 6.4c-.891 0-1.362 1.883-1.362 2.727 0 .66.224 1.024.589 1.09.885.082.615-1.194 1.056-1.194.47 0 1.02 1.305 1.48 1.128.547-.322.338-1.024.149-1.578-.665-1.394-1.02-2.173-1.912-2.173Zm5.801-6.7c-2.03 0-3.676 2.014-3.676 4.5 0 2.485 1.646 4.5 3.676 4.5 2.03 0 3.677-2.015 3.677-4.5 0-2.486-1.646-4.5-3.677-4.5ZM16 25a3 3 0 1 1-.5 5.958 3 3 0 0 0 0-5.917c.162-.027.33-.041.5-.041Zm12.5-1c1.38 0 2.5 1.343 2.5 3s-1.12 3-2.5 3c-.171 0-.339-.02-.5-.06 1.141-.278 2-1.489 2-2.94 0-1.451-.859-2.662-2-2.94.161-.04.329-.06.5-.06Zm.284-18.586.324.207c.146.093.19.288.096.434l-2.39 3.655a.314.314 0 0 1-.433.093l-.324-.207a.314.314 0 0 1-.095-.434l2.39-3.655a.314.314 0 0 1 .432-.093Zm-23.177.554 1.94 2.75c.1.141.066.337-.076.437l-.319.22a.314.314 0 0 1-.435-.077l-1.94-2.749a.314.314 0 0 1 .076-.438l.318-.22a.314.314 0 0 1 .436.077ZM18.183 0l.58 4.826 2.146-2.385.06 5.942-.426-.094c-1.242-.273-2.369-.41-3.379-.41a9.635 9.635 0 0 0-2.821.399l-.474.143.382-7.432 1.967 3.675L18.183 0Z" />
				</g>
			</svg>
		</a>
		<a href="https://discord.com/channels/1003691521280856084" target="_blank" rel="noreferrer">
			<img width="40" height="40" src={discord} alt="Discord" />
		</a>
		<a href="https://twitter.com/SkeletonUI" target="_blank" rel="noreferrer">
			<img width="40" height="40" src={twitter} alt="Discord" />
		</a>
		<a href="https://github.com/dirk-bester/xgrams" target="_blank" rel="noreferrer">
			<img width="40" height="40" src={githubDark} alt="Discord" />
		</a>
	</div>
</div>
