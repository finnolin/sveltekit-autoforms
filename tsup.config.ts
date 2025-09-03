import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['bin/index.ts'],
	outDir: 'bin',
	format: ['esm'],
	clean: false,
	splitting: false,
	sourcemap: false
});
