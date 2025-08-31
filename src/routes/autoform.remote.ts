import { form } from '$app/server';
import { form_schema_login } from '$lib/schemas/form-schema-login.ts';

export const submitForm = form(async (data) => {
	console.log(data);

	try {
		const test = form_schema_login.parse(data);
		console.log(test);
		return 'success';
	} catch (error) {
		console.log('an error happened');
		return 'error';
	}
});

export const submitAutoForm = form(async (data) => {
	const form_data = Object.fromEntries(data.entries());
	console.log(form_data);

	try {
		const test = form_schema_login.parse(form_data);
		console.log(test);
		return 'success';
	} catch (error) {
		console.log(error);
		return 'error';
	}
});
