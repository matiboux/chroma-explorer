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
	serverUrl: string
	authConfig: APIAuthConfig | BasicAuthConfig | null
}

export const configStore = atom<ConfigStore>({
	serverUrl: '',
	authConfig: null,
})
