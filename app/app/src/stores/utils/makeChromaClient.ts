import { ChromaClient } from 'chromadb'

import type { ConfigStore } from '~/stores/configStore'

export function makeChromaClient(
	serverUrl: string,
	authConfig: ConfigStore['authConfig'],
): ChromaClient | null
{
	try
	{
		return new ChromaClient({
			path: serverUrl,
			...(
				authConfig
				? (
					authConfig.token
					? ({
						auth: {
							provider: 'token',
							credentials: authConfig.token,
						},
					})
					: authConfig.username && authConfig.password
					? ({
						auth: {
							provider: 'basic',
							credentials: {
								username: authConfig.username,
								password: authConfig.password,
							},
						},
					})
					: undefined
				)
				: undefined
			),
		})
	}
	catch (error: unknown)
	{
		return null
	}
}
