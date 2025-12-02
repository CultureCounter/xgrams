<script lang="ts">
	import { idbData } from "$lib/store/data";
	import { CodeNames } from "$lib/store/code";
	import { Switch } from "@skeletonlabs/skeleton-svelte";

	const onCheckedChange = (event: { checked: boolean; i: number }) => {
		var checked = !event.checked;
		idbData.languages[event.i] = checked;
		console.log(`Language ${CodeNames[event.i]} set to ${checked}`);
	};
</script>

{#each CodeNames as name, i (name)}
	<Switch
		{name}
		checked={idbData.languages[i]}
		onchange={() => {
			onCheckedChange({ checked: idbData.languages[i], i });
		}}
	>
		<Switch.Control class="preset-filled-secondary-50-950 data-[state=checked]:preset-filled-secondary-500">
			<Switch.Thumb></Switch.Thumb>
		</Switch.Control>
		<Switch.Label>{name}</Switch.Label>

		<Switch.HiddenInput />
	</Switch>
{/each}
