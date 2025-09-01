#!/usr/bin/env node

import { Command } from 'commander';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
	.name('sveltekit-autoforms')
	.description('CLI for installing sveltekit-autoforms field components')
	.version('1.0.0');

// Helper function to copy directory recursively
async function copyDirectory(src, dest) {
	await fs.mkdir(dest, { recursive: true });

	const entries = await fs.readdir(src, { withFileTypes: true });

	for (const entry of entries) {
		const srcPath = path.join(src, entry.name);
		const destPath = path.join(dest, entry.name);

		if (entry.isDirectory()) {
			await copyDirectory(srcPath, destPath);
		} else {
			await fs.copyFile(srcPath, destPath);
		}
	}
}

// Helper function to update imports in a file
async function updateImports(filePath) {
	try {
		const content = await fs.readFile(filePath, 'utf8');

		// Replace the imports
		const updatedContent = content
			.replace(/from '\$lib\/autoformstate\.svelte\.js'/g, "from 'sveltekit-autoforms'")
			.replace(/from '\$lib\/types\.d\.js'/g, "from 'sveltekit-autoforms'");

		// Only write if content changed
		if (content !== updatedContent) {
			await fs.writeFile(filePath, updatedContent, 'utf8');
			return true;
		}
		return false;
	} catch (error) {
		console.error(`Error updating imports in ${filePath}:`, error.message);
		return false;
	}
}

// Helper function to update imports in all .svelte files in a directory
async function updateImportsInDirectory(dir) {
	const entries = await fs.readdir(dir, { withFileTypes: true });
	let updatedCount = 0;

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			updatedCount += await updateImportsInDirectory(fullPath);
		} else if (
			entry.name.endsWith('.svelte') ||
			entry.name.endsWith('.js') ||
			entry.name.endsWith('.ts')
		) {
			const wasUpdated = await updateImports(fullPath);
			if (wasUpdated) updatedCount++;
		}
	}

	return updatedCount;
}

program
	.command('install')
	.description('Install all autoforms field components')
	.option('-d, --dir <directory>', 'target directory', './src/lib/components/autoforms')
	.action(async (options) => {
		try {
			const sourceFieldsPath = path.join(__dirname, '../dist/fields');
			const targetDir = path.resolve(options.dir);
			const targetFieldsPath = path.join(targetDir, 'fields');

			// Check if source fields directory exists
			try {
				await fs.access(sourceFieldsPath);
			} catch {
				console.error('Source fields directory not found.');
				console.error('Expected location:', sourceFieldsPath);
				return;
			}

			console.log('Installing autoforms components...');

			// Copy the entire fields directory
			await copyDirectory(sourceFieldsPath, targetFieldsPath);
			console.log(`✓ Copied fields to ${targetFieldsPath}`);

			// Update imports in all copied files
			const updatedCount = await updateImportsInDirectory(targetFieldsPath);
			if (updatedCount > 0) {
				console.log(`✓ Updated imports in ${updatedCount} files`);
			}

			console.log('');
			console.log('🎉 Installation complete!');
			console.log(`Fields are now available in: ${targetFieldsPath}`);
			console.log('');
			console.log('You can now import them like:');
			console.log(
				`import TextField from '${path.relative(process.cwd(), targetFieldsPath)}/TextField.svelte';`
			);
		} catch (error) {
			console.error('Error installing components:', error.message);
		}
	});

program
	.command('list')
	.description('List available field components')
	.action(async () => {
		try {
			const fieldsDir = path.join(__dirname, '../dist/fields');

			try {
				await fs.access(fieldsDir);
			} catch {
				console.error('Fields directory not found.');
				return;
			}

			const getFiles = async (dir, fileList = []) => {
				const files = await fs.readdir(dir, { withFileTypes: true });

				for (const file of files) {
					const filePath = path.join(dir, file.name);
					if (file.isDirectory()) {
						await getFiles(filePath, fileList);
					} else if (file.name.endsWith('.svelte')) {
						const relativePath = path.relative(fieldsDir, filePath);
						fileList.push(relativePath.replace('.svelte', ''));
					}
				}

				return fileList;
			};

			const components = await getFiles(fieldsDir);

			console.log('Available field components:');
			components.forEach((component) => {
				console.log(`  - ${component}`);
			});
		} catch (error) {
			console.error('Error listing components:', error.message);
		}
	});

program.parse();
