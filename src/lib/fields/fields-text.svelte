<script lang="ts">
	import { AutoFormState } from '../autoform.svelte.ts';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { FieldMeta } from '$lib/types.d.ts';
	import Header from './header.svelte';
	import Footer from './footer.svelte';
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
