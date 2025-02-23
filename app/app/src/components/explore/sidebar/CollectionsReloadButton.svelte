<script lang="ts">
import { onMount } from 'svelte'
import { ChromaClient } from 'chromadb'

import { configStore } from '~/stores/configStore'
import { stateStore } from '~/stores/stateStore'
import Button from '~/components/generic/Button.svelte'

import type { Locales } from '~/i18n'
import { i18nFactory } from '~/i18n'
export let locale: Locales | undefined = undefined
const _ = i18nFactory(locale)

async function onRefresh()
{
	stateStore.set({
		...stateStore.get(),
		collections: null,
	})
}
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

<style>
@reference "tailwindcss/theme";
</style>
