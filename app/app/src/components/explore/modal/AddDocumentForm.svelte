<script lang="ts">
import { ChromaClient } from 'chromadb'
import type { GetResponse } from 'chromadb'
import { parse } from 'csv-parse/browser/esm'

import { stateStore } from '~/stores/stateStore'

import type { Locales } from '~/i18n'
import { i18nFactory } from '~/i18n'
export let locale: Locales | undefined = undefined
const _ = i18nFactory(locale)

// Generate a random suffix for id attributes
const idSuffix = Math.random().toString(36).substring(2)

const batchFormData = {
	batch: null as FileList | null,
	ignoreErrors: false,
}

async function parseCsvBatch(file: File): Promise<any[]>
{
	// Load CSV file content
	const content = await file.text()

	return new Promise((resolve, reject) =>
	{
		const records: any[] = []

		const parser = parse({
			delimiter: ',',
			columns: true,
			skip_empty_lines: true,
		})

		parser.on('readable', () =>
		{
			let record
			while (record = parser.read())
			{
				records.push(record)
			}
		})

		parser.on('error', (error) =>
		{
			reject(error)
		})

		parser.on('end', () =>
		{
			resolve(records)
		})

		parser.write(content)
		parser.end()
	})
}

async function parseJsonBatch(file: File): Promise<any[]>
{
	// Load JSON file content
	const content = await file.text()
	return JSON.parse(content)
}

async function submitRecordsChunk(collectionName: string, chunk: any[])
{
	const ids = chunk.map(record => record.id)
	const documents = chunk.map(record => record.document || null)
	const embeddings = chunk.map(record => typeof record.embedding === 'string' ? JSON.parse(record.embedding) : (record.embedding || null))
	const metadatas = chunk.map(record => typeof record.metadata === 'string' ? JSON.parse(record.metadata) : (record.metadata || {}))

	const state = stateStore.get()
	const chroma = state.chroma!
	const collection = await chroma.getCollection({ name: collectionName })

	await collection.add({
		ids: ids,
		documents: documents,
		embeddings: embeddings,
		metadatas: metadatas,
	})
}

async function submitRecords(collectionName: string, records: any[], ignoreErrors = false)
{
	// Parse values
	records = records.map(record => ({
		id: record.id || null,
		document: record.document || null,
		embedding: typeof record.embedding === 'string' ? JSON.parse(record.embedding) : (record.embedding || null),
		metadata: typeof record.metadata === 'string' ? JSON.parse(record.metadata) : (record.metadata || {}),
	}))

	if (!ignoreErrors)
	{
		// Check for missing values
		if (records.some(record => !record.id || !record.document || !record.embedding))
		{
			alert('Some records have missing values')
			return
		}
	}
	else
	{
		// Filter out records with missing values
		records = records.filter(record => record.id && record.document && record.embedding)
	}

	// Split records into chunks of 20
	const chunks = []
	for (let i = 0; i < records.length; i += 20)
	{
		chunks.push(records.slice(i, i + 20))
	}

	for (const chunk of chunks)
	{
		await submitRecordsChunk(collectionName, chunk)
	}
}

async function onSubmitBatch()
{
	const state = stateStore.get()
	if (!state.collections?.[state.selectedCollection!])
	{
		alert('No collection selected')
		return
	}

	if (!batchFormData.batch || batchFormData.batch.length <= 0)
	{
		alert('No files selected')
		return
	}

	// Check all files are json or csv
	if (!Array.from(batchFormData.batch).every(file => ['application/json', 'text/csv'].includes(file.type)))
	{
		alert('Only JSON and CSV files are supported')
		return
	}

	let allRecords: any[] = []

	for (const file of Array.from(batchFormData.batch))
	{
		let records: any[]
		if (file.type === 'text/csv')
		{
			// Parse CSV
			records = await parseCsvBatch(file)
		}
		else
		{
			// Parse JSON
			records = await parseJsonBatch(file)
		}

		allRecords = allRecords.concat(records)
	}

	// Submit records
	await submitRecords(state.collections?.[state.selectedCollection!].name, allRecords, batchFormData.ignoreErrors)

	// Close modal
	// TODO: Refresh collection records
	stateStore.set({
		...stateStore.get(),
		modalViewMode: null,
	})
}
</script>

<div class="add-document-wrapper">

	<form class="add-batch-form" on:submit|preventDefault={onSubmitBatch}>

		<div class="input-group">
			<label for={`input-batch-${idSuffix}`}>
				{_({
					en: 'Add batch of documents',
					fr: 'Ajouter un lot de documents',
				})}
			</label>
			<p class="hint">
				{_({
					en: 'Upload a CSV or JSON file containing multiple documents.',
					fr: 'Téléversez un fichier CSV ou JSON contenant plusieurs documents.',
				})}
				{@html _({
					en: 'Each record should have an <code>id</code>, <code>document</code>, and <code>embedding</code> field.',
					fr: 'Chaque enregistrement devrait avoir un champ <code>id</code>, <code>document</code>, et <code>embedding</code>.',
				})}
			</p>
			<input
				id={`batch-input-${idSuffix}`}
				type="file" name="batch" accept=".csv, .json"
				bind:files={batchFormData.batch}
			/>
		</div>

		<div class="input-group">
			<div class="radio-group">
				<input
					id={`input-ignore-errors-${idSuffix}`}
					type="checkbox" name="ignoreErrors"
					bind:checked={batchFormData.ignoreErrors}
				/>
				<label for={`input-ignore-errors-${idSuffix}`}>
					{_({
						en: 'Skip records with missing values',
						fr: 'Ignorer les données avec des valeurs manquantes',
					})}
				</label>
			</div>
		</div>

		<div class="button-group">
			<button type="submit">
				{_({
					en: 'Add documents',
					fr: 'Ajouter les documents',
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

	<!--
	<hr />

	<form class="add-document-form">

		<div class="input-group">
			<label for={`input-document-${idSuffix}`}>
				{_({
					en: 'Document content',
					fr: 'Contenu du document',
				})}
			</label>
			<textarea id={`input-document-${idSuffix}`} name="document" required></textarea>
		</div>

		<div class="input-group">
			<label for={`input-embedding-${idSuffix}`}>
				{_({
					en: 'Embedding vector',
					fr: 'Vecteur d\'embedding',
				})}
			</label>
			<input type="text" id={`input-embedding-${idSuffix}`} name="embedding" />
		</div>

		<div class="input-group">
			<label for={`input-metadata-${idSuffix}`}>
				{_({
					en: 'Metadata',
					fr: 'Métadonnées',
				})}
			</label>
			<textarea id={`input-metadata-${idSuffix}`} name="metadata"></textarea>
		</div>

		<div class="button-group">
			<button type="submit">
				{_({
					en: 'Add document',
					fr: 'Ajouter le document',
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
	-->

</div>

<style lang="scss">
.add-document-wrapper {

	&, .add-batch-form, .add-document-form {
		> * + * {
			@apply mt-2;
		}
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
