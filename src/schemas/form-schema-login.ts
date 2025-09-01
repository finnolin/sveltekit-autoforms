import * as z from 'zod/v4';
import { form_registry, field_registry } from '$lib/zod_adapter.js';
import * as Fields from '../fields/index.js';

export const form_schema_login = z
	.object({
		email: z.string().min(3).register(field_registry, {
			field_id: 'email',
			label: 'Email',
			autocomplete: 'email, username',
			component: Fields.Text
		}),
		password: z.string().nonempty().register(field_registry, {
			field_id: 'password',
			label: 'Password',
			hidden: true,
			autocomplete: 'current-password',
			component: Fields.Text
		})
	})
	.register(form_registry, {
		title: 'Login'
	});

export type FormSchemaLogin = typeof form_schema_login;
