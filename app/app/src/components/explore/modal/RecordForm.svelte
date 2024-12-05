<script lang="ts">
import { ChromaClient } from 'chromadb'
import type { GetResponse } from 'chromadb'

import { chromaStore } from '~/stores/chromaStore'
import { stateStore } from '~/stores/stateStore'

import type { Locales } from '~/i18n'
import { i18nFactory } from '~/i18n'
export let locale: Locales | undefined = undefined
const _ = i18nFactory(locale)

// Generate a random suffix for id attributes
const idSuffix = Math.random().toString(36).substring(2)

let record: GetResponse | null | undefined = undefined
let selectedMetadata: string | null = null
let lastCopiedSelector: string | null = null

stateStore.subscribe(async (value, oldValue) =>
{
	if (value.modalViewMode === null)
	{
		// Modal is not active, clear record
		record = undefined
		return
	}

	if (
		// !value.collections ||
		!value.selectedCollection ||
		// !value.collections[value.selectedCollection] ||
		!value.selectedDocument ||
		value.selectedDocument === oldValue?.selectedDocument
	)
	{
		return
	}

	record = undefined

	try
	{
		const chroma = chromaStore.get()!
		const collection = await chroma.getCollection({ name: value.collections[value.selectedCollection].name })
		record = await collection.get({
			ids: [ value.selectedDocument ],
			include: [ 'documents', 'embeddings', 'metadatas' ],
		})
	}
	catch (error: unknown)
	{
		console.error(error)
		record = null
	}
})

async function copyToClipboard(selector: string)
{
	lastCopiedSelector = null
	const element = document.getElementById(`record-${selector}-${idSuffix}`) as HTMLInputElement | HTMLTextAreaElement

	if (!element)
	{
		// Element not found
		return
	}

	await navigator.clipboard.writeText(element.value)
	lastCopiedSelector = selector
}
</script>

<form class="record-form">

	{#if !record}
		<p>
			<span class="icon icon-[mdi--sync] icon-align"></span>
			{_({
				en: 'Loading record...',
				fr: 'Chargement des données...',
			})}
		</p>

	{:else if record.ids.length <= 0}
		<p>
			{_({
				en: 'Record not found',
				fr: 'Données introuvables',
			})}
		</p>

	{:else}

		<div class="input-group">
			<p>
				<strong>{_({
					en: 'Record ID',
					fr: 'ID de la donnée',
				})}</strong>{_({
					en: ':',
					fr: ' :',
				})}
				<code>{record.ids[0]}</code>
				<button
					type="button" class="copy-button" class:copied={lastCopiedSelector === 'id'}
					on:click|preventDefault={copyToClipboard.bind(null, 'id')}
				>
					<span class="icon icon-[mdi--content-copy] icon-align"></span>
					{lastCopiedSelector === 'id' ? _({
						en: 'Copied!',
						fr: 'Copié !',
					}) : _({
						en: 'Copy',
						fr: 'Copier',
					})}
				</button>
			</p>
			<input type="hidden" id={`record-id-${idSuffix}`} name="record-id" value={record.ids[0]} readonly />
		</div>

		<div class="input-group">
			<label for={`record-collection-${idSuffix}`}>
				{_({
					en: 'Document',
					fr: 'Document',
				})}
				<button
					type="button" class="copy-button" class:copied={lastCopiedSelector === 'collection'}
					on:click|preventDefault={copyToClipboard.bind(null, 'collection')}
				>
					<span class="icon icon-[mdi--content-copy] icon-align"></span>
					{lastCopiedSelector === 'collection' ? _({
						en: 'Copied!',
						fr: 'Copié !',
					}) : _({
						en: 'Copy',
						fr: 'Copier',
					})}
				</button>
			</label>
			<p class="hint">
				{_({
					en: 'Document size: {0} bytes',
					fr: 'Taille du document: {0} octets',
				}, new Blob([ record.documents[0] ?? '' ]).size)}
			</p>
			<textarea id={`record-collection-${idSuffix}`} readonly>{record.documents[0] ?? ''}</textarea>
		</div>

		<div class="input-group">
			<label for={`record-embedding-${idSuffix}`}>
				{_({
					en: 'Embedding',
					fr: 'Vecteur',
				})}
				<button
					type="button" class="copy-button" class:copied={lastCopiedSelector === 'embedding'}
					on:click|preventDefault={copyToClipboard.bind(null, 'embedding')}
				>
					<span class="icon icon-[mdi--content-copy] icon-align"></span>
					{lastCopiedSelector === 'embedding' ? _({
						en: 'Copied!',
						fr: 'Copié !',
					}) : _({
						en: 'Copy',
						fr: 'Copier',
					})}
				</button>
			</label>
			<p class="hint">
				{_({
					en: 'Embedding vector size: {0}',
					fr: 'Taille du vecteur d\'embedding : {0}',
				}, record.embeddings?.[0]?.length)}
			</p>
			<input
				type="text" id={`record-embedding-${idSuffix}`} name="record-embedding" readonly
				value={record.embeddings?.[0] ? JSON.stringify(record.embeddings[0]) : null}
			/>
		</div>

		<div class="metadata">

			<div class="input-group">

				{#if !record.metadatas?.[0] || Object.keys(record.metadatas[0]).length <= 0}
					<p class="hint">
						{_({
							en: 'No metadata',
							fr: 'Pas de métadonnées',
						})}
					</p>

				{:else}

					<!-- List of radio buttons like badges to select the metadata to show and edit -->
					<label for="record-metadata">
						{_({
							en: 'Metadata',
							fr: 'Métadonnées',
						})}
					</label>

					<div class="radio-badges">
						{#each Object.keys(record.metadatas[0]) as key}
							<div class="radio-badge">
								<input
									type="radio" name="metadata" value={key}
									bind:group={selectedMetadata}
									id={`metadata-${key}-${idSuffix}`}
								/>
								<label for={`metadata-${key}-${idSuffix}`}>{key}</label>
							</div>
						{/each}
					</div>

					{#each Object.entries(record.metadatas[0]) as [key, value]}
						<div class="input-group" hidden={selectedMetadata !== key}>
							<label for={`record-metadata-${key}-${idSuffix}`}>
								{key}
								<button
									type="button" class="copy-button" class:copied={lastCopiedSelector === `metadata-${key}`}
									on:click|preventDefault={copyToClipboard.bind(null, `metadata-${key}`)}
								>
									<span class="icon icon-[mdi--content-copy] icon-align"></span>
									{lastCopiedSelector === `metadata-${key}` ? _({
										en: 'Copied!',
										fr: 'Copié !',
									}) : _({
										en: 'Copy',
										fr: 'Copier',
									})}
								</button>
							</label>
							{#if typeof value === 'string'}
								<p class="hint">
									{_({
										en: 'Metadata value size: {0} bytes',
										fr: 'Taille de la valeur métadonnée : {0} octets',
									}, new Blob([ value ]).size)}
								</p>
							{/if}
							<textarea id={`record-metadata-${key}-${idSuffix}`} readonly>{value}</textarea>
						</div>
					{/each}

				{/if}

			</div>

		</div>

	{/if}

</form>

<style lang="scss">
.record-form {
	@apply flex flex-col gap-4;

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
		@apply flex flex-col gap-2;

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

		input, textarea {
			@apply bg-gray-100 w-full p-2;
			@apply border border-gray-300 rounded;
			@apply resize-y;
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
}
</style>
