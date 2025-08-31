<script lang="ts">
	let { errors }: { errors: string[] } = $props();
</script>

{#each errors as error}
	<p class="text-sm text-red-500">{error}</p>
{/each}
