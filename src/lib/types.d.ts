import type { Component } from 'svelte';
import type { $ZodTypeDef, $ZodEnum } from 'zod/v4/core';
import type { FullAutoFill } from 'svelte/elements';

export interface FormMeta {
	form_id?: string;
	title?: string;
	description?: string;
}
import type { $ZodTypeDef } from 'zod/v4/core';

type ZodKind = $ZodTypeDef['type'];

type OptionsMap<V extends object = Record<string, unknown>> = Record<string, V>;

export interface FieldMeta {
	field_id: string;
	label?: string;
	description?: string;
	readonly?: boolean;
	hidden?: boolean;
	autocomplete?: FullAutoFill;
	options?: OptionsMap;
	component: Component<any>;
}

export type AutoformsFieldMeta = FieldMeta & {
	type: ZodKind;
	entries?: $ZodEnum['def']['entries'];
	def: $ZodTypeDef;
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
	debug?: boolean;
};
