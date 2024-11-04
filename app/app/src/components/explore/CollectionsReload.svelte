<script lang="ts">
import { onMount } from 'svelte'
import { ChromaClient } from 'chromadb'

import { configStore } from '~/stores/configStore'
import { collectionsStore, reloadCollections } from '~/stores/collectionsStore'
import Button from '~/components/generic/Button.svelte'

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

<Button on:click={onRefresh}>
	<span class="icon icon-[mdi--refresh] icon-align"></span>
	<span class="sr-only">
		Refresh collections
	</span>
</Button>

<style lang="scss">
</style>
