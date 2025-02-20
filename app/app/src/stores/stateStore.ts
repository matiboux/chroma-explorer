import { atom } from 'nanostores'
import type { CollectionParams, ChromaClient, GetResponse } from 'chromadb'

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
	documents: GetResponse | null // MultiGetResponse | null
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

async function getCollections(
	chroma: ChromaClient | null,
): Promise<Record<string, CollectionParams> | null>
{
	// Inputs: chroma

	if (!chroma)
	{
		// Chroma client not initialized

		// Clear collections list
		return null
	}

	// Get collections list
	const collections =
		(await chroma.listCollections())
		.sort((a: any, b: any) => a.name.localeCompare(b.name))
		.reduce<Record<string, CollectionParams>>(
			// FIXME: Fix types
			(collections, collection: any) =>
			{
				collections[collection.id as any] = collection
				return collections
			},
			{} as Record<string, CollectionParams>,
		)

	return collections
}

async function getCollection(
	chroma: ChromaClient | null,
	collections: Record<string, CollectionParams> | null,
	selectedCollection: string | null,
): Promise<Collection | null>
{
	// Inputs: chroma, collections, selectedCollection

	if (!chroma || !collections || !collections[selectedCollection!])
	{
		// Chroma client not initialized, or
		// Unknown selected collection

		// Clear the collection
		return null
	}

	// Get the selected collection
	const collection = await chroma.getCollection({
		name: collections[selectedCollection!]!.name,
		embeddingFunction: null!,
	})

	return collection
}

async function getDocuments(
	collection: Collection | null,
	loadDocuments: boolean,
): Promise<MultiGetResponse | null>
{
	// Inputs: collection, loadDocuments

	if (!collection || !loadDocuments)
	{
		// Collection not loaded, or
		// Load documents disabled

		// Clear the collection documents
		return null
	}

	// Get collection documents
	const documents = await collection.peek({
		limit: 100,
	})

	return documents
}

stateStore.subscribe(async (currentState, oldState) =>
{
	const state: StateStore = { ...currentState }
	let changes: boolean = false

	if (
		state.chroma !== (oldState?.chroma ?? defaultState.chroma) ||
		(state.chroma !== null && state.collections === null) // Force reload
	)
	{
		try
		{
			// Get collections list after input changes
			const collections = await getCollections(state.chroma)
			state.collections = collections
			state.selectedCollection = collections?.[state.selectedCollection!] ? state.selectedCollection : null
			changes = true
		}
		catch (error: any)
		{
			// Request error
			// Force logout
			configStore.set({
				...configStore.get(),
				confirmed: false,
			})
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
		try
		{
			// Get the collection after input changes
			const collection = await getCollection(state.chroma, state.collections, state.selectedCollection)
			state.collection = collection
			changes = true
		}
		catch (error: any)
		{
			// Request error
			// Force logout
			configStore.set({
				...configStore.get(),
				confirmed: false,
			})
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
		try
		{
			const documents = await getDocuments(state.collection, state.loadDocuments)
			state.documents = documents
			changes = true
		}
		catch (error: any)
		{
			// Request error
			// Force logout
			configStore.set({
				...configStore.get(),
				confirmed: false,
			})
			return
		}
	}

	if (changes)
	{
		// Apply changes
		stateStore.set(state)
	}
})
