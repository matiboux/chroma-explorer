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

async function onClick()
{
	stateStore.set({
		...stateStore.get(),
		viewMode: 'manage',
	})
}
</script>

<Button on:click={onClick}>
	<span class="icon icon-[mdi--folder-cog-outline] icon-align"></span>
	<span class="sr-only">
		{_({
			en: 'Manage collections',
			fr: 'Gérer les collections',
		})}
	</span>
</Button>

<style lang="scss">
</style>
