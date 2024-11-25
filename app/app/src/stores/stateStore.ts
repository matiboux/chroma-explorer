import { atom } from 'nanostores'
import { ChromaClient } from 'chromadb'
import type { CollectionParams, GetResponse } from 'chromadb'

import { configStore } from '~/stores/configStore'

export interface StateStore
{
	collections: Record<string, CollectionParams> | null
	selectedCollection: string | null
	viewMode: 'view' | 'edit' | 'delete' | null
	selectedDocument: string | null
	document: GetResponse | null
}

const defaultState: StateStore = {
	collections: null,
	selectedCollection: null,
	viewMode: null,
	selectedDocument: null,
	document: null,
}

export const stateStore = atom<StateStore>(defaultState)

export async function reloadCollections()
{
	stateStore.set({
		...stateStore.get(),
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
		const selectedCollection = stateStore.get().selectedCollection

		stateStore.set({
			...stateStore.get(),
			collections: collections,
			selectedCollection: selectedCollection && collections[selectedCollection] ? selectedCollection : null,
		})
	}
	catch (error: unknown)
	{
		stateStore.set({
			...stateStore.get(),
			collections: {},
			selectedCollection: null,
		})
	}
}
