<script lang="ts">
	let { children } = $props();
	import "../app.css";
	import favicon from "$lib/images/favicon.png";
</script>

<svelte:head>
	<title>Xgrams typing tutor</title>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
