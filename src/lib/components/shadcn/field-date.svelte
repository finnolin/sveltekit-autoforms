<script lang="ts">
	import { type AutoFormState } from '$lib/autoformstate.svelte.js';
	import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { AutoformsFieldMeta } from '$lib/types.d.js';
	import Header from './element-header.svelte';
	import Footer from './element-footer.svelte';
	type Props = HTMLInputAttributes & {
		field: AutoformsFieldMeta;
		auto_form: AutoFormState<any>;
	};
	let { field, auto_form, ...props }: Props = $props();

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let contentRef = $state<HTMLElement | null>(null);
	let date_value = $state<DateValue | undefined>();
</script>

<Header title={field.label} />
<Popover.Root>
	<Popover.Trigger
		class={cn(
			buttonVariants({
				variant: 'outline',
				class: 'w-[280px] justify-start text-left font-normal'
			}),
			!date_value && 'text-muted-foreground'
		)}>
		{date_value ? df.format(date_value.toDate(getLocalTimeZone())) : 'Pick a date'}
	</Popover.Trigger>
	<Popover.Content bind:ref={contentRef} class="w-auto p-0">
		<Calendar
			type="single"
			bind:value={date_value}
			onValueChange={(v) => {
				auto_form.data[field.field_id] = v?.toDate(getLocalTimeZone());
				auto_form.validateField(field.field_id);
			}} />
	</Popover.Content>
</Popover.Root>
<Footer errors={auto_form.validation[field.field_id].errors} />
