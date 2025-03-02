import { ChromaClient as BaseChromaClient } from 'chromadb'
import type { ChromaClientParams } from 'chromadb'

export class ChromaClient
{
	apiVersion: 'v1' | 'v2'
	client: BaseChromaClient

	constructor(
		clientOptions: ChromaClientParams = {},
		apiVersion: 'v1' | 'v2' = 'v2',
	)
	{
		this.apiVersion = apiVersion
		this.client = new BaseChromaClient(clientOptions)
	}

	async version(): ReturnType<BaseChromaClient['version']>
	{
		if (this.apiVersion === 'v1')
		{
			return this.client.api.getV1Version(this.client.api.options)
		}
		else
		{
			return this.client.version()
		}
	}

	async heartbeat(): ReturnType<BaseChromaClient['heartbeat']>
	{
		if (this.apiVersion === 'v1')
		{
			const response = await this.client.api.getV1Heartbeat(this.client.api.options)
			return response['nanosecond heartbeat']!;
		}
		else
		{
			return this.client.heartbeat()
		}
	}

	// async createCollection(args: Parameters<BaseChromaClient['createCollection']>[0])
	// {
	// 	if (this.apiVersion === 'v1')
	// 	{
	// 		// return this.client.api.createCollectionV1(

	// 		// )
	// 	}
	// 	else
	// 	{
	// 		return this.client.createCollection(args)
	// 	}
	// }

	// getOrCreateCollection

	async listCollections(
		args?: Parameters<BaseChromaClient['listCollections']>[0],
	): ReturnType<BaseChromaClient['listCollections']>
	{
		if (this.apiVersion === 'v1')
		{
			const collections = await this.client.api.listCollectionsV1(
				undefined,
				undefined,
				this.client.tenant,
				this.client.database,
				this.client.api.options,
			)
			return (collections as any).map((collection: any) => collection.name);
		}
		else
		{
			return this.client.listCollections(args)
		}
	}

	// listCollectionsAndMetadata
}

// return new ChromaClient({
// 	path: serverUrl,
// 	...(
// 		isAPIAuthConfig(authConfig)
// 		? ({
// 			auth: {
// 				provider: 'token',
// 				credentials: authConfig.token,
// 			},
// 		})
// 		: isBasicAuthConfig(authConfig)
// 		? ({
// 			auth: {
// 				provider: 'basic',
// 				credentials: {
// 					username: authConfig.username,
// 					password: authConfig.password,
// 				},
// 			},
// 		})
// 		: undefined
// 	),
// })
