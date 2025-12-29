<script lang="ts">
	import { CodeNames, CodeNamesShort } from "$lib/store/code";
	import { Switch } from "@skeletonlabs/skeleton-svelte";

	type Props = {
		idbCodeChoices: boolean[];
		codeChanged: (choice: boolean, i: number) => void;
	};
	let { idbCodeChoices, codeChanged }: Props = $props();

	// svelte-ignore state_referenced_locally
	const codeChanges = $state<boolean[]>(idbCodeChoices);
	const onCheckedChange = (checked: boolean, i: number) => {
		codeChanges[i] = checked;
		codeChanged(checked, i);
	};
</script>

<div class="flex flex-wrap">
	{#each CodeNames as name, i (name)}
		<Switch
			class="flex flex-col w-[10vw]"
			{name}
			label={name}
			checked={codeChanges[i]}
			onCheckedChange={(e) => {
				onCheckedChange(e.checked, i);
			}}
		>
			<Switch.Control class="preset-filled-secondary-50-950 data-[state=checked]:preset-filled-secondary-500">
				<Switch.Thumb></Switch.Thumb>
			</Switch.Control>
			<Switch.Label>
				<span class="hidden xs:inline">{name}</span>
				<span class="xs:hidden">{CodeNamesShort[i]}</span>
			</Switch.Label>

			<Switch.HiddenInput />
		</Switch>
	{/each}
</div>
