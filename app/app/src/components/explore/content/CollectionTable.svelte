<script lang="ts">
import { stateStore } from '~/stores/stateStore'
import CollectionTableActions from '~/components/explore/content/CollectionTableActions.svelte'

import type { Locales } from '~/i18n'
import { i18nFactory } from '~/i18n'
export let locale: Locales | undefined = undefined
const _ = i18nFactory(locale)

function onView(id: string)
{
	stateStore.set({
		...stateStore.get(),
		modalViewMode: 'viewDocument',
		selectedDocument: id,
	})
}

function onEdit(id: string)
{
	stateStore.set({
		...stateStore.get(),
		modalViewMode: 'editDocument',
		selectedDocument: id,
	})
}

function onDelete(id: string)
{
	stateStore.set({
		...stateStore.get(),
		modalViewMode: 'deleteDocument',
		selectedDocument: id,
	})
}
</script>

<div class="wrapper">

	{#if !$stateStore.selectedCollection}
		<p class="splash">
			{_({
				en: 'No collection selected.',
				fr: 'Aucune collection sélectionnée.',
			})}
		</p>

	{:else}
		{#if !$stateStore.documents}
			<p class="splash">
				{_({
					en: 'Loading...',
					fr: 'Chargement...',
				})}
			</p>

		{:else if $stateStore.documents.ids.length <= 0}
			<p class="splash">
				{_({
					en: 'No records found.',
					fr: 'Aucun enregistrement trouvé.',
				})}
			</p>

		{:else}
			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>Document</th>
						<th>Metadata</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each $stateStore.documents.ids as id, index}
						<tr>
							<td>{id}</td>
							<td>
								{#if !$stateStore.documents.documents || !$stateStore.documents.documents[index]}
									<span class="badge badge-disabled">
										N/A
									</span>
								{:else if $stateStore.documents.documents[index].length <= 0}
									<span class="badge badge-disabled">
										{_({
											en: 'Empty',
											fr: 'Vide',
										})}
									</span>
								{:else if $stateStore.documents.documents[index].length <= 100}
									<span>{$stateStore.documents.documents[index]}</span>
								{:else}
									<span>
										{$stateStore.documents.documents[index].slice(0, 97)}...
									</span>
									<span class="badge">
										{new Blob([ $stateStore.documents.documents[index] ]).size}
										{_({
											en: 'bytes',
											fr: 'octets',
										})}
									</span>
								{/if}
							</td>
							<td>
								{#if !$stateStore.documents.metadatas || !$stateStore.documents.metadatas[index]}
									<span class="badge badge-disabled">
										N/A
									</span>
								{:else if Object.keys($stateStore.documents.metadatas[index]).length <= 0}
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
									{#each Object.keys($stateStore.documents.metadatas[index]) as key}
										<span class="badge">{key}</span> {' '}
									{/each}
								{/if}
							</td>
							<td>
								<button type="button" class="btn" on:click={() => onView(id)}>
									<span class="icon icon-[mdi--eye-outline] icon-align"></span>
									<span class="sr-only">
										{_({
											en: 'View',
											fr: 'Voir',
										})}
									</span>
								</button>
								<button type="button" class="btn" on:click={() => onEdit(id)}>
									<span class="icon icon-[mdi--pencil-outline] icon-align"></span>
									<span class="sr-only">
										{_({
											en: 'Edit',
											fr: 'Modifier',
										})}
									</span>
								</button>
								<button type="button" class="btn" on:click={() => onDelete(id)}>
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
			</table>
		{/if}
	{/if}

	<div class="footer">
		<CollectionTableActions locale={locale} />
	</div>

</div>

<style>
@reference "tailwindcss/theme";

.wrapper {
	@apply bg-gray-50;
	@apply h-full;
	@apply pb-16;
	@apply overflow-y-auto;

	.footer {
		@apply absolute left-0 bottom-0;
		@apply flex justify-between items-center;
		@apply w-full min-h-16;
		@apply px-4 py-2;
		@apply z-10;
	}
}

p.splash {
	@apply text-gray-500;
	@apply p-4;
}

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
