<script lang="ts">
import { stateStore } from '~/stores/stateStore'
import Button from '~/components/generic/Button.svelte'

import type { Locales } from '~/i18n'
import { i18nFactory } from '~/i18n'
export let locale: Locales | undefined = undefined
const _ = i18nFactory(locale)

function onAddDocument()
{
	stateStore.set({
		...stateStore.get(),
		modalViewMode: 'addDocument',
	})
}

function onRefreshDocuments()
{
	stateStore.set({
		...stateStore.get(),
		documents: null,
	})
}

function onDownloadDocuments()
{
	stateStore.set({
		...stateStore.get(),
		modalViewMode: 'downloadDocuments',
	})
}
</script>

<div class="actions">

	{#if $stateStore.selectedCollection}

		<Button buttonStyle="gray" on:click={onAddDocument}>
			<span class="icon icon-[mdi--table-plus] icon-align"></span>
			<span class="sr-only">
				{_({
					en: 'Add new document',
					fr: 'Ajouter un nouveau document',
				})}
			</span>
		</Button>

	{/if}

	{#if $stateStore.documents}

		<Button buttonStyle="gray" on:click={onRefreshDocuments}>
			<span class="icon icon-[mdi--table-refresh] icon-align"></span>
			<span class="sr-only">
				{_({
					en: 'Refresh table',
					fr: 'Rafraîchir le tableau',
				})}
			</span>
		</Button>

		<Button buttonStyle="gray" on:click={onDownloadDocuments}>
			<span class="icon icon-[mdi--tray-download] icon-align"></span>
			<span class="sr-only">
				{_({
					en: 'Download documents',
					fr: 'Télécharger les documents',
				})}
			</span>
		</Button>

		<div class="collection-count">
			<p class="badge">
				{$stateStore.documents.ids.length}{' '}
				{_({
					en: 'documents',
					fr: 'documents',
				})}
			</p>
		</div>

	{/if}

</div>

<style lang="scss">
	.actions {
		@apply flex gap-2 items-center;
	}


	.badge {
		@apply inline-block;
		@apply bg-gray-200;
		@apply px-2;
		@apply text-sm text-gray-700;
		@apply rounded-full;
	}
</style>
