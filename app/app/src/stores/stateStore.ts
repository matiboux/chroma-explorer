import { atom } from 'nanostores'
import type { CollectionParams, ChromaClient, GetResponse } from 'chromadb'

import { chromaStore } from '~/stores/chromaStore'
import type ModalViewMode from '~/types/ModalViewMode.d.ts'
import type ContentViewMode from '~/types/ContentViewMode.d.ts'

export interface StateStore
{
	collections: Record<string, CollectionParams> | null
	selectedCollection: string | null
	collection: Awaited<ReturnType<ChromaClient['getCollection']>> | null
	modalViewMode: ModalViewMode | null
	contentViewMode: ContentViewMode | null
	selectedDocument: string | null
	document: GetResponse | null
}

const defaultState: StateStore = {
	collections: null,
	selectedCollection: null,
	collection: null,
	modalViewMode: null,
	contentViewMode: null,
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

stateStore.subscribe(async (state) =>
{
	if (
		state.collections &&
		state.collections[state.selectedCollection!]
	)
	{
		if (
			!state.collection ||
			state.selectedCollection !== state.collection.id
		)
		{
			// Load the selected collection
			const chroma = chromaStore.get()!
			const collection = await chroma.getCollection({
				name: state.collections[state.selectedCollection!]!.name,
				embeddingFunction: null!,
			})

			stateStore.set({
				...state,
				collection: collection,
			})
			return
		}
	}
	else if (state.collection)
	{
		// Clear the collection
		stateStore.set({
			...state,
			collection: null,
		})
		return
	}
})
