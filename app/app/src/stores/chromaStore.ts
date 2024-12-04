import { atom } from 'nanostores'
import { ChromaClient } from 'chromadb'

import { configStore } from '~/stores/configStore'
import type { ConfigStore } from '~/stores/configStore'

export const chromaStore = atom<ChromaClient | null>(null)

function makeChromaClient(config?: ConfigStore | undefined): ChromaClient | null
{
	if (!config)
	{
		config = configStore.get()
	}

	try
	{
		const chroma = new ChromaClient({
			path: config.serverUrl,
			...(
				config.authConfig
				? (
					config.authConfig.token
					? ({
						auth: {
							provider: 'token',
							credentials: config.authConfig.token,
						},
					})
					: config.authConfig.username && config.authConfig.password
					? ({
						auth: {
							provider: 'basic',
							credentials: {
								username: config.authConfig.username,
								password: config.authConfig.password,
							},
						},
					})
					: undefined
				)
				: undefined
			),
		})
		return chroma
	}
	catch (error: unknown)
	{
		return null
	}
}

configStore.subscribe(async (config) =>
{
	if (!config.confirmed)
	{
		return
	}

	const chroma = makeChromaClient(config)
	if (!chroma)
	{
		// Force logout
		configStore.set({
			...configStore.get(),
			confirmed: false,
		})
		chromaStore.set(null)
	}

	chromaStore.set(chroma)
})
