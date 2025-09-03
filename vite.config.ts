import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Plugin } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()]
});
