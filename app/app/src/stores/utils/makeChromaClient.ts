import { ChromaClient as ChromaClientV1 } from 'chromadb-v1'
import { ChromaClient as ChromaClientV2 } from 'chromadb-v2'

import type { ConfigStore, APIAuthConfig, BasicAuthConfig } from '~/stores/configStore'

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
	apiVersion: 'v1' | 'v2',
	serverUrl: string,
	authConfig: ConfigStore['authConfig'],
	tenant: string | null,
	database: string | null,
): ChromaClientV1 | ChromaClientV2 | null
{
	try
	{
		const chromaClientClass = apiVersion === 'v1' ? ChromaClientV1 : ChromaClientV2

		return new chromaClientClass({
			path: serverUrl,
			...(
				isAPIAuthConfig(authConfig)
				? {
					auth: {
						provider: 'token',
						credentials: authConfig.token,
					},
				}
				: isBasicAuthConfig(authConfig)
				? {
					auth: {
						provider: 'basic',
						credentials: {
							username: authConfig.username,
							password: authConfig.password,
						},
					},
				}
				: {}
			),
			...(tenant != null ? { tenant } : {}),
			...(database != null ? { database } : {}),
		})
	}
	catch (error: unknown)
	{
		return null
	}
}
