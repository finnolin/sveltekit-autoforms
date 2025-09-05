import * as z from 'zod/v4';
import { form_registry, field_registry } from '$lib/zod_adapter.js';
import * as Fields from '$lib/components/shadcn/index.ts';

const options = {
	salmon: { label: 'Cool Salmon' },
	tuna: { label: 'Tuna' },
	jellyfish: { label: 'Jellyfish' }
};

export const form_schema_register = z
	.object({
		username: z
			.string()
			.min(3)
			.max(20)
			.refine(
				(val) => {
					console.log('refining username!');
					return val == 'admin';
				},
				{
					message: 'Username needs to be admin'
				}
			)
			.register(field_registry, {
				field_id: 'username',
				label: 'Username',
				component: Fields.Text
			}),
		email: z.email().register(field_registry, {
			field_id: 'email',
			label: 'Email',
			component: Fields.Text
		}),
		password: z.string().min(8).register(field_registry, {
			field_id: 'password',
			label: 'Password',
			autocomplete: 'new-password',
			hidden: true,
			component: Fields.Text
		}),
		confirm_password: z.string().min(8).register(field_registry, {
			field_id: 'confirm_password',
			label: 'Confirm Password',
			autocomplete: 'off',
			hidden: true,
			component: Fields.Text
		}),
		date: z.date().register(field_registry, {
			field_id: 'date',
			label: 'Date',
			component: Fields.Date
		}),
		select: z
			.enum(Object.keys(options) as [keyof typeof options, ...(keyof typeof options)[]])
			.register(field_registry, {
				field_id: 'select',
				label: 'Select',
				component: Fields.Select,
				options: options
			}),
		array: z
			.array(z.enum({ salmon: 'Salmon', tuna: 'Tuna', shrimp: 'Shrimp' }))
			.optional()
			.register(field_registry, {
				field_id: 'array',
				label: 'Array',
				component: Fields.Collect
			})
	})
	.register(form_registry, {
		title: 'Login'
	})
	.refine((data) => data.password === data.confirm_password, {
		message: 'Passwords do not match',
		path: ['confirm_password']
	});

export type FormSchemaRegister = typeof form_schema_register;
