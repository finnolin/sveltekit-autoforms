#!/usr/bin/env node
import { confirm, isCancel, log, select, multiselect, spinner } from '@clack/prompts';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseConfig(config_path) {
	try {
		const config_file = fs.readFileSync(config_path, 'utf-8');
		// Remove comments from JSON to allow parsing.
		const json = JSON.parse(
			config_file.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) => (g ? '' : m))
		);
		return json;
	} catch (error) {
		log.error(`Error parsing ${path.basename(config_path)}.`);
		return null;
	}
}

function getAliasPath(config, alias_name) {
	const paths = config?.compilerOptions?.paths;
	if (!paths) return null;
	for (const alias in paths) {
		if (alias == alias_name) {
			return paths[alias][0];
		}
	}
	return null;
}

function resolveAliasedPath(aliased_path: string, project_root: string): string | null {
	let project_config_path;
	if (fs.existsSync(path.join(project_root, 'tsconfig.json'))) {
		project_config_path = path.join(project_root, 'tsconfig.json');
	} else if (path.join(project_root, 'jsconfig.json')) {
		project_config_path = path.join(project_root, 'jsconfig.json');
	} else {
		return null;
	}
	const project_config_json = parseConfig(project_config_path);
	if (project_config_json) {
		const alias_path = getAliasPath(project_config_json, aliased_path);
		if (alias_path) {
			return path.join(project_root, alias_path);
		}
	}
	const svelte_kit_config_path = path.join(project_root, '.svelte-kit/tsconfig.json');
	const svelte_kit_config_json = parseConfig(svelte_kit_config_path);
	if (svelte_kit_config_json) {
		const alias_path = getAliasPath(svelte_kit_config_json, aliased_path);
		project_root = path.join(project_root, '.svelte-kit');
		if (alias_path) {
			return path.join(project_root, alias_path);
		}
	}

	log.warn(
		'Could not find path aliases in tsconfig.json, jsconfig.json, or .svelte-kit/tsconfig.json.'
	);
	// Fallback to assuming the path is relative to the project root
	return path.join(project_root, aliased_path);
}

async function main() {
	const component_style = await select({
		message: 'Choose a component style to install:',
		options: [
			{
				value: 'shadcn',
				label: 'shadcn/ui',
				hint: 'Use your existing shadcn/ui components'
			}
			// {
			// 	value: 'minimal',
			// 	label: 'minimal',
			// 	hint: 'Lightly styled with Tailwind CSS'
			// },
			// {
			// 	value: 'unstyled',
			// 	label: 'unstyled',
			// 	hint: 'No styles, for use with your own custom styling'
			// }
		]
	});

	if (isCancel(component_style)) {
		log.warn('Operation cancelled.');
		process.exit(0);
	}

	if (component_style == 'shadcn') {
		await installShadcnComponents();
	} else {
		log.info('Exiting...');
		process.exit(0);
	}
}

async function installShadcnComponents() {
	log.step('Looking for components.json...');

	const config_path = path.resolve(process.cwd(), 'components.json');

	if (fs.existsSync(config_path)) {
		log.success(`Found Shadcn config at: ${config_path}`);
		const shadcn_config = JSON.parse(fs.readFileSync(config_path, 'utf-8'));
		const aliases = shadcn_config.aliases;

		// Ensure aliases are present
		if (!aliases || !aliases.components || !aliases.ui) {
			log.error('Invalid components.json. Missing `aliases.components` or `aliases.ui`.');
			process.exit(1);
		}

		const components_dir = aliases.components;
		const shadcn_ui_dir = aliases.ui;
		const lib_dir = aliases.lib;

		const confirm_directory = await confirm({
			message: `Do you want to install autoform components to ${components_dir}?`,
			initialValue: true
		});

		if (isCancel(confirm_directory) || !confirm_directory) {
			log.warn('Exiting...');
			process.exit(0);
		}

		// The target directory will be a subfolder within the user's components directory
		const project_root = process.cwd();

		const resolved_lib_dir = resolveAliasedPath(lib_dir, project_root);
		const target_dir = path.join(components_dir.replace(lib_dir, resolved_lib_dir), 'autoforms');

		await copyFieldComponents(target_dir, shadcn_ui_dir, components_dir);
	} else {
		log.error('Could not find components.json in project root.');
		log.info('Please run `npx shadcn-svelte@latest init` to create one.');
		process.exit(1);
	}
}

async function createIndexFile(file_names: string[], target_dir: string) {
	// Helper to convert kebab-case to PascalCase
	const toPascalCase = (str: string) =>
		str
			.split('-')
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join('');

	let imports = '';
	let exports = 'export { ';

	file_names.forEach((file, i) => {
		const baseName = file.replace('.svelte', ''); // e.g. "field-text"
		const name = toPascalCase(baseName); // e.g. "FieldText"
		const alias = toPascalCase(baseName.replace('field-', '')); // e.g. "Text"

		imports += `import ${name} from './${file}';\n`;
		exports += `${name} as ${alias}${i < file_names.length - 1 ? ', ' : ''}`;
	});

	exports += ' };';

	const content = `${imports}\n${exports}\n`;
	const dest_path = path.join(target_dir, 'index.ts');

	fs.writeFileSync(dest_path, content);
}

/**
 * Finds, prompts, and copies shadcn field components.
 * @param target_dir The destination directory (e.g., src/lib/components/autoform)
 * @param ui_dir The alias for shadcn/ui components (e.g., $lib/components/ui)
 */
async function copyFieldComponents(target_dir: string, ui_dir: string, component_dir: string) {
	// --- 1. Find the source component files ---
	// This assumes your packaged files are in `dist` relative to this script.
	// Adjust the relative path if your build output is different.
	const source_dir = path.resolve(__dirname, '../dist/components/shadcn');

	if (!fs.existsSync(source_dir)) {
		log.error(`Source directory not found at: ${source_dir}`);
		log.error('Please make sure you have built the project before running the installer.');
		process.exit(1);
	}

	const all_files = fs.readdirSync(source_dir);
	const field_components = all_files.filter(
		(file) => file.startsWith('field-') && file.endsWith('.svelte')
	);

	const element_components = all_files.filter(
		(file) => file.startsWith('element-') && file.endsWith('.svelte')
	);

	if (field_components.length === 0) {
		log.warn('No field components found in the source directory.');
		return;
	}

	// --- 2. Present the multiselect to the user ---
	const components_to_install = await multiselect({
		message: 'Select the autoform components you want to install:',
		options: field_components.map((file) => ({
			value: file,
			label: file
		})),
		required: true
	});

	if (isCancel(components_to_install)) {
		log.warn('Operation cancelled.');
		process.exit(0);
	}

	components_to_install.push(...element_components);

	// --- 3. Copy and modify the selected files ---
	const s = spinner();
	s.start(`Installing ${components_to_install.length} components...`);

	// Ensure the target directory exists
	fs.mkdirSync(target_dir, { recursive: true });

	for (const file of components_to_install) {
		const source_path = path.join(source_dir, file);
		const dest_path = path.join(target_dir, file);

		// Read the original component content
		let content = fs.readFileSync(source_path, 'utf-8');

		// This is the key step: rewrite the relative imports to use the user's alias
		const import_regex = /from\s+['"](\.\.\/\.\.\/)(.+)['"]/g;
		content = content.replace(import_regex, `from '@finnolin/sveltekit-autoforms`);

		// Write the modified content to the user's project
		fs.writeFileSync(dest_path, content);
	}
	s.message('Creating index file...');
	await createIndexFile(components_to_install, target_dir);
	s.stop('Components installed successfully!');
	const alias_dir = path.join(component_dir, 'autoforms');
	log.success(`You can now import them from '${alias_dir}'`);
}

// At the end of your install.ts file
main().catch((e) => {
	log.error('An unexpected error occurred:');
	console.error(e);
	process.exit(1);
});
