<script lang="ts">
import { ChromaClient } from 'chromadb'

import { configStore } from '~/stores/configStore'
import { stateStore } from '~/stores/stateStore'
</script>

<div class="modal-wrapper">
	<div class="modal" class:active={$stateStore.viewMode !== null}>
		<div class="modal-content">
			{$stateStore.viewMode}
			{$stateStore.selectedDocument}
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
			@apply m-4 p-4;
			@apply rounded-lg shadow-lg;
		}
	}
</style>
