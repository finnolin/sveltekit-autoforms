import { type ZodRawShape, type ZodObject, type input } from 'zod/v4';
import { type $ZodIssueBase } from 'zod/v4/core';

// Define the validation state interface
type FieldValidation = {
	valid: boolean;
	dirty: boolean;
	errors: string[];
};

// Map a Zod shape -> form values (use input type so it matches pre-parse values)
type FormValuesFromShape<S extends ZodRawShape> = {
	[K in keyof S]: input<S[K]> | undefined;
};

type FormValidationFromShape<S extends ZodRawShape> = {
	[K in keyof S]: FieldValidation;
};

export class AutoFormState<S extends ZodRawShape = ZodRawShape> {
	schema: ZodObject<S>;
	data = $state<FormValuesFromShape<S>>({} as FormValuesFromShape<S>);
	validation = $state<FormValidationFromShape<S>>({} as FormValidationFromShape<S>);
	success: boolean = $state(false);
	debug: boolean = false;

	constructor(schema: ZodObject<S>, debug: boolean = false) {
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
		console.log(this.validation);
		this.debug = debug;
	}

	async validateField<K extends keyof S>(key: K) {
		/*
		 * When should the field be validated?
		 * if the current value is invalid the field should be validated on input
		 * if the current value is valid the field should be validated on blur
		 */

		if (this.debug) {
			console.log('validateField', key, this.data[key]);
		}
		const field_schema = this.schema.shape[key] as unknown as ZodObject;

		// Validate with Zod
		const result = await field_schema.safeParseAsync(this.data[key]);
		// Clear field errors
		this.validation[key].errors = [];

		if (result.success) {
			// Set the field to valid
			this.validation[key].valid = true;
		} else {
			this.success = false;
			// Set the field to invalid and set the error message
			this.validation[key].valid = false;

			// Set errors
			result.error.issues.forEach((issue) => {
				this.validation[key].errors.push(issue.message);
			});
		}
	}

	async preValidateForm() {
		//console.log(this.data);
		const result = await this.schema.safeParseAsync(this.data);

		if (result.success) {
			if (this.debug) {
				console.log('preValidateForm success');
			}
			this.success = true;
			return true;
		} else {
			if (this.debug) {
				console.log('preValidateForm error');
			}
			this.success = false;
			result.error.issues.forEach((issue) => {
				if (
					this.validation[issue.path[0] as keyof S].dirty &&
					!this.validation[issue.path[0] as keyof S].valid
				) {
					this.validation[issue.path[0] as keyof S].errors = [];
					this.validation[issue.path[0] as keyof S].errors.push(issue.message);
					this.validation[issue.path[0] as keyof S].valid = false;
				}
			});
			return false;
		}
	}

	async validateForm() {
		for (const key of Object.keys(this.validation)) {
			this.validation[key].dirty = true;
		}
		return await this.preValidateForm();
	}

	processIssues(issues: $ZodIssueBase[]) {
		issues.forEach((issue) => {
			if (issue.path.length > 0) {
				issue.path.forEach((p) => {
					if (!this.validation[p as keyof S]) {
						return;
					}
					this.validation[p as keyof S].errors = [];
					this.validation[p as keyof S].errors.push(issue.message);
					this.validation[issue.path[0] as keyof S].valid = false;
					this.validation[issue.path[0] as keyof S].dirty = true;
				});
			}
		});
	}

	onInput(key: keyof S) {
		if (this.debug) {
			console.log('onInput', key);
		}
		if (this.validation[key].dirty && !this.validation[key].valid) {
			this.validateField(key);
		}
	}

	onBlur(key: keyof S) {
		if (this.debug) {
			console.log('onBlur', key);
		}
		this.validation[key].dirty = true;
		this.validateField(key);
		this.preValidateForm();
	}
}
