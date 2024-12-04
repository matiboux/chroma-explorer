<script lang="ts">
import { ChromaClient } from 'chromadb'
import type { GetResponse } from 'chromadb'

import { chromaStore } from '~/stores/chromaStore'
import { stateStore } from '~/stores/stateStore'

import type { Locales } from '~/i18n'
import { i18nFactory } from '~/i18n'
export let locale: Locales | undefined = undefined
const _ = i18nFactory(locale)

async function onDelete()
{
	try
	{
		const chroma = chromaStore.get()!
		await chroma.deleteCollection({
			name: $stateStore.collections[$stateStore.selectedCollection].name,
		})

		// Close form & clear collections list
		stateStore.set({
			...stateStore.get(),
			viewMode: null,
			collections: null,
		})
	}
	catch (error: unknown)
	{
		console.error(error)
	}
}

function onClose() {
	stateStore.set({
		...stateStore.get(),
		viewMode: null,
	})
}
</script>

<form
	class="delete-form"
	on:submit|preventDefault={onDelete}
>

	{#if !$stateStore.collections || !$stateStore.collections[$stateStore.selectedCollection]}
		<p class="hint">
			{_({
				en: 'Collection not found.',
				fr: 'Collection introuvable.',
			})}
		</p>

	{:else}

		<p>
			{_({
				en: 'Are you sure you want to delete the following collection?',
				fr: 'Êtes-vous sûr de vouloir supprimer la collection suivante ?',
			})}
		</p>

		<ul>
			<li>
				<strong>
					{_({
						en: 'ID',
						fr: 'ID',
					})}
				</strong>{_({
					en: ':',
					fr: ' :',
				})} <code>{$stateStore.collections[$stateStore.selectedCollection].id}</code>
			</li>
			<li>
				<strong>
					{_({
						en: 'Name',
						fr: 'Nom',
					})}
				</strong>{_({
					en: ':',
					fr: ' :',
				})} <code>{$stateStore.collections[$stateStore.selectedCollection].name}</code>
			</li>
		</ul>

		<div class="button-group">
			<button type="submit">
				{_({
					en: 'Delete collection',
					fr: 'Supprimer la collection',
				})}
			</button>
			<button type="button" on:click={onClose}>
				{_({
					en: 'Cancel',
					fr: 'Annuler',
				})}
			</button>
		</div>

	{/if}

</form>

<style lang="scss">
.delete-form {

	p, ul {
		@apply mb-2;

		strong {
			@apply font-semibold;
		}
	}

	p.hint {
		@apply text-sm text-gray-800;
	}

	ul {
		@apply list-disc pl-6;

		li {
			@apply mb-1;
		}
	}

	code {
		@apply bg-gray-100;
		@apply border border-gray-300 rounded;
		@apply px-1.5 py-0.5;
		@apply rounded;
		@apply font-mono;
	}

	.button-group {
		@apply flex gap-2 mb-3;

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
