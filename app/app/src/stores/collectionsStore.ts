import { atom } from 'nanostores'
import type { CollectionParams } from 'chromadb'

export interface CollectionsStore
{
	collections: CollectionParams[] | null
}

const defaultValue: CollectionsStore = {
	collections: null,
}

export const collectionsStore = atom<CollectionsStore>(defaultValue)
