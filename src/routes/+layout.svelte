<script lang="ts">
	let { children } = $props();
	import "../app.css";
	// TODO: Re-enable xgtheme
	// import '../xgtheme.postcss';
	import favicon from "../../static/favicon.png";
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
