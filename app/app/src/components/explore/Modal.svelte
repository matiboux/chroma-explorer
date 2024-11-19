<script lang="ts">
import { ChromaClient } from 'chromadb'

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
				selectedDocument = {$stateStore.selectedDocument}
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
			@apply w-full max-w-4xl min-h-32;
			@apply flex flex-col;
			@apply m-4;
			@apply rounded-lg shadow-lg overflow-hidden;

			.modal-header {
				@apply flex justify-between items-start;

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
				@apply flex-grow;
				@apply px-4 py-2;
			}
		}
	}
</style>
