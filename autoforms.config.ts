/** @type {import('sveltekit-autoforms').AutoformConfig} */
const config = {
	// zodMappings allows the user to override the default component
	// used for a given Zod type.
	zodMappings: {
		string: 'MyCustomInput'
		// You could add others here
		// number: MyCustomNumberInput,
		// boolean: MyCustomCheckbox,
	}
};

export default config;
