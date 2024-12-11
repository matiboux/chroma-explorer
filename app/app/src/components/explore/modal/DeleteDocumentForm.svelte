<script lang="ts">
import { ChromaClient } from 'chromadb'
import type { GetResponse } from 'chromadb'

import { stateStore } from '~/stores/stateStore'

import type { Locales } from '~/i18n'
import { i18nFactory } from '~/i18n'
export let locale: Locales | undefined = undefined
const _ = i18nFactory(locale)

async function onDelete()
{
	const state = stateStore.get()

	if (!state.collection || !state.selectedDocument)
	{
		alert(_({
			en: 'Document not found.',
			fr: 'Document introuvable.',
		}))
		return
	}

	try
	{
		await state.collection.delete({
			ids: [ state.selectedDocument ],
		})

		// Close form & clear documents list
		stateStore.set({
			...stateStore.get(),
			modalViewMode: null,
			documents: null,
			selectedDocument: null,
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
		modalViewMode: null,
	})
}
</script>

<form
	class="delete-form"
	on:submit|preventDefault={onDelete}
>

	{#if !$stateStore.collection || !$stateStore.selectedDocument}
		<p class="hint">
			{_({
				en: 'Document not found.',
				fr: 'Document introuvable.',
			})}
		</p>

	{:else}

		<p>
			{_({
				en: 'Are you sure you want to delete the following document?',
				fr: 'Êtes-vous sûr de vouloir supprimer le document suivant ?',
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
				})} <code>{$stateStore.selectedDocument}</code>
			</li>
		</ul>

		<div class="button-group">
			<button type="submit">
				<span class="icon icon-[mdi--delete] icon-align"></span>
				{_({
					en: 'Delete document',
					fr: 'Supprimer le document',
				})}
			</button>
			<button type="button" on:click={onClose}>
				<span class="icon icon-[mdi--close] icon-align"></span>
				{_({
					en: 'Close',
					fr: 'Fermer',
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
		@apply flex gap-2 mt-3;

		button {
			@apply px-4 py-2 bg-gray-500 text-white rounded;
			@apply transition-colors duration-200 ease-in-out;

			&:hover {
				@apply bg-gray-600;
			}

			&:active {
				@apply bg-gray-700;
			}

			&[type='submit'] {
				@apply bg-red-600;

				&:hover {
					@apply bg-red-700;
				}

				&:active {
					@apply bg-red-800;
				}
			}
		}
	}
}
</style>
