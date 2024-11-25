<script lang="ts">
import { ChromaClient } from 'chromadb'
import type { GetResponse } from 'chromadb'

import RecordForm from '~/components/explore/RecordForm.svelte'
import { configStore } from '~/stores/configStore'
import { stateStore } from '~/stores/stateStore'

import { i18nFactory } from '~/i18n'
export let locale: string | undefined = undefined
const _ = i18nFactory(locale)

function onKeyup(event: KeyboardEvent)
{
	if ($stateStore.viewMode === null)
	{
		// Modal is not active, ignore event
		return
	}

	if (event.key === 'Escape')
	{
		onClose()
	}
}

function onClose()
{
	stateStore.set({
		...stateStore.get(),
		viewMode: null,
	})
}

let record: GetResponse | null = null

stateStore.subscribe(async (value, oldValue) =>
{
	if (value.viewMode === null)
	{
		// Modal is not active, clear record
		record = null
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

	record = null

	try
	{
		const config = configStore.get()
		const chroma = new ChromaClient({
			path: config.serverUrl,
			...(
				config.authConfig
				? (
					config.authConfig.token
					? ({
						auth: {
							provider: 'token',
							credentials: config.authConfig.token,
						},
					})
					: config.authConfig.username && config.authConfig.password
					? ({
						auth: {
							provider: 'basic',
							credentials: {
								username: config.authConfig.username,
								password: config.authConfig.password,
							},
						},
					})
					: undefined
				)
				: undefined
			),
		})

		const collection = (await chroma.getCollection({ name: value.collections[value.selectedCollection].name }))
		record = (await collection.get({
			ids: [ value.selectedDocument ],
			include: [ 'documents', 'embeddings', 'metadatas' ],
		}))
	}
	catch (error: unknown)
	{}
})
</script>

<svelte:window on:keyup={onKeyup} />

<div class="modal-wrapper">
	<div class="modal" class:active={$stateStore.viewMode !== null}>
		<div class="modal-content">
			<div class="modal-header">
				<h2>
					{$stateStore.viewMode}
				</h2>
				<div class="modal-close">
					<button class="btn btn-default" on:click={onClose}>
						<span class="icon icon-[mdi--close] icon-align"></span>
						<span class="sr-only">
							{_({
								en: 'Close modal',
								fr: 'Fermer la modale',
							})}
						</span>
					</button>
				</div>
			</div>
			<div class="modal-body">
				<RecordForm
					locale={locale}
					record={record}
				/>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.modal {
		@apply fixed inset-0 z-50;
		@apply flex items-center justify-center;
		@apply bg-black bg-opacity-50;

		&:not(.active) {
			@apply hidden;
		}

		.modal-content {
			@apply bg-white;
			@apply w-full max-w-4xl min-h-32 max-h-[calc(100%_-_2rem)];
			@apply flex flex-col;
			@apply m-4;
			@apply rounded-lg shadow-lg overflow-hidden;

			.modal-header {
				@apply flex justify-between items-start;
				@apply border-b-2 border-black border-opacity-10;

				h2 {
					@apply px-4 py-1;
					@apply text-lg font-semibold;
				}

				.modal-close {
					@apply flex items-center;

					.btn {
						@apply px-2 py-1;
						@apply text-xl;
						@apply hover:bg-gray-100 active:bg-gray-200;

						.icon {
							@apply text-gray-600;
						}
					}
				}
			}

			.modal-body {
				@apply flex-grow overflow-y-auto;
				@apply px-4 py-2 pb-8;
			}
		}
	}
</style>
