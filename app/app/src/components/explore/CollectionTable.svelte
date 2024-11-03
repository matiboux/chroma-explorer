<script lang="ts">
import { ChromaClient } from 'chromadb'
import type { MultiGetResponse } from 'chromadb'

import { configStore } from '~/stores/configStore'
import { collectionsStore } from '~/stores/collectionsStore'

import { i18nFactory } from '~/i18n'
export let locale: string | undefined = undefined
const _ = i18nFactory(locale)

let records: MultiGetResponse | null = null

collectionsStore.subscribe(async (value) =>
{
	console.log('collections', value)
	if (!value.collections || !value.selectedCollection || !value.collections[value.selectedCollection])
	{
		return
	}

	records = null

	try
	{
		const config = configStore.get()
		const chroma = new ChromaClient({
			path: config.serverUrl,
			...(
				config.authConfig
				? (
					config.authConfig.token
					? ({
						auth: {
							provider: 'token',
							credentials: config.authConfig.token,
						},
					})
					: config.authConfig.username && config.authConfig.password
					? ({
						auth: {
							provider: 'basic',
							credentials: {
								username: config.authConfig.username,
								password: config.authConfig.password,
							},
						},
					})
					: undefined
				)
				: undefined
			),
		})

		const collection = (await chroma.getCollection({ name: value.collections[value.selectedCollection].name }))
		records = (await collection.peek({ limit: 10 }))
	}
	catch (error: unknown)
	{}
})
</script>

{#if !$collectionsStore.selectedCollection}
	<p class="splash">
		{_({
			en: 'No collection selected.',
			fr: 'Aucune collection sélectionnée.',
		})}
	</p>
{:else if !records}
	<p class="splash">
		{_({
			en: 'Loading...',
			fr: 'Chargement...',
		})}
	</p>
{:else if records.ids.length <= 0}
	<p>
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
			{#each records.ids as id, index}
				<tr>
					<td>{id}</td>
					<td>
						{#if !records.documents || !records.documents[index]}
							<span class="badge badge-disabled">
								N/A
							</span>
						{:else if records.documents[index].length <= 0}
							<span class="badge badge-disabled">
								{_({
									en: 'Empty',
									fr: 'Vide',
								})}
							</span>
						{:else if records.documents[index].length <= 100}
							<span>{records.documents[index]}</span>
						{:else}
							<span>
								{records.documents[index].slice(0, 97)}...
							</span>
							<span class="badge">
								{new Blob([ records.documents[index] ]).size}
								{_({
									en: 'bytes',
									fr: 'octets',
								})}
							</span>
						{/if}
					</td>
					<td>
						{#if !records.metadatas || !records.metadatas[index]}
							<span class="badge badge-disabled">
								N/A
							</span>
						{:else if Object.keys(records.metadatas[index]).length <= 0}
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
							{#each Object.keys(records.metadatas[index]) as key}
								<span class="badge">{key}</span> {' '}
							{/each}
						{/if}
					</td>
					<td>
						<button type="button" class="btn">
							<span class="icon icon-[mdi--eye-outline] icon-align"></span>
							<span class="sr-only">
								{_({
									en: 'View',
									fr: 'Voir',
								})}
							</span>
						</button>
						<button type="button" class="btn">
							<span class="icon icon-[mdi--pencil-outline] icon-align"></span>
							<span class="sr-only">
								{_({
									en: 'Edit',
									fr: 'Modifier',
								})}
							</span>
						</button>
						<button type="button" class="btn">
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
