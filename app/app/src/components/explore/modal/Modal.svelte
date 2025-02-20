<script lang="ts">
import CreateForm from '~/components/explore/modal/CreateForm.svelte'
import ManageForm from '~/components/explore/modal/ManageForm.svelte'
import DeleteCollectionForm from '~/components/explore/modal/DeleteCollectionForm.svelte'
import RecordForm from '~/components/explore/modal/RecordForm.svelte'
import AddDocumentForm from '~/components/explore/modal/AddDocumentForm.svelte'
import DownloadDocumentsForm from '~/components/explore/modal/DownloadDocumentsForm.svelte'
import { stateStore } from '~/stores/stateStore'
import type ModalViewMode from '~/types/ModalViewMode.d.ts'

import type { Locales, I18nKeys } from '~/i18n'
import { i18nFactory } from '~/i18n'
export let locale: Locales | undefined = undefined
const _ = i18nFactory(locale)

const modalViewModeMap: Record<ModalViewMode, {
	component: typeof SvelteComponent,
	title: I18nKeys,
}> = {
	'createCollection': {
		component: CreateForm,
		title: {
			en: 'Creating collection',
			fr: 'Création de collection',
		},
	},
	'manageCollection': {
		component: ManageForm,
		title: {
			en: 'Managing collections',
			fr: 'Gestion des collections',
		},
	},
	'deleteCollection': {
		component: DeleteCollectionForm,
		title: {
			en: 'Deleting collection',
			fr: 'Suppression de collection',
		},
	},
	'viewDocument': {
		component: RecordForm,
		title: {
			en: 'Viewing document',
			fr: 'Visualisation du document',
		},
	},
	'downloadDocuments': {
		component: DownloadDocumentsForm,
		title: {
			en: 'Downloading documents',
			fr: 'Téléchargement des documents',
		},
	},
	'addDocument': {
		component: AddDocumentForm,
		title: {
			en: 'Adding documents',
			fr: 'Ajout de documents',
		},
	},
	'editDocument': {
		component: RecordForm,
		title: {
			en: 'Editing document',
			fr: 'Édition du document',
		},
	},
	'deleteDocument': {
		component: RecordForm,
		title: {
			en: 'Deleting document',
			fr: 'Suppression du document',
		},
	},
}

function onKeyup(event: KeyboardEvent)
{
	if ($stateStore.modalViewMode === null)
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
		modalViewMode: null,
	})
}
</script>

<svelte:window on:keyup={onKeyup} />

<div class="modal-wrapper">
	<div class="modal" class:active={$stateStore.modalViewMode !== null}>
		<div class="modal-content">
			<div class="modal-header">
				<h2>
					{_(modalViewModeMap[$stateStore.modalViewMode]?.title ?? {
						en: 'Unknown view mode',
						fr: 'Mode de visualisation inconnu',
					})}
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
				{#if modalViewModeMap[$stateStore.modalViewMode]?.component}
					<svelte:component
						this={modalViewModeMap[$stateStore.modalViewMode]?.component}
						locale={locale}
					/>
				{:else}
					<p>
						{_({
							en: 'Unknown view component',
							fr: 'Composant de visualisation inconnu',
						})}
					</p>
				{/if}
			</div>
		</div>
	</div>
</div>

<style lang="scss">
@reference '~/styles/tailwind.css';

.modal {
	@apply fixed inset-0 z-50;
	@apply flex items-center justify-center;
	@apply bg-black/50;

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
				@apply px-4 py-2;
				@apply text-lg font-semibold;
			}

			.modal-close {
				@apply flex items-center;

				.btn {
					@apply px-3 py-2;
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
			@apply px-4 pt-4 pb-8;
		}
	}
}
</style>
