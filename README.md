# SvelteKit Autoforms

sveltekit-autoforms is a library for SvelteKit that automatically generates fully functional, progressively enhanced forms directly from your Zod schemas.

> **Note:** This project is in its very early stages. The API is subject to change, and there may be bugs. Please use with caution and feel free to contribute!

## Features

- **Zero-Effort Forms**: Create entire forms from a single Zod schema.
- **Progressive Enhancement**: Built to work seamlessly with SvelteKit's remote functions.
- **Bring Your Own Components**: A CLI is included to install pre-built shadcn-svelte compatible components directly into your project.
- **Intelligent Setup**: The CLI automatically detects your project's path aliases (`$lib`, etc.) and component paths for you.

## Installation

```bash
npm install @finnolin/sveltekit-autoforms
```

## Basic Usage

The core of the library is the `Form` component. Provide it with a Zod schema, and it will generate the corresponding form fields and a submit button.

**src/routes/+page.svelte**

```svelte
<script lang="ts">
	import { Form } from '@finnolin/sveltekit-autoforms';
	import { z } from 'zod';

	const loginSchema = z.object({
		email: z.string().email(),
		password: z.string().min(8, 'Password must be at least 8 characters long.')
	});
</script>

<Form form_schema={loginSchema} />
```

This will render a form with an email input, a password input, and a submit button. Client-side validation is automatically handled based on your schema.

## Installing Components (CLI)

sveltekit-autoforms uses a bring-your-own-component model. A CLI is provided to install a set of pre-built components that are compatible with shadcn-svelte.

To run the installer, use:

```bash
npx @finnolin/sveltekit-autoforms@latest install
```
