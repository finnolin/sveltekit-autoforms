<script lang="ts">
	import { submitAutoForm } from './autoform.remote.ts';
	import { form_schema_register } from '../schemas/form-schema-register.ts';
	import AutoForm from '$lib/autoform.svelte';
</script>

<h1>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<AutoForm remoteFunction={submitAutoForm} form_schema={form_schema_register} />
