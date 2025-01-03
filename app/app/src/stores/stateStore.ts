import { atom } from 'nanostores'
import type { CollectionParams, ChromaClient, GetResponse, MultiGetResponse } from 'chromadb'

import { configStore } from '~/stores/configStore'
import type ModalViewMode from '~/types/ModalViewMode.d.ts'
import type ContentViewMode from '~/types/ContentViewMode.d.ts'
import { makeChromaClient } from './utils/makeChromaClient'

type Collection = Awaited<ReturnType<ChromaClient['getCollection']>>

export interface StateStore
{
	chroma: ChromaClient | null
	collections: Record<string, CollectionParams> | null
	selectedCollection: string | null
	collection: Collection | null
	loadDocuments: boolean
	documents: MultiGetResponse | null
	selectedDocument: string | null
	document: GetResponse | null
	modalViewMode: ModalViewMode | null
	contentViewMode: ContentViewMode | null
}

const defaultState: StateStore = {
	chroma: null,
	collections: null,
	selectedCollection: null,
	collection: null,
	loadDocuments: false,
	documents: null,
	selectedDocument: null,
	document: null,
	modalViewMode: null,
	contentViewMode: null,
}

export const stateStore = atom<StateStore>(defaultState)

configStore.subscribe(async (config, oldConfig) =>
{
	const state = stateStore.get()

	if (
		oldConfig !== undefined &&
		config.confirmed === (state.chroma !== null)
	)
	{
		// Nothing to do
		return
	}

	if (!config.confirmed)
	{
		// Logged out

		// state.chroma is set
		// Clear the Chroma client
		stateStore.set({
			...state,
			chroma: null,
		})

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
		return
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
			.sort((a, b) => a.name.localeCompare(b.name))
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
	catch (error: any)
	{
		if (error.name === 'ChromaConnectionError')
		{
			// Force logout
			configStore.set({
				...configStore.get(),
				confirmed: false,
			})
			return false
		}

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
		if (!chroma || !collections || !collections[selectedCollection!])
		{
			// Chroma client not initialized, or
			// Unknown selected collection
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

async function reloadDocuments(
	collection: Collection | null,
	loadDocuments: boolean,
	currentState: StateStore,
): Promise<boolean>
{
	// Inputs: collection
	try
	{
		if (!collection || !loadDocuments)
		{
			// Collection not loaded, or
			// Load documents disabled
			if (currentState.documents)
			{
				// Clear the collection
				throw new ResetException()
			}

			return false
		}

		// Load collection documents
		const documents = await collection.peek({
			limit: 100,
		})

		stateStore.set({
			...currentState,
			documents: documents,
		})
		return true
	}
	catch (error: unknown)
	{
		// Reset collection documents, or failed to reload collection documents
		stateStore.set({
			...currentState,
			documents: null,
		})
		return true
	}
}

stateStore.subscribe(async (state, oldState) =>
{
	if (
		state.chroma !== (oldState?.chroma ?? defaultState.chroma) ||
		(state.chroma !== null && state.collections === null) // Force reload
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
		state.selectedCollection !== (oldState?.selectedCollection ?? defaultState.selectedCollection) ||
		(state.selectedCollection !== null && state.collection === null) // Force reload
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

	if (
		state.collection !== (oldState?.collection ?? defaultState.collection) ||
		state.loadDocuments !== (oldState?.loadDocuments ?? defaultState.loadDocuments) ||
		(state.loadDocuments && state.documents === null) // Force reload
	)
	{
		// Reload collection documents after input changes
		if (await reloadDocuments(
			state.collection,
			state.loadDocuments,
			state, // currentState
		))
		{
			// Collection documents reloaded, stop here
			return
		}
	}
})
