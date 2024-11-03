<script lang="ts">
const collections = [
	'collection-1',
	'collection-2',
	'collection-3',
]
</script>

<ul>
	{#each collections as collection}
		<li>
			<a href="#" on:click|preventDefault={() => console.log(collection)}>
				{collection}
			</a>
		</li>
	{/each}
</ul>

<style lang="scss">
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
