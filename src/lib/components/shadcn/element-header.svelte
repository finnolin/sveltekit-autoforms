<script lang="ts">
	import * as Label from '$lib/components/ui/label/index.js';
	let { title, description }: { title?: string; description?: string } = $props();
</script>

<Label.Label>{title}</Label.Label>
<p>{description}</p>
