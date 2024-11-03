<script lang="ts">
import { collectionsStore } from '~/stores/collectionsStore'
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
		{#each $collectionsStore.collections as collection}
			<li>
				<a href="#" on:click|preventDefault={() => console.log(collection)}>
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
				@apply rounded-lg;
			}

			&.active a, a.active {
				@apply bg-gray-100;
				@apply hover:bg-gray-200;
			}
		}
	}
</style>
