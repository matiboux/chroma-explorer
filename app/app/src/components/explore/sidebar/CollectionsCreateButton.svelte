<script lang="ts">
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
		modalViewMode: 'createCollection',
	})
}
</script>

<Button on:click={onClick}>
	<span class="icon icon-[mdi--folder-plus-outline] icon-align"></span>
	<span class="sr-only">
		{_({
			en: 'Create a collection',
			fr: 'Créer une collection',
		})}
	</span>
</Button>

<style>
@reference "tailwindcss/theme";
</style>
