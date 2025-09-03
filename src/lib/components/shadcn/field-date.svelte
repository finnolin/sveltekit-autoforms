<script lang="ts">
	import { type AutoFormState } from '$lib/autoformstate.svelte.js';

	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { FieldMeta } from '$lib/types.d.js';
	import Header from './element-header.svelte';
	import Footer from './element-footer.svelte';
	type Props = HTMLInputAttributes & {
		field: FieldMeta;
		auto_form: AutoFormState<any>;
	};
	let { field, auto_form, ...props }: Props = $props();
</script>

<Header title={field.label} />
<input
	class="focus-visible:ring-[3px]', flex h-9 w-full min-w-0 rounded-xs border-2 border-input bg-transparent px-3 pt-1.5 text-sm font-medium shadow-none ring-offset-background transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:ring-destructive/40"
	{...props}
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
