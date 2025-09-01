<script lang="ts">
	import { type RemoteForm } from '@sveltejs/kit';
	import { AutoFormState } from './autoform.svelte.js';
	import z from 'zod';

	// Utility
	import { getMeta } from './zod_adapter.js';

	type AutoFormProps<T extends z.ZodRawShape = z.ZodRawShape> = {
		remoteFunction: RemoteForm<any>;
		form_schema: z.ZodObject<T>;
		//spa_mode?: string | true | undefined;
		//form_meta?: FormMeta;
		//form_id?: string;
		title?: string;
		description?: string;
		button_text?: string;
		container_type?: 'dialog' | 'modal' | 'none';
		callback?: (
			result: any
		) => Promise<{ error?: { message: string } } | void> | { error?: { message: string } } | void;
		open?: boolean;
	};

	let {
		remoteFunction,
		form_schema,
		title,
		description,
		button_text,
		container_type,
		callback,
		open
	}: AutoFormProps = $props();
	const form_meta = getMeta(form_schema);

	// Get the keys and create initial state
	const schem_keys = Object.keys(form_schema.shape);
	const initial_state = Object.fromEntries(
		schem_keys.map((key) => [
			key,
			{
				value: undefined,
				error: undefined,
				dirty: false,
				valid: false
			}
		])
	);

	const auto_form = new AutoFormState(form_schema);
</script>

<form
	{...remoteFunction.enhance(async ({ form, data, submit }) => {
		auto_form.validateForm();
		await submit();
	})}
>
	{#each form_meta.fields as field}
		<div>
			<field.component {field} {auto_form} />
		</div>
	{/each}

	<button>Publish!</button>
	{#if remoteFunction.result}
		{remoteFunction.result}
	{/if}
</form>
