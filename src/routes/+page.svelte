<script lang="ts">
	import { submitAutoForm } from './autoform.remote.js';
	import { form_schema_register } from '$lib/schemas/form-schema-register.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import AutoForm from '$lib/autoform.svelte';
	import { type $ZodIssueBase } from 'zod/v4/core';

	function handleForm(form_result: any): { issues: $ZodIssueBase[] } | void {
		console.log('form callback: success ', form_result.success);
		const issues: $ZodIssueBase[] = [
			{
				message: 'something went wrong.',

				code: 'custom_code',
				path: ['username', 'email']
			}
		];
		return { issues: issues };
	}
</script>

<h1>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<AutoForm
	remoteFunction={submitAutoForm}
	form_schema={form_schema_register}
	callback={async (result) => {
		const response = await handleForm(result);
		return response;
	}}>
	{#snippet button_snippet()}
		<button class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
			>Submit</button>
	{/snippet} i am a child</AutoForm>
<AutoForm form_schema={form_schema_register} callback={handleForm} />

<Input />
