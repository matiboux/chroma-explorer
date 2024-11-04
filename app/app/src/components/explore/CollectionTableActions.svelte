<script lang="ts">
import { ChromaClient } from 'chromadb'
import type { MultiGetResponse } from 'chromadb'

import { configStore } from '~/stores/configStore'
import { stateStore } from '~/stores/stateStore'
import Button from '~/components/generic/Button.svelte'
</script>

<div class="actions">

	<Button buttonStyle="gray">
		<span class="icon icon-[mdi--table-plus] icon-align"></span>
		<span class="sr-only">
			Refresh collections
		</span>
	</Button>

	<Button buttonStyle="gray">
		<span class="icon icon-[mdi--table-refresh] icon-align"></span>
		<span class="sr-only">
			Refresh table
		</span>
	</Button>

	<div class="collection-count">
		<p class="badge">
			10 documents
		</p>
	</div>

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
