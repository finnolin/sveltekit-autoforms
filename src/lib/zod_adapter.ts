import { z } from 'zod/v4';
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
	component: Component<any>; // Generic Svelte component
}

export const form_registry = z.registry<FormMeta>();
export const field_registry = z.registry<FieldMeta>();

export interface SchemaMetadata {
	form: FormMeta | undefined;
	fields: Record<string, FieldMeta | undefined>;
}

export function getFormMeta<T extends z.ZodRawShape>(form_schema: z.ZodObject<T>): SchemaMetadata {
	const auto_form_meta = form_registry.get(form_schema);
	const field_meta: Record<string, FieldMeta | undefined> = {};

	for (const [field_name, field_schema] of Object.entries(form_schema.shape)) {
		const auto_field_meta = field_registry.get(field_schema);

		field_meta[field_name] = {
			...auto_field_meta,
			//...(field_schema hasOwnProperty 'def' && { type: field_schema.def.type }),
			...(field_schema instanceof z.ZodEnum && { entries: field_schema.def.entries })
		} as FieldMeta;
	}

	const schema_meta = {
		form: auto_form_meta,
		fields: field_meta
	};

	console.log(schema_meta);
	return schema_meta;
}
export function getMeta<T extends z.ZodRawShape>(form_schema: z.ZodObject<T>) {
	const auto_form_meta = form_registry.get(form_schema);

	const fields: FieldMeta[] = [];

	for (const [field_name, field_schema] of Object.entries(form_schema.shape)) {
		const zod_schema = field_schema as z.ZodSchema;
		const auto_field_meta = field_registry.get(zod_schema);

		fields.push({
			...auto_field_meta,
			type: zod_schema.def.type,
			...(zod_schema instanceof z.ZodEnum && { entries: zod_schema.def.entries })
		} as FieldMeta & {
			type: z.ZodSchema['def']['type'];
			entries?: z.ZodEnum['def']['entries'];
		});
	}

	return {
		form: auto_form_meta,
		fields: fields
	};
}
