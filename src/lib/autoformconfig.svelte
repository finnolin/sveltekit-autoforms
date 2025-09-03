<script lang="ts">
	import Autoform from './autoform.svelte';
	import { type AutoFormProps } from './autoform.svelte';
	import default_config from './defaultConfig.js';

	let { ...autoFormProps }: Omit<AutoFormProps, 'config'> = $props();
	const config = default_config;
</script>

<Autoform {config} {...autoFormProps} />
