<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { AutoFormState } from '$lib/autoformstate.svelte.js';

	type Props = HTMLInputAttributes & {
		field: any;
		auto_form: AutoFormState;
	};

	let { field, auto_form, ...rest }: Props = $props();
</script>

<label>
	{field.label}
	<div class="border-2">
		<field.component {field} {auto_form} />
	</div>
</label>
{#each auto_form.validation[field.field_id].errors as error}
	<p class="text-red-500">{error}</p>
{/each}
valid: {auto_form.validation[field.field_id].valid}
