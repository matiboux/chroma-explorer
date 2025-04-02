import { atom } from 'nanostores'
import { ChromaClient as ChromaClientV1 } from 'chromadb-v1'
import { ChromaClient as ChromaClientV2 } from 'chromadb-v2'
import type { CollectionParams as CollectionParamsV1, GetResponse as GetResponseV1 } from 'chromadb-v1'
import type { GetResponse as GetResponseV2 } from 'chromadb-v2'
type ChromaClient = ChromaClientV1 | ChromaClientV2
type CollectionParams = CollectionParamsV1 | Awaited<ReturnType<ChromaClientV2['listCollectionsAndMetadata']>>[0]
type GetResponse = GetResponseV1 | GetResponseV2

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

	const chroma = makeChromaClient(config.chromaApiVersion, config.serverUrl, config.authConfig)
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
	chroma: ChromaClient,
): Promise<Record<string, CollectionParams> | null>
{
	const collections =
		(chroma instanceof ChromaClientV1
			? await chroma.listCollections()
			: await chroma.listCollectionsAndMetadata())
		.sort((a: any, b: any) => a.name.localeCompare(b.name))
		.reduce<Record<string, CollectionParams>>(
			// FIXME: Fix types
			(collections, collection) =>
			{
				collections[collection.id] = collection
				return collections
			},
			{} as Record<string, CollectionParams>,
		)

	return collections
}

async function getCollection(
	chroma: ChromaClient,
	collections: Record<string, CollectionParams>,
	selectedCollection: string,
): Promise<Collection | null>
{
	if (!collections[selectedCollection!])
	{
		// Invalid selected collection
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
	collection: Collection,
): Promise<GetResponse> // Promise<MultiGetResponse>
{
	// Get collection documents
	const documents = await collection.peek({
		limit: 100,
	})

	return documents
}

function hasStateChanged(
	currentState: StateStore,
	oldState: StateStore | undefined,
	stateKey: keyof StateStore,
): boolean
{
	return currentState[stateKey] !== (oldState?.[stateKey] ?? defaultState[stateKey])
}

stateStore.subscribe(async (currentState, oldState) =>
{
	const state: StateStore = { ...currentState }
	let changes: boolean = false

	if (hasStateChanged(state, oldState, 'chroma'))
	{
		// Chroma client changed
		// Reset dependant state.collections
		state.collections = defaultState.collections
		changes = true
	}

	if (state.collections === null && state.chroma)
	{
		try
		{
			// Get collections list
			state.collections = await getCollections(state.chroma)
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

	let changedSelectedCollection = hasStateChanged(state, oldState, 'selectedCollection')

	if (hasStateChanged(state, oldState, 'collections'))
	{
		// Collections list changed
		// Force checking selected collection
		changedSelectedCollection = true

		// if (!state.collections?.[state.selectedCollection!])
		// {
		// 	// Selected collection is not in the collections list
		// 	// Reset dependant state.selectedCollection
		// 	state.selectedCollection = defaultState.selectedCollection
		// }

		// // Reset dependant state.collection
		// state.collection = defaultState.collection

		// // Reset dependant state.documents
		// state.documents = defaultState.documents

		// // Reset dependant state.selectedDocument
		// state.selectedDocument = defaultState.selectedDocument

		// // Reset dependant state.document
		// state.document = defaultState.document

		// // Reset dependant state.loadDocuments
		// state.loadDocuments = defaultState.loadDocuments

		// // Reset dependant state.modalViewMode
		// state.modalViewMode = defaultState.modalViewMode

		// // Reset dependant state.contentViewMode
		// state.contentViewMode = defaultState.contentViewMode

		// changes = true
	}

	if (changedSelectedCollection)
	{
		// Collections list changed, or selected collection changed

		if (!state.collections?.[state.selectedCollection!])
		{
			// Selected collection is not in the collections list
			// Reset invalid state.selectedCollection
			state.selectedCollection = defaultState.selectedCollection
			changes = true
		}

		// Reset dependant state.collection
		state.collection = defaultState.collection

		changes = true
	}

	if (state.collection === null && state.chroma && state.collections && state.selectedCollection)
	{
		try
		{
			// Get the collection
			state.collection = await getCollection(state.chroma, state.collections, state.selectedCollection)
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

	if (hasStateChanged(state, oldState, 'collection'))
	{
		// Collection changed
		// Reset dependant state.documents
		state.documents = defaultState.documents
		changes = true
	}

	if (state.documents === null && state.collection && state.loadDocuments)
	{
		try
		{
			// Get collection documents
			state.documents = await getDocuments(state.collection)
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

	// let changedSelectedDocument = hasStateChanged(state, oldState, 'selectedDocument')

	if (hasStateChanged(state, oldState, 'documents'))
	{
		// Documents list changed

		// // Force checking selected document
		// changedSelectedDocument = true

		// Reset dependant state.selectedDocument
		state.selectedDocument = defaultState.selectedDocument

		// Reset dependant state.document
		state.document = defaultState.document

		// Reset dependant state.modalViewMode
		state.modalViewMode = defaultState.modalViewMode

		// Reset dependant state.contentViewMode
		state.contentViewMode = defaultState.contentViewMode

		changes = true
	}

	// if (changedSelectedDocument)
	// {
	// 	// Documents list changed, or selected document changed

	// 	if (!state.documents?.ids?.includes(state.selectedDocument!))
	// 	{
	// 		// Selected document is not in the documents list
	// 		// Reset invalid state.selectedDocument
	// 		state.selectedDocument = defaultState.selectedDocument
	// 		changes = true
	// 	}

	// 	// Reset dependant state.document
	// 	state.document = defaultState.document

	// 	changes = true
	// }

	// if (state.document === null && state.documents && state.selectedDocument)
	// {
	// 	// Get the selected document
	// 	// ...
	// }

	// if (hasStateChanged(state, oldState, 'document'))
	// {
	// 	// Document changed
	// 	// ...
	// }

	if (changes)
	{
		// Apply changes
		stateStore.set(state)
	}
})
