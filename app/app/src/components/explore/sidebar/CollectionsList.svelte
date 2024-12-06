<script lang="ts">
import { stateStore } from '~/stores/stateStore'

import type { Locales } from '~/i18n'
import { i18nFactory } from '~/i18n'
export let locale: Locales | undefined = undefined
const _ = i18nFactory(locale)

function selectCollection(collectionId: string)
{
	const collectionsValue = stateStore.get()
	stateStore.set({
		...collectionsValue,
		contentViewMode: 'table',
		selectedCollection: collectionsValue.collections[collectionId] ? collectionId : null,
		loadDocuments: true,
	})
}
</script>

{#if !$stateStore.collections}
	<p class="info-text">
		{_({
			en: 'Loading collections...',
			fr: 'Chargement des collections...',
		})}
	</p>
{:else if $stateStore.collections.length <= 0}
	<p class="info-text">
		{_({
			en: 'No collections found.',
			fr: 'Aucune collection trouvée.',
		})}
	</p>
{:else}
	<ul>
		{#each Object.entries($stateStore.collections) as [collectionId, collection]}
			<li class:active={collectionId === $stateStore.selectedCollection}>
				<a href="#" on:click|preventDefault={() => selectCollection(collectionId)}>
					{collection.name}
				</a>
			</li>
		{/each}
	</ul>
{/if}

<style lang="scss">
	.info-text {
		@apply px-3 py-1;
		@apply text-sm text-gray-600;
	}

	ul {
		@apply w-full;
		@apply px-1;
		@apply list-none;
		@apply space-y-1;

		li {
			@apply bg-white;
			@apply rounded-lg;

			a {
				@apply text-gray-800;
				@apply block;
				@apply px-2 py-1;
				@apply hover:bg-gray-100;
				@apply active:bg-gray-200;
				@apply rounded-lg;
			}

			&.active a, a.active {
				@apply bg-gray-100;
				@apply hover:bg-gray-200;
				@apply active:bg-gray-300;
			}
		}
	}
</style>
