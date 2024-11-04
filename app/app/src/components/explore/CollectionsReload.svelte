<script lang="ts">
import { onMount } from 'svelte'
import { ChromaClient } from 'chromadb'

import { configStore } from '~/stores/configStore'
import { stateStore, reloadCollections } from '~/stores/stateStore'
import Button from '~/components/generic/Button.svelte'

import { i18nFactory } from '~/i18n'
export let locale: string | undefined = undefined
const _ = i18nFactory(locale)

async function onRefresh()
{
	return reloadCollections()
}

onMount(() =>
{
	const collections = stateStore.get().collections
	if (!collections)
	{
		onRefresh()
	}
})
</script>

<Button on:click={onRefresh}>
	<span class="icon icon-[mdi--refresh] icon-align"></span>
	<span class="sr-only">
		{_({
			en: 'Refresh collections',
			fr: 'Rafraîchir les collections',
		})}
	</span>
</Button>

<style lang="scss">
</style>
