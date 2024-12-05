import { atom } from 'nanostores'
import type { CollectionParams, ChromaClient, GetResponse } from 'chromadb'

import { configStore } from '~/stores/configStore'
import type ModalViewMode from '~/types/ModalViewMode.d.ts'
import type ContentViewMode from '~/types/ContentViewMode.d.ts'
import { makeChromaClient } from './utils/makeChromaClient'

export interface StateStore
{
	chroma: ChromaClient | null
	collections: Record<string, CollectionParams> | null
	selectedCollection: string | null
	collection: Awaited<ReturnType<ChromaClient['getCollection']>> | null
	modalViewMode: ModalViewMode | null
	contentViewMode: ContentViewMode | null
	selectedDocument: string | null
	document: GetResponse | null
}

const defaultState: StateStore = {
	chroma: null,
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
		const chroma = stateStore.get().chroma!
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

configStore.subscribe(async (config, oldConfig) =>
{
	const state = stateStore.get()

	if (
		oldConfig &&
		config.confirmed === oldConfig.confirmed &&
		config.confirmed === (state.chroma !== null)
	)
	{
		// Nothing to do
		return
	}

	if (!config.confirmed)
	{
		// Logged out
		// Clear the Chroma client
		if (state.chroma)
		{
			stateStore.set({
				...state,
				chroma: null,
			})
		}
		return
	}

	const chroma = makeChromaClient(config.serverUrl, config.authConfig)
	if (!chroma)
	{
		// Failed to initialize Chroma client
		// Force logout
		configStore.set({
			...configStore.get(),
			confirmed: false,
		})

		if (state.chroma)
		{
			stateStore.set({
				...state,
				chroma: null,
			})
		}
	}

	// Set the Chroma client
	stateStore.set({
		...state,
		chroma: chroma,
	})
})

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
			const chroma = state.chroma!
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
