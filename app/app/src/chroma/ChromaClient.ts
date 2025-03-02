import { ChromaClient as BaseChromaClient, Collection, DefaultEmbeddingFunction } from 'chromadb'
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
			return response['nanosecond heartbeat']!
		}
		else
		{
			return this.client.heartbeat()
		}
	}

	async createCollection(
		args: Parameters<BaseChromaClient['createCollection']>[0],
	): ReturnType<BaseChromaClient['createCollection']>
	{
		if (this.apiVersion === 'v1')
		{
			// await this.client.init()
			const response = await this.client.api.createCollectionV1(
				this.client.tenant,
				this.client.database,
				{
					name: args.name,
					configuration: null,
					metadata: args.metadata!,
				},
				this.client.api.options,
			)
			return new Collection(
				(response as any).name,
				(response as any).id,
				this.client,
				args.embeddingFunction ?? new DefaultEmbeddingFunction(),
				(response as any).metadata,
			)
		}
		else
		{
			return this.client.createCollection(args)
		}
	}

	async getOrCreateCollection(
		args: Parameters<BaseChromaClient['getOrCreateCollection']>[0],
	): ReturnType<BaseChromaClient['getOrCreateCollection']>
	{
		if (this.apiVersion === 'v1')
		{
			// await this.client.init()
			const response = await this.client.api.createCollectionV1(
				this.client.tenant,
				this.client.database,
				{
					name: args.name,
					configuration: null,
					metadata: args.metadata!,
					get_or_create: true,
				},
				this.client.api.options,
			)
			return new Collection(
				(response as any).name,
				(response as any).id,
				this.client,
				args.embeddingFunction ?? new DefaultEmbeddingFunction(),
				(response as any).metadata,
			)
		}
		else
		{
			return this.client.getOrCreateCollection(args)
		}
	}

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
			return (collections as any).map((collection: any) => collection.name)
		}
		else
		{
			return this.client.listCollections(args)
		}
	}

	// listCollectionsAndMetadata
	// countCollections

	async getCollection(
		args: Parameters<BaseChromaClient['getCollection']>[0],
	): ReturnType<BaseChromaClient['getCollection']>
	{
		if (this.apiVersion === 'v1')
		{
			// await this.client.init()
			const response = await this.client.api.getCollectionV1(
				args.name,
				this.client.tenant,
				this.client.database,
				this.client.api.options,
			)
			return new Collection(
				(response as any).name,
				(response as any).id,
				this.client,
				args.embeddingFunction,
				(response as any).metadata,
			)
		}
		else
		{
			return this.client.getCollection(args)
		}
	}
}
