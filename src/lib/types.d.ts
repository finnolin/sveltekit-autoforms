import type { Component } from 'svelte';
import type { $ZodTypeDef, $ZodEnum } from 'zod/v4/core';

export interface FormMeta {
	form_id?: string;
	title?: string;
	description?: string;
}
import type { $ZodTypeDef } from 'zod/v4/core';

type ZodKind = $ZodTypeDef['type'];

export interface FieldMeta {
	field_id: string;
	label?: string;
	description?: string;
	readonly?: boolean;
	hidden?: boolean;
	autocomplete?: string;
	component: Component<any>;
}

export type AutoformsFieldMeta = FieldMeta & {
	type: ZodKind;
	entries?: $ZodEnum['def']['entries'];
};

type EnhanceCallback<Result> = Parameters<RemoteForm<Result>['enhance']>[0];
type AutoFormCallback = (
	result: any
) => Promise<void | { issues: $ZodIssueBase[] }> | void | { issues: $ZodIssueBase[] };

export type AutoformProps<T extends ZodRawShape = ZodRawShape> = {
	remoteFunction?: RemoteForm<any>;
	form_schema: ZodObject<T>;
	//form_meta?: FormMeta;
	//form_id?: string;
	title?: string;
	description?: string;
	button_text?: string;
	button_snippet?: Snippet;
	button_class?: string;
	container_type?: 'dialog' | 'modal' | 'none';
	callback?: AutoFormCallback;
	open?: boolean;
	children?: Snippet;
};
