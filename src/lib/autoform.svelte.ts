import { z, type ZodRawShape } from 'zod/v4';

// Define the validation state interface
type FieldValidation = {
	valid: boolean;
	dirty: boolean;
	errors: string[];
};

// Map a Zod shape -> form values (use input type so it matches pre-parse values)
type FormValuesFromShape<S extends ZodRawShape> = {
	[K in keyof S]: z.input<S[K]> | undefined;
};

type FormValidationFromShape<S extends ZodRawShape> = {
	[K in keyof S]: FieldValidation;
};

export class AutoFormState<S extends ZodRawShape = ZodRawShape> {
	schema: z.ZodObject<S>;
	data = $state<FormValuesFromShape<S>>({} as FormValuesFromShape<S>);
	validation = $state<FormValidationFromShape<S>>({} as FormValidationFromShape<S>);

	constructor(schema: z.ZodObject<S>) {
		this.schema = schema;
		const keys = Object.keys(schema.shape) as Array<keyof S>;
		for (const key of keys) {
			this.data[key] = undefined;
		}
		for (const key of keys) {
			this.validation[key] = {
				valid: false,
				dirty: false,
				errors: []
			};
		}
	}

	async validateField<K extends keyof S>(key: K) {
		/*
		 * When should the field be validated?
		 * if the current value is invalid the field should be validated on input
		 * if the current value is valid the field should be validated on blur
		 */
		const field_schema = this.schema.shape[key] as unknown as z.ZodTypeAny;

		// Validate with Zod
		const result = await field_schema.safeParseAsync(this.data[key]);
		// Clear field errors
		this.validation[key].errors = [];

		if (result.success) {
			// Set the field to valid
			this.validation[key].valid = true;
		} else {
			// Set the field to invalid and set the error message
			this.validation[key].valid = false;

			// Set errors
			result.error.issues.forEach((issue) => {
				this.validation[key].errors.push(issue.message);
			});
		}
	}

	async validateForm() {
		const result = await this.schema.safeParseAsync(this.data);
		console.log(result.error?.issues);
		if (result.success) {
			return true;
		} else {
			result.error.issues.forEach((issue) => {
				this.validation[issue.path[0] as keyof S].errors.push(issue.message);
				this.validation[issue.path[0] as keyof S].valid = false;
				this.validation[issue.path[0] as keyof S].dirty = true;
			});
			return false;
		}
	}

	onInput(key: keyof S) {
		if (this.validation[key].dirty && !this.validation[key].valid) {
			this.validateField(key);
		}
	}

	onBlur(key: keyof S) {
		this.validation[key].dirty = true;
		this.validateField(key);
	}
}
