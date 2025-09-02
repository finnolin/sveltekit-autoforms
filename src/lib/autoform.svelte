<script lang="ts">
	import { type RemoteForm, type SubmitFunction } from '@sveltejs/kit';
	import { AutoFormState } from './autoformstate.svelte.js';
	import { type ZodRawShape, type ZodObject, type ZodError } from 'zod/v4';
	import { type $ZodIssueBase } from 'zod/v4/core';
	import { type Snippet } from 'svelte';

	// Utility
	import { getMeta } from './zod_adapter.js';
	type EnhanceCallback<Result> = Parameters<RemoteForm<Result>['enhance']>[0];
	type AutoFormCallback = (
		result: any
	) => Promise<void | { issues: $ZodIssueBase[] }> | void | { issues: $ZodIssueBase[] };

	type AutoFormProps<T extends ZodRawShape = ZodRawShape> = {
		remoteFunction?: RemoteForm<any>;
		form_schema: ZodObject<T>;
		//form_meta?: FormMeta;
		//form_id?: string;
		title?: string;
		description?: string;
		button_text?: string;
		button_snippet?: Snippet;
		button_class?: string;
		container_type?: 'dialog' | 'modal' | 'none';
		callback?: AutoFormCallback;
		open?: boolean;
		children?: Snippet;
	};

	let {
		remoteFunction,
		form_schema,
		title,
		description,
		button_text,
		button_snippet,
		button_class,
		container_type = 'none',
		callback,
		open,
		children
	}: AutoFormProps = $props();

	function createEnhanceFunction<Result>(
		autoform: AutoFormState,
		callback: AutoFormCallback | undefined
	): EnhanceCallback<Result> {
		return async ({ form, data, submit }) => {
			autoform.validateForm(); // Validate the form on the client
			await submit(); // Run the remote function on the server
			if (!callback) return; // run the callback function passed to the component
			const callback_response = await callback({
				data: autoform.data,
				success: autoform.success,
				validation: autoform.validation
			});
			if (!callback_response) {
				return;
			}
			autoform.processIssues(callback_response.issues); // Process the issues from the callback and pass them to the autoform
		};
	}

	function createFormHandler<Result>(
		autoform: AutoFormState,
		callback: AutoFormCallback | undefined,
		remoteFunction?: RemoteForm<Result>
	) {
		if (remoteFunction) {
			return {
				...remoteFunction.enhance(async ({ form, data, submit }) => {
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
			};
		} else {
			return {
				onsubmit: async (event: SubmitEvent) => {
					event.preventDefault();
					autoform.validateForm();
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
			};
		}
	}

	const form_meta = getMeta(form_schema);
	const autoform = new AutoFormState(form_schema);
</script>

{#snippet container_none()}
	<form {...createFormHandler(autoform, callback, remoteFunction)}>
		{#each form_meta.fields as field}
			<field.component {field} auto_form={autoform} />
		{/each}
		{#if button_snippet}
			{@render button_snippet()}
		{:else}
			<button class={button_class}>
				{button_text || 'Submit'}
			</button>
		{/if}
		{@render children?.()}
		{#if remoteFunction?.result}
			{remoteFunction.result}
		{/if}
	</form>
{/snippet}
{#if container_type === 'none'}
	{@render container_none()}
{/if}
