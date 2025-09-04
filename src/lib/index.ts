// Reexport your entry components here
import Autoform from './autoform.svelte';
import { field_registry, form_registry } from './zod_adapter.js';
import type { AutoFormState } from './autoformstate.svelte.js';
import type { FormMeta, FieldMeta, AutoformsFieldMeta, AutoformProps } from './types.d.js';

export {
	Autoform,
	type AutoformProps,
	type AutoFormState,
	type AutoformsFieldMeta,
	type FormMeta,
	type FieldMeta,
	field_registry,
	form_registry
};

export default Autoform;
