<script lang="ts">
import { configStore } from '~/stores/configStore'
</script>

{#if $configStore.serverUrl}
	<p class="status-success">
		<span class="icon icon-[mdi--check-circle-outline] icon-align"></span>
		Connected!
	</p>
{:else}
	<p class="status-error">
		<span class="icon icon-[mdi--alert-circle-outline] icon-align"></span>
		Connection lost
	</p>
{/if}

<style lang="scss">
	.status-success {
		@apply text-green-700;
	}

	.status-error {
		@apply text-red-700;
	}
</style>
