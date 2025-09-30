import { form } from '$app/server';
import { form_schema_login, type FormSchemaLogin } from '$lib/schemas/form-schema-login.js';
import { form_schema_register } from '$lib/schemas/form-schema-register.ts';

export const submitForm = form(form_schema_login, async (data) => {
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

export const submitAutoForm = form('unchecked', async (form_data) => {
	try {
		const test = form_schema_login.parse(form_data);
		await new Promise((resolve) => setTimeout(resolve, 1500));
		console.log('after wait');
		return 'success';
	} catch (error) {
		console.log(error);
		return 'error';
	}
});

export const testAutoForm = form('unchecked', async (data) => {
	console.log(data);
	// const form_data = Object.fromEntries(data.entries());
	// console.log(form_data);

	// try {
	// 	const test = form_schema_login.parse(form_data);
	// 	await new Promise((resolve) => setTimeout(resolve, 1500));
	// 	console.log('after wait');
	// 	return 'success';
	// } catch (error) {
	// 	console.log(error);
	// 	return 'error';
	// }
});
