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

class ResetException extends Error {}

async function reloadCollections(
	chroma: ChromaClient | null,
	currentState: StateStore,
): Promise<boolean>
{
	// Inputs: chroma
	try
	{
		if (!chroma)
		{
			// Chroma client not initialized
			if (currentState.collections)
			{
				// Clear collections list
				throw new ResetException()
			}

			return false
		}

		// Load collections list
		const collections =
			(await chroma.listCollections())
			.reduce<Record<string, CollectionParams>>(
				(collections, collection) =>
				{
					collections[collection.id] = collection
					return collections
				},
				{} as Record<string, CollectionParams>,
			)

		stateStore.set({
			...stateStore.get(),
			collections: collections,
			selectedCollection: collections[currentState.selectedCollection!] ? currentState.selectedCollection : null,
		})
		return true
	}
	catch (error: unknown)
	{
		// Reset collections list, or failed to reload collections list
		stateStore.set({
			...currentState,
			collections: null,
			selectedCollection: null,
		})
		return true
	}
}

async function reloadCollection(
	chroma: ChromaClient | null,
	collections: Record<string, CollectionParams> | null,
	selectedCollection: string | null,
	currentState: StateStore,
): Promise<boolean>
{
	// Inputs: chroma, collections, selectedCollection
	try
	{
		if (!selectedCollection)
		{
			if (currentState.collection)
			{
				// Clear the collection
				throw new ResetException()
			}

			return false
		}

		if (!chroma || !collections)
		{
			// Chroma client not initialized
			if (currentState.collection)
			{
				// Clear the collection
				throw new ResetException()
			}

			return false
		}

		// Load the selected collection
		const collection = await chroma.getCollection({
			name: collections[selectedCollection!]!.name,
			embeddingFunction: null!,
		})

		stateStore.set({
			...currentState,
			collection: collection,
		})
		return true
	}
	catch (error: unknown)
	{
		// Reset the collection, or failed to reload the collection
		stateStore.set({
			...currentState,
			collection: null,
		})
		return true
	}
}

stateStore.subscribe(async (state, oldState) =>
{
	if (
		state.chroma !== (oldState?.chroma ?? defaultState.chroma)
	)
	{
		// Reload collections list after input changes
		if (await reloadCollections(
			state.chroma,
			state, // currentState
		))
		{
			// Collections list reloaded, stop here
			return
		}
	}

	if (
		state.chroma !== (oldState?.chroma ?? defaultState.chroma) ||
		state.collections !== (oldState?.collections ?? defaultState.collections) ||
		state.selectedCollection !== (oldState?.selectedCollection ?? defaultState.selectedCollection)
	)
	{
		// Reload the collection after input changes
		if (await reloadCollection(
			state.chroma,
			state.collections,
			state.selectedCollection,
			state, // currentState
		))
		{
			// Collection reloaded, stop here
			return
		}
	}
})
