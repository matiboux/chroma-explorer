<script lang="ts">
import { onMount } from 'svelte'
import { ChromaClient } from 'chromadb'

import { configStore } from '~/stores/configStore'
import { collectionsStore, reloadCollections } from '~/stores/collectionsStore'

async function onRefresh()
{
	return reloadCollections()
}

onMount(() =>
{
	const collections = collectionsStore.get().collections
	if (!collections)
	{
		onRefresh()
	}
})
</script>

<button
	class="btn btn-default"
	on:click={onRefresh}
>
	<span class="icon icon-[mdi--refresh] icon-align"></span>
	<span class="sr-only">
		Refresh collections
	</span>
</button>

<style lang="scss">
	.btn {
		@apply px-2 py-1;
		@apply bg-gray-100;
		@apply border border-gray-200 rounded-lg;

		&:hover {
			@apply bg-gray-200;
		}
	}
</style>
