<script lang="ts">
	import { type RemoteForm } from '@sveltejs/kit';
	import { AutoFormState } from './autoformstate.svelte.js';
	import { type ZodRawShape, type ZodObject, type ZodError } from 'zod/v4';
	import { type $ZodIssueBase } from 'zod/v4/core';
	import { type Snippet } from 'svelte';

	// Utility
	import { getMeta } from './zod_adapter.js';

	type AutoFormProps<T extends ZodRawShape = ZodRawShape> = {
		remoteFunction?: RemoteForm<any>;
		form_schema: ZodObject<T>;
		//form_meta?: FormMeta;
		//form_id?: string;
		title?: string;
		description?: string;
		button_text?: string;
		button_content?: Snippet;
		container_type?: 'dialog' | 'modal' | 'none';
		callback?: (
			result: any
		) => Promise<void | { issues: $ZodIssueBase[] }> | void | { issues: $ZodIssueBase[] };
		open?: boolean;
	};

	let {
		remoteFunction,
		form_schema,
		title,
		description,
		button_text,
		button_content,
		container_type,
		callback,
		open
	}: AutoFormProps = $props();

	const form_meta = getMeta(form_schema);
	const autoform = new AutoFormState(form_schema);
</script>

<form
	{...remoteFunction
		? remoteFunction.enhance(async ({ form, data, submit }) => {
				autoform.validateForm();
				await submit();
				if (!callback) return;
				const callback_response = await callback({
					data: autoform.data,
					success: autoform.success,
					validation: autoform.validation
				});
				if (!callback_response) {
					return;
				}
				autoform.processIssues(callback_response.issues);
			})
		: {}}>
	{#each form_meta.fields as field}
		<div>
			<field.component {field} auto_form={autoform} />
		</div>
	{/each}

	<button
		onclick={async () => {
			if (!remoteFunction) {
				await autoform.validateForm();
				if (!callback) return;
				const callback_response = await callback({
					data: autoform.data,
					success: autoform.success,
					validation: autoform.validation
				});
				if (!callback_response) {
					return;
				}
				autoform.processIssues(callback_response.issues);
			}
		}}>
		{#if button_content}
			{@render button_content()}
		{:else}
			{button_text || 'Submit'}
		{/if}
	</button>

	{#if remoteFunction?.result}
		{remoteFunction.result}
	{/if}
</form>
