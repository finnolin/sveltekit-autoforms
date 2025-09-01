<script lang="ts">
	import { AutoFormState } from '$lib/autoformstate.svelte.js';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { FieldMeta } from '$lib/types.d.js';
	import Header from './autoforms-header.svelte';
	import Footer from './autoforms-footer.svelte';
	type Props = HTMLInputAttributes & {
		field: FieldMeta;
		auto_form: AutoFormState<any>;
	};
	let { field, auto_form, ...props }: Props = $props();
</script>

<Header title={field.label} />
<input
	{...props}
	bind:value={auto_form.data[field.field_id]}
	name={field.field_id}
	onchange={(e) => {
		auto_form.onBlur(field.field_id);
	}}
	oninput={(e) => {
		auto_form.onInput(field.field_id);
	}}
/>
<Footer errors={auto_form.validation[field.field_id].errors} />
