<script lang="ts">
import { collectionsStore } from '~/stores/collectionsStore'

import { i18nFactory } from '~/i18n'
export let locale: string | undefined = undefined
const _ = i18nFactory(locale)
</script>

{#if !$collectionsStore.selectedCollection}
	<p class="splash">
		{_({
			en: 'No collection selected.',
			fr: 'Aucune collection sélectionnée.',
		})}
	</p>
{:else if true}
	<p class="splash">
		{_({
			en: 'Not implemented yet.',
			fr: 'Pas encore implémenté.',
		})}
	</p>
{:else}
	<table>
		<thead>
			<tr>
				<th>ID</th>
				<th>Embedding</th>
				<th>Document</th>
				<th>Metadata</th>
				<th>Actions</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>1</td>
				<td><span class="icon icon-[mdi--check-circle-outline] icon-align"></span> 768</td>
				<td>Document 1</td>
				<td>{'{'} ... {'}'}</td>
				<td>
					<button type="button" class="btn">
						{_({
							en: 'View',
							fr: 'Voir',
						})}
					</button>
					<button type="button" class="btn">
						{_({
							en: 'Edit',
							fr: 'Modifier',
						})}
					</button>
					<button type="button" class="btn">
						{_({
							en: 'Delete',
							fr: 'Supprimer',
						})}
					</button>
				</td>
			</tr>
	</table>
{/if}

<style lang="scss">
	p.splash {
		@apply text-gray-500;
		@apply p-4;
	}

	table {
		@apply w-full;
		@apply border-collapse;

		th, td {
			@apply border border-gray-300;
			@apply p-2;
		}

		th {
			@apply bg-gray-200;
		}
	}
</style>
