<script lang="ts">
import { stateStore } from '~/stores/stateStore'
import CollectionTable from '~/components/explore/content/CollectionTable.svelte'
import type ContentViewMode from '~/types/ContentViewMode.d.ts'

import type { Locales } from '~/i18n'
import { i18nFactory } from '~/i18n'
export let locale: Locales | undefined = undefined
const _ = i18nFactory(locale)

const contentViewModeMap: Record<ContentViewMode | 'default', {
	component: typeof SvelteComponent,
}> = {
	'table': {
		component: CollectionTable,
	},
	'default': {
		component: CollectionTable,
	},
}
</script>

{#if !$stateStore.contentViewMode}
	<svelte:component
		this={contentViewModeMap['default'].component}
		locale={locale}
	/>

{:else if contentViewModeMap[$stateStore.contentViewMode]}
	<svelte:component
		this={contentViewModeMap[$stateStore.contentViewMode].component}
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

<style>
@reference "tailwindcss/theme";
</style>
