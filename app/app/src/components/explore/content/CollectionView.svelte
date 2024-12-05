<script lang="ts">
import { stateStore } from '~/stores/stateStore'
import CollectionTable from '~/components/explore/content/CollectionTable.svelte'

import type { Locales } from '~/i18n'
import { i18nFactory } from '~/i18n'
export let locale: Locales | undefined = undefined
const _ = i18nFactory(locale)

const contentViewModeMap: Record<ModalViewMode, {
	component: typeof SvelteComponent,
	title: I18nKeys,
}> = {
	'table': {
		component: CollectionTable,
	},
}
</script>

{#if !$stateStore.contentViewMode}
	<p>
		{_({
			en: 'No view mode selected',
			fr: 'Aucun mode de visualisation sélectionné',
		})}
	</p>
{:else if contentViewModeMap[$stateStore.contentViewMode]?.component}
	<svelte:component
		this={contentViewModeMap[$stateStore.contentViewMode]?.component}
		locale={locale}
	/>
{:else}
	<p>
		{_({
			en: 'Unknown view component',
			fr: 'Composant de visualisation inconnu',
		})}
	</p>
{/if}

<style lang="scss">
</style>
