<script lang="ts">
	import { type RemoteForm, type RemoteFormInput } from '@sveltejs/kit';
	import { AutoFormState } from './autoformstate.svelte.js';
	import { type AutoformProps, type AutoFormCallback } from './types.js';
	// Utility
	import { getMeta } from './zod_adapter.js';

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
		children,
		debug = false
	}: AutoformProps = $props();

	function createFormHandler<Data extends void | RemoteFormInput, Result>(
		autoform: AutoFormState,
		callback: AutoFormCallback | undefined,
		remoteFunction?: RemoteForm<Data, Result>
	) {
		if (remoteFunction) {
			return {
				...remoteFunction.enhance(async ({ form, data, submit }) => {
					if (debug) {
						console.log('on remote submit');
					}
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
					if (debug) {
						console.log('onsumbit');
					}
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
	const autoform = new AutoFormState(form_schema, debug);
</script>

{#snippet container_none()}
	<form {...createFormHandler(autoform, callback, remoteFunction)}>
		{#each form_meta.fields as field}
			<field.component {field} auto_form={autoform} />
		{/each}
		{#if button_snippet}
			{@render button_snippet(!autoform.success)}
		{:else}
			<button class={button_class} type="submit" disabled={!autoform.success}>
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
