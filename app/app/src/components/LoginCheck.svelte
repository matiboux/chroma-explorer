<script lang="ts">
import { ChromaClient } from 'chromadb'

import { configStore } from '~/stores/configStore'

export let connectedRedirect: string = ''

let checked: boolean = false
let version: string | null = null
let collections: string[] | null = null

configStore.subscribe(async (config) =>
{
	checked = false
	version = null
	collections = null

	if (!config.serverUrl)
	{
		return
	}

	try
	{
		const chroma = new ChromaClient({
			path: config.serverUrl,
			auth: (
				config.authConfig
				? (
					config.authConfig.token
					? ({
						provider: 'token',
						credentials: config.authConfig.token,
					})
					: config.authConfig.username && config.authConfig.password
					? ({
						provider: 'basic',
						credentials: {
							username: config.authConfig.username,
							password: config.authConfig.password,
						},
					})
					: undefined
				)
				: undefined
			),
		})

		version = await chroma.version()
		collections = await chroma.listCollections()
	}
	catch (error: unknown)
	{}
	finally
	{
		checked = true
	}

	if (checked && collections !== null)
	{
		alert('Connected to ChromaDB server.')
	}
})

</script>

{#if checked}
	{#if version === null}
		<p class="text-error">
			<span class="icon icon-[mdi--alert-outline] icon-align"></span>
			Failed to connect to ChromaDB server. Please check the server URL.
		</p>
	{:else if collections === null}
		<p class="text-error">
			<span class="icon icon-[mdi--alert-outline] icon-align"></span>
			Failed to authenticate with ChromaDB server. Please check your credentials.
		</p>
	{:else}
		<p class="text-success">
			<span class="icon icon-[mdi--check-circle-outline] icon-align"></span>
			Connected to ChromaDB server. Redirecting...
		</p>
	{/if}
{/if}

<style lang="scss">
	.text-success, .text-error {
		@apply text-sm;
	}

	.text-success {
		@apply text-green-700;
	}

	.text-error {
		@apply text-red-700;
	}
</style>
