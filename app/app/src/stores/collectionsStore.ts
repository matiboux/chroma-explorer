import { atom } from 'nanostores'
import { ChromaClient } from 'chromadb'
import type { CollectionParams } from 'chromadb'

import { configStore } from '~/stores/configStore'

export interface CollectionsStore
{
	collections: Record<string, CollectionParams> | null
	selectedCollection: string | null
}

const defaultValue: CollectionsStore = {
	collections: null,
	selectedCollection: null,
}

export const collectionsStore = atom<CollectionsStore>(defaultValue)

export async function reloadCollections()
{
	collectionsStore.set({
		...collectionsStore.get(),
		collections: null,
	})

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

		const collections = (await chroma.listCollections()).reduce<Record<string, CollectionParams>>(
			(collections, collection) =>
			{
				collections[collection.id] = collection
				return collections
			},
			{} as Record<string, CollectionParams>,
		)
		const selectedCollection = collectionsStore.get().selectedCollection

		collectionsStore.set({
			...collectionsStore.get(),
			collections: collections,
			selectedCollection: selectedCollection && collections[selectedCollection] ? selectedCollection : null,
		})
	}
	catch (error: unknown)
	{
		collectionsStore.set({
			...collectionsStore.get(),
			collections: {},
			selectedCollection: null,
		})
	}
}
