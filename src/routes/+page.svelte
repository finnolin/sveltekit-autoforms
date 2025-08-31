<script lang="ts">
	import { submitAutoForm } from './autoform.remote.ts';
	import { form_schema_register } from '$lib/schemas/form-schema-register.ts';
	import Form from '$lib/form.svelte';
</script>

<h1>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<Form remoteFunction={submitAutoForm} form_schema={form_schema_register} />
