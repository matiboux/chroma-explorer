<script lang="ts">
import type { CollectionParams } from 'chromadb'

import { configStore } from '~/stores/configStore'
import { stateStore } from '~/stores/stateStore'

import type { Locales } from '~/i18n'
import { i18nFactory } from '~/i18n'
export let locale: Locales | undefined = undefined
const _ = i18nFactory(locale)

export let loginRedirect: string = ''

let checked: boolean = false
let version: string | null = null
let collections: CollectionParams[] | null = null

stateStore.subscribe(async (state, oldState) =>
{
	if (checked && state.chroma === oldState?.chroma)
	{
		return
	}

	checked = false
	version = null
	collections = null

	if (!state.chroma)
	{
		checked = true
		return
	}

	try
	{
		version = await state.chroma.version()
		collections = await state.chroma.listCollections()

		// stateStore.set({ collections: collections })
	}
	catch (error: unknown)
	{}
	finally
	{
		checked = true

		if (!collections)
		{
			// Force logout
			configStore.set({
				...configStore.get(),
				confirmed: false,
			})
		}
		else if (loginRedirect)
		{
			window.location.href = loginRedirect
		}
	}
})
</script>

{#if checked}
	{#if version === null}
		<p class="text-error">
			<span class="icon icon-[mdi--alert-outline] icon-align"></span>
			{_({
				'en': 'Failed to connect to Chroma server. Please check the server URL or CORS settings.',
				'fr': 'Échec de la connexion au serveur Chroma. Veuillez vérifier l\'URL du serveur ou les paramètres CORS.',
			})}
		</p>
	{:else if collections === null}
		<p class="text-error">
			<span class="icon icon-[mdi--alert-outline] icon-align"></span>
			{_({
				'en': 'Failed to authenticate with Chroma server. Please check your credentials.',
				'fr': 'Échec de l\'authentification avec le serveur Chroma. Veuillez vérifier vos identifiants.',
			})}
		</p>
	{:else}
		<p class="text-success">
			<span class="icon icon-[mdi--check-circle-outline] icon-align"></span>
			{_({
				'en': 'Connected to Chroma server. Redirecting...',
				'fr': 'Connecté au serveur Chroma. Redirection...',
			})}
		</p>
	{/if}
{/if}

<style lang="scss">
@reference '~/styles/tailwind.css';

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
