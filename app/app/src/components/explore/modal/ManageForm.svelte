<script lang="ts">
import { stateStore } from '~/stores/stateStore'

import type { Locales } from '~/i18n'
import { i18nFactory } from '~/i18n'
export let locale: Locales | undefined = undefined
const _ = i18nFactory(locale)

// Generate a random suffix for id attributes
const idSuffix = Math.random().toString(36).substring(2)

function onCreate()
{
	stateStore.set({
		...stateStore.get(),
		modalViewMode: 'createCollection',
	})
}

async function onView(id: string)
{}

async function onEdit(id: string)
{}

function onDelete(id: string)
{
	stateStore.set({
		...stateStore.get(),
		modalViewMode: 'deleteCollection',
		selectedCollection: id,
	})
}
</script>

<div class="collections-manage">

	{#if !$stateStore.collections || Object.keys($stateStore.collections).length <= 0}
		<p class="splash">
			{_({
				en: 'No collections found.',
				fr: 'Aucune collection trouvée.',
			})}
		</p>

	{:else}
		<table>
			<thead>
				<tr>
					<th>ID</th>
					<th>{_({
						en: 'Name',
						fr: 'Nom',
					})}</th>
					<th>{_({
						en: 'Metadata',
						fr: 'Métadonnées',
					})}</th>
					<th>{_({
						en: 'Tenant',
						fr: 'Locataire',
					})}</th>
					<th>{_({
						en: 'Database',
						fr: 'Base de données',
					})}</th>
					<th>{_({
						en: 'Actions',
						fr: 'Actions',
					})}</th>
				</tr>
			</thead>
			<tbody>
				{#each Object.values($stateStore.collections) as collection}
					<tr>
						<td>{collection.id}</td>
						<td>{collection.name}</td>
						<td>
							{#if !collection.metadata}
								<span class="badge badge-disabled">
									N/A
								</span>
							{:else if Object.keys(collection.metadata).length <= 0}
								<span class="badge badge-primary">
									{_({
										en: 'dictionary',
										fr: 'dictionnaire',
									})}
								</span>
								<span class="badge badge-disabled">
									{_({
										en: 'Empty',
										fr: 'Vide',
									})}
								</span>
							{:else}
								<span class="badge badge-primary">
									{_({
										en: 'dictionary',
										fr: 'dictionnaire',
									})}
								</span>
								{#each Object.keys(collection.metadata) as key}
									<span class="badge">{key}</span>{' '}
								{/each}
							{/if}
						</td>
						<td>{collection.tenant}</td>
						<td>{collection.database}</td>
						<td>
							<button type="button" class="btn" on:click={() => onView(collection.id)}>
								<span class="icon icon-[mdi--eye-outline] icon-align"></span>
								<span class="sr-only">
									{_({
										en: 'View',
										fr: 'Voir',
									})}
								</span>
							</button>
							<button type="button" class="btn" on:click={() => onEdit(collection.id)}>
								<span class="icon icon-[mdi--pencil-outline] icon-align"></span>
								<span class="sr-only">
									{_({
										en: 'Edit',
										fr: 'Modifier',
									})}
								</span>
							</button>
							<button type="button" class="btn" on:click={() => onDelete(collection.id)}>
								<span class="icon icon-[mdi--delete-outline] icon-align"></span>
								<span class="sr-only">
									{_({
										en: 'Delete',
										fr: 'Supprimer',
									})}
								</span>
							</button>
						</td>
					</tr>
				{/each}
				<tr>
					<td colSpan="5"></td>
					<td>
						<button type="button" class="btn" on:click={() => onCreate()}>
							<span class="icon icon-[mdi--plus] icon-align"></span>
							<span class="sr-only">
								{_({
									en: 'Create',
									fr: 'Créer',
								})}
							</span>
						</button>
					</td>
				</tr>
			</tbody>
		</table>
	{/if}

</div>

<style lang="scss">
table {
	@apply bg-white;
	@apply w-full;
	@apply border-collapse;

	th, td {
		@apply p-2;
		@apply border border-gray-200;
	}

	th {
		@apply bg-gray-100;
		@apply border-gray-300;
	}
}

.badge {
	@apply inline-block;
	@apply bg-gray-200;
	@apply px-2;
	@apply text-sm text-gray-600;
	@apply rounded-full;

	&-primary {
		@apply bg-blue-100;
		@apply text-blue-500;
	}
}

.btn {
	@apply px-2 py-1;
	@apply bg-gray-200 hover:bg-gray-300 active:bg-gray-400;
	@apply border border-gray-300 rounded-lg;
}
</style>
