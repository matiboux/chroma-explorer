<script lang="ts">
import { ChromaClient } from 'chromadb'
import type { GetResponse } from 'chromadb'

import { stateStore } from '~/stores/stateStore'

import type { Locales } from '~/i18n'
import { i18nFactory } from '~/i18n'
export let locale: Locales | undefined = undefined
const _ = i18nFactory(locale)

// Generate a random suffix for id attributes
const idSuffix = Math.random().toString(36).substring(2)

const formData = {
	name: '',
	hnswSpace: '',
	tenant: 'default',
	database: 'default',
}

async function onSubmit()
{
	try
	{
		const chroma = stateStore.get().chroma!

		if (formData.hnswSpace)
		{
			formData.hnswSpace = formData.hnswSpace.trim()
		}

		const response = await chroma.createCollection({
			name: formData.name,
			...(
				formData.hnswSpace
				? {
					metadata: {
						'hnsw:space': formData.hnswSpace.trim(),
					},
				}
				: {}
			),
		})

		if (response)
		{
			// Close form & clear collections list
			stateStore.set({
				...stateStore.get(),
				modalViewMode: null,
				collections: null,
			})
		}
	}
	catch (error: unknown)
	{}
}

function onClose() {
	stateStore.set({
		...stateStore.get(),
		modalViewMode: null,
	})
}
</script>

<form
	class="create-form"
	on:submit|preventDefault={onSubmit}
>

	<div class="input-group">
		<label for={`collection-name-${idSuffix}`}>
			{_({
				en: 'Collection name',
				fr: 'Nom de la collection',
			})}
		</label>
		<input
			type="text" id={`collection-name-${idSuffix}`} name="collection-name"
			placeholder="collection-name"
			bind:value={formData.name}
		/>
	</div>

	<div class="input-group">
		<label for={`hnsw-space-${idSuffix}`}>
			{_({
				en: 'HNSW space',
				fr: 'Espace HNSW',
			})}
		</label>
		<input
			type="text" id={`hnsw-space-${idSuffix}`} name="hnsw-space"
			placeholder="l2 / ip / cosine"
			bind:value={formData.hnswSpace}
		/>
	</div>

	<!--
	<div class="input-group">
		<label for={`tenant-${idSuffix}`}>
			{_({
				en: 'Tenant',
				fr: 'Locataire',
			})}
		</label>
		<input
			type="text" id={`tenant-${idSuffix}`} name="tenant" disabled
			placeholder="default"
			bind:value={formData.tenant}
		/>
	</div>

	<div class="input-group">
		<label for={`database-${idSuffix}`}>
			{_({
				en: 'Database',
				fr: 'Base de données',
			})}
		</label>
		<input
			type="text" id={`database-${idSuffix}`} name="database" disabled
			placeholder="default"
			bind:value={formData.database}
		/>
	</div>
	-->

	<div class="button-group">
		<button type="submit">
			{_({
				en: 'Create collection',
				fr: 'Créer la collection',
			})}
		</button>
		<button type="button" on:click={onClose}>
			{_({
				en: 'Cancel',
				fr: 'Annuler',
			})}
		</button>
	</div>

</form>

<style lang="scss">
@reference "tailwindcss/theme";

.create-form {
	// @apply flex flex-col gap-4;

	.input-group, .button-group {
		@apply mb-3;
	}

	.input-group {
		// @apply flex flex-col gap-2;

		label {
			@apply block font-semibold mb-1;
		}

		input, textarea {
			@apply bg-gray-100 w-full p-2 text-black;
			@apply border border-gray-300 rounded;
			@apply resize-y;

			&::placeholder {
				@apply text-gray-400;
			}

			&:disabled {
				@apply bg-gray-200 text-gray-700;
			}
		}

		textarea {
			@apply h-32;
		}
	}

	.button-group {
		@apply flex gap-2;

		button {
			@apply px-4 py-2 bg-gray-600 text-white rounded;
			@apply transition-colors duration-200 ease-in-out;

			&:hover {
				@apply bg-gray-700;
			}

			&:active {
				@apply bg-gray-800;
			}

			&[type='submit'] {
				@apply bg-blue-600;

				&:hover {
					@apply bg-blue-700;
				}

				&:active {
					@apply bg-blue-800;
				}
			}
		}
	}
}
</style>
