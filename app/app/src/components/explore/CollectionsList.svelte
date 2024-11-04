<script lang="ts">
import { collectionsStore } from '~/stores/collectionsStore'

function selectCollection(collectionId: string)
{
	const collectionsValue = collectionsStore.get()
	collectionsStore.set({
		...collectionsValue,
		selectedCollection: collectionsValue.collections[collectionId] ? collectionId : null,
	})
}
</script>

{#if !$collectionsStore.collections}
	<p class="info-text">
		Loading collections...
	</p>
{:else if $collectionsStore.collections.length <= 0}
	<p class="info-text">
		No collections found.
	</p>
{:else}
	<ul>
		{#each Object.entries($collectionsStore.collections) as [collectionId, collection]}
			<li class:active={collectionId === $collectionsStore.selectedCollection}>
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
