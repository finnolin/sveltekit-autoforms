<script lang="ts">
	import { type AutoFormState } from '$lib/autoformstate.svelte.js';
	import * as Select from '$lib/components/ui/select/index.ts';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { AutoformsFieldMeta } from '$lib/types.d.js';
	import Header from './element-header.svelte';
	import Footer from './element-footer.svelte';
	type Props = HTMLInputAttributes & {
		field: AutoformsFieldMeta;
		auto_form: AutoFormState<any>;
	};
	let { field, auto_form, ...props }: Props = $props();
	function objectToArray(obj: any) {
		const array = [];
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				array.push({ value: key, label: obj[key] });
			}
		}
		return array;
	}
	const entries = objectToArray(field.entries);
	const trigger_text = $derived(
		field.entries[auto_form.data[field.field_id]] ?? 'Select an option...'
	);
</script>

<Header title={field.label} />

<Select.Root type="single" name={field.field_id} bind:value={auto_form.data[field.field_id]}>
	<Select.Trigger class="w-[180px]">
		{trigger_text}
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.Label>{field.label}</Select.Label>
			{#each entries as entry (entry.value)}
				<Select.Item value={entry.value} label={entry.label}>
					{entry.label}
				</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>
<Footer errors={auto_form.validation[field.field_id].errors} />
