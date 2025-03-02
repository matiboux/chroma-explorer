import type { ConfigStore, APIAuthConfig, BasicAuthConfig } from '~/stores/configStore'
import { ChromaClient } from '~/chroma/ChromaClient'

function isAPIAuthConfig(
	authConfig: ConfigStore['authConfig'],
): authConfig is APIAuthConfig
{
	return authConfig != null && 'token' in authConfig
}

function isBasicAuthConfig(
	authConfig: ConfigStore['authConfig'],
): authConfig is BasicAuthConfig
{
	return authConfig != null && 'username' in authConfig && 'password' in authConfig
}

export function makeChromaClient(
	serverUrl: string,
	apiVersion: 'v1' | 'v2' | null,
	authConfig: ConfigStore['authConfig'],
): ChromaClient | null
{
	try
	{
		return new ChromaClient(
			{
				path: serverUrl,
				...(
					isAPIAuthConfig(authConfig)
					? ({
						auth: {
							provider: 'token',
							credentials: authConfig.token,
						},
					})
					: isBasicAuthConfig(authConfig)
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
				),
			},
			apiVersion ?? undefined,
		)
	}
	catch (error: unknown)
	{
		return null
	}
}
