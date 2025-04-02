import { persistentAtom } from '@nanostores/persistent'
import { atom } from 'nanostores'

export interface APIAuthConfig
{
	token: string
}

export interface BasicAuthConfig
{
	username: string
	password: string
}

export interface ConfigStore
{
	confirmed: boolean
	chromaApiVersion: 'v1' | 'v2'
	serverUrl: string
	authConfig: APIAuthConfig | BasicAuthConfig | null
}

const defaultConfig: ConfigStore = {
	confirmed: false,
	chromaApiVersion: 'v2',
	serverUrl: '',
	authConfig: null,
}

export const configPersistentStore = persistentAtom('config', JSON.stringify(defaultConfig))

export const configStore = atom<ConfigStore>(JSON.parse(configPersistentStore.get()))

configStore.listen((config) =>
	{
		configPersistentStore.set(JSON.stringify(config))
	})
