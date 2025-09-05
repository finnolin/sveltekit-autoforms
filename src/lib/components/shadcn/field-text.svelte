<script lang="ts">
	import { type AutoFormState } from '@finnolin/sveltekit-autoforms';
	import { Input } from '$lib/components/ui/input/index.js';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { AutoformsFieldMeta } from '@finnolin/sveltekit-autoforms';
	import Header from './element-header.svelte';
	import Footer from './element-footer.svelte';
	type Props = HTMLInputAttributes & {
		field: AutoformsFieldMeta;
		auto_form: AutoFormState<any>;
	};
	let { field, auto_form }: Props = $props();
</script>

<Header title={field.label} />
<Input
	bind:value={auto_form.data[field.field_id]}
	name={field.field_id}
	type={field.hidden ? 'password' : 'text'}
	autocomplete={field.autocomplete}
	onchange={(e) => {
		auto_form.onBlur(field.field_id);
	}}
	oninput={(e) => {
		auto_form.onInput(field.field_id);
	}} />
<Footer errors={auto_form.validation[field.field_id].errors} />
