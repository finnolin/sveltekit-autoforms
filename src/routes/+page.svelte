<script lang="ts">
	import Autoform from '$lib/autoform.svelte';
	import { submitAutoForm } from './autoform.remote.js';
	import { form_schema_register } from '$lib/schemas/form-schema-register.js';
	import Button from '$lib/components/ui/button/button.svelte';
	//import AutoForm from '$lib/autoform.svelte';
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

<Autoform
	debug={true}
	remoteFunction={submitAutoForm}
	form_schema={form_schema_register}
	callback={async (result) => {
		const response = await handleForm(result);
		return response;
	}}>
	{#snippet button_snippet(disabled: boolean)}
		<Button {disabled} class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
			>Submit</Button>
	{/snippet} i am a child</Autoform>
<Autoform form_schema={form_schema_register} callback={handleForm} />
