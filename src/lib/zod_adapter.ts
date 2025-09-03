import { registry, ZodEnum } from 'zod/v4';
import type { ZodRawShape, ZodObject, ZodSchema } from 'zod/v4';
import type { FormMeta, FieldMeta } from './types.d.js';

export const form_registry = registry<FormMeta>();
export const field_registry = registry<FieldMeta>();

interface SchemaMetadata {
	form: FormMeta | undefined;
	fields: Record<string, FieldMeta | undefined>;
}

export function getFormMeta<T extends ZodRawShape>(form_schema: ZodObject<T>): SchemaMetadata {
	const auto_form_meta = form_registry.get(form_schema);
	const field_meta: Record<string, FieldMeta | undefined> = {};

	for (const [field_name, field_schema] of Object.entries(form_schema.shape)) {
		const auto_field_meta = field_registry.get(field_schema);

		field_meta[field_name] = {
			...auto_field_meta,
			//...(field_schema hasOwnProperty 'def' && { type: field_schema.def.type }),
			...(field_schema instanceof ZodEnum && { entries: field_schema.def.entries })
		} as FieldMeta;
	}

	const schema_meta = {
		form: auto_form_meta,
		fields: field_meta
	};

	console.log(schema_meta);
	return schema_meta;
}
export function getMeta<T extends ZodRawShape>(form_schema: ZodObject<T>) {
	const auto_form_meta = form_registry.get(form_schema);

	const fields: FieldMeta[] = [];

	for (const [field_name, field_schema] of Object.entries(form_schema.shape)) {
		const zod_schema = field_schema as ZodSchema;
		const auto_field_meta = field_registry.get(zod_schema);

		fields.push({
			...auto_field_meta,
			type: zod_schema.def.type,
			...(zod_schema instanceof ZodEnum && { entries: zod_schema.def.entries })
		} as FieldMeta & {
			type: ZodSchema['def']['type'];
			entries?: ZodEnum['def']['entries'];
		});
	}
	return {
		form: auto_form_meta,
		fields: fields
	};
}
