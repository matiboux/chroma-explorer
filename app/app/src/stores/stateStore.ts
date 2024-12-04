import { atom } from 'nanostores'
import type { CollectionParams, GetResponse } from 'chromadb'

import { chromaStore } from '~/stores/chromaStore'
import type ViewMode from '~/types/ViewMode.d.ts'

export interface StateStore
{
	collections: Record<string, CollectionParams> | null
	selectedCollection: string | null
	viewMode: ViewMode | null
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
	try
	{
		const chroma = chromaStore.get()!
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
