<script lang="ts">
import { stringify } from 'csv-stringify/browser/esm'

import { stateStore } from '~/stores/stateStore'

import type { Locales } from '~/i18n'
import { i18nFactory } from '~/i18n'
export let locale: Locales | undefined = undefined
const _ = i18nFactory(locale)

// Generate a random suffix for id attributes
const idSuffix = Math.random().toString(36).substring(2)

const formData = {
	downloadAll: false,
}

async function stringifyDataCsv(data: any[]): Promise<string>
{
	return new Promise((resolve, reject) =>
	{
		stringify(
			data,
			{
				delimiter: ',',
				header: true,
			},
			(error, output) =>
			{
				if (error)
				{
					reject(error)
				}
				else
				{
					resolve(output)
				}
			}
		)
	})
}

async function onSubmitDownload()
{
	const state = stateStore.get()
	if (!state.collection)
	{
		alert('No collection selected')
		return
	}

	if (!formData.downloadAll)
	{
		alert('Downloading not all documents is not yet supported')
		return
	}

	const documents = (await state.collection.get({
		include: [ 'documents', 'embeddings', 'metadatas' ],
	}))

	const records = documents.ids.map(
		(id, index) => ({
			id: id,
			document: documents.documents[index] || null,
			embedding: documents.embeddings[index] ? JSON.stringify(documents.embeddings[index]) : null,
			metadata: documents.metadatas[index] ? JSON.stringify(documents.metadatas[index]) : {},
		})
	)

	const csv = await stringifyDataCsv(records)

	// Download CSV file
	const blob = new Blob([csv], { type: 'text/csv' })
	const url = URL.createObjectURL(blob)
	const linkElement = document.createElement('a')
	linkElement.setAttribute('href', url)
	linkElement.setAttribute('download', `${state.collection.name}_${new Date().toISOString()}.csv`)
	linkElement.style.setProperty('display', 'none')
	document.body.appendChild(linkElement)
	linkElement.click()
	document.body.removeChild(linkElement)

	// Close modal
	stateStore.set({
		...stateStore.get(),
		modalViewMode: null,
	})
}
</script>

<form class="download-documents-form" on:submit|preventDefault={onSubmitDownload}>

	<div class="input-group">
		<div class="radio-group">
			<input
				id={`input-download-all-${idSuffix}`}
				type="checkbox" name="downloadAll"
				bind:checked={formData.downloadAll}
			/>
			<label for={`input-download-all-${idSuffix}`}>
				{_({
					en: 'Download all documents',
					fr: 'Télécharger tous les documents',
				})}
			</label>
		</div>
	</div>

	<div class="button-group">
		<button type="submit">
			{_({
				en: 'Download documents',
				fr: 'Télécharger les documents',
			})}
		</button>

		<button type="reset">
			{_({
				en: 'Reset form',
				fr: 'Réinitialiser le formulaire',
			})}
		</button>
	</div>

</form>

<style>
@reference "tailwindcss/theme";

.download-documents-form {

	> * + * {
		@apply mt-2;
	}

	p {
		strong {
			@apply font-semibold;
		}

		&.hint {
			@apply text-sm text-gray-800;
		}
	}

	code {
		@apply bg-gray-100;
		@apply border border-gray-300 rounded;
		@apply px-1.5 py-0.5;
		@apply rounded;
		@apply font-mono;
	}

	.input-group {
		> * + * {
			@apply mt-2;
		}

		&[hidden] {
			@apply hidden;
		}

		label {
			@apply font-semibold;
		}

		.copy-button {
			@apply inline-block;
			@apply ml-1 px-2 py-0.5 rounded-full;
			@apply text-sm font-normal;
			@apply text-gray-600 active:text-gray-700;
			@apply bg-gray-50 hover:bg-gray-100 active:bg-gray-200;

			&.copied {
				@apply bg-green-100 active:bg-green-200;
			}
		}

		.hint {
			@apply mt-1;
		}

		input, textarea {
			@apply bg-gray-100 w-full p-2;
			@apply border border-gray-300 rounded;
			@apply resize-y;

			&[type="radio"], &[type="checkbox"] {
				@apply w-[initial] align-[-0.125em];
			}
		}

		.radio-group {
			@apply flex gap-4;

			input + label {
				@apply mt-0 -ml-4 pt-0 pl-2;
			}
		}

		textarea {
			@apply h-32;
		}

		.radio-badges {
			@apply flex flex-wrap gap-2;

			.radio-badge {
				@apply flex items-center gap-1;

				input[type="radio"] {
					@apply sr-only;
				}

				label {
					// Badge style
					@apply inline-block bg-gray-200 px-2 py-1 rounded-full;
					@apply text-sm font-normal;
					@apply cursor-pointer;
				}

				input[type="radio"]:checked + label {
					@apply bg-blue-500 text-white;
				}
			}
		}

		.input-group {
			@apply pt-1 pb-2 pl-4 border-l-2 border-gray-300;

			label {
				@apply text-sm;
			}
		}
	}

	.button-group {
		@apply flex gap-2 mt-4;

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
