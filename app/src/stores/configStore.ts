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
	apiVersion: 'v1' | 'v2'
	serverUrl: string
	authConfig: APIAuthConfig | BasicAuthConfig | null
	tenant: string | null
	database: string | null
}

const defaultConfig: ConfigStore = {
	confirmed: false,
	apiVersion: 'v2',
	serverUrl: '',
	authConfig: null,
	tenant: null,
	database: null,
}

export const configPersistentStore = persistentAtom('config', JSON.stringify(defaultConfig))

export const configStore = atom<ConfigStore>(JSON.parse(configPersistentStore.get()))

configStore.listen((config) =>
	{
		configPersistentStore.set(JSON.stringify(config))
	})
