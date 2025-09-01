<script lang="ts">
	import { type AutoFormState } from '$lib/autoformstate.svelte.js';

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
	class="border-input ring-offset-background selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]', aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 flex h-9 w-full min-w-0 rounded-xs border-2 bg-transparent px-3 pt-1.5 text-sm font-medium shadow-none transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
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
