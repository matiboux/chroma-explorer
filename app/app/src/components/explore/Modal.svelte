<script lang="ts">
import { onMount } from 'svelte'
import { ChromaClient } from 'chromadb'

import { configStore } from '~/stores/configStore'
import { stateStore, reloadCollections } from '~/stores/stateStore'
import Button from '~/components/generic/Button.svelte'

</script>

<div class="modal" class:active={false}>
	<div class="wrapper">
		...
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

		.wrapper {
			@apply bg-white;
			@apply w-full max-w-4xl min-h-32;
			@apply m-4 p-4;
			@apply rounded-lg shadow-lg;
		}
	}
</style>
