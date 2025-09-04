<script lang="ts">
	import { type AutoFormState } from '@finnolin/sveltekit-autoforms';
	import { type ZodEnum, type ZodArray, type ZodType } from 'zod/v4';
	import { type $ZodAnyDef, type $ZodOptional, type $ZodNullableDef } from 'zod/v4/core';
	import * as Select from '$lib/components/ui/select/index.ts';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { AutoformsFieldMeta } from '@finnolin/sveltekit-autoforms';
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

	// peel off one optional layer if present
	const schema =
		field.def.type === 'optional'
			? (field.def as $ZodNullableDef).innerType
			: (field.def as ZodType);

	// now treat as array of enums
	const arrDef = schema as ZodArray<ZodEnum>;
	const entries = objectToArray(arrDef.element.def.entries);
	//let entries = [];

	//const entries = [{ value: 'a', label: 'A' }];
	const trigger_text = $derived(
		arrDef.element.def.entries[auto_form.data[field.field_id]] ?? 'Select an option...'
	);

	let value: string | undefined = $state();
</script>

<Header title={field.label} />

<Select.Root
	type="single"
	name={field.field_id}
	bind:value
	onValueChange={() => {
		auto_form.data[field.field_id] = value;
	}}>
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
