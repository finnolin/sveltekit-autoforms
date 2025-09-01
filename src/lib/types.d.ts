import type { Component } from 'svelte';

export interface FormMeta {
	form_id?: string;
	title?: string;
	description?: string;
}

export interface FieldMeta {
	field_id: string;
	label?: string;
	description?: string;
	readonly?: boolean;
	hidden?: boolean;
	autocomplete?: string;
	component: Component<any>;
}
