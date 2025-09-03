<script lang="ts">
	import { type AutoFormState } from '$lib/autoformstate.svelte.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { FieldMeta } from '$lib/types.d.js';
	import Header from './element-header.svelte';
	import Footer from './element-footer.svelte';
	type Props = HTMLInputAttributes & {
		field: FieldMeta;
		auto_form: AutoFormState<any>;
	};
	let { field, auto_form }: Props = $props();
</script>

<Header title={field.label} />
<Input
	bind:value={auto_form.data[field.field_id]}
	name={field.field_id}
	type={field.hidden ? 'password' : 'text'}
	onchange={(e) => {
		auto_form.onBlur(field.field_id);
	}}
	oninput={(e) => {
		auto_form.onInput(field.field_id);
	}} />
<Footer errors={auto_form.validation[field.field_id].errors} />
