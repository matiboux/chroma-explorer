<script lang="ts">
import { onMount } from 'svelte'

import { configStore } from '~/stores/configStore'

export let logoutRedirect: string = ''

onMount(() =>
{
	if (logoutRedirect)
	{
		configStore.subscribe((value, oldValue) =>
		{
			if (!value.serverUrl)
			{
				// Redirect to the specified URL
				window.location.href = logoutRedirect
			}
		})
	}
})

function onLogout()
{
	$configStore = {
		...$configStore,
		serverUrl: '',
		authConfig: null,
	}
}
</script>

<button
	type="button" class="logout-btn"
	on:click={onLogout}
>
	<span class="icon icon-[mdi--logout] icon-align"></span>
	<span class="sr-only">
		Logout
	</span>
</button>

<style lang="scss">
	// button {
	// 	@apply bg-blue-500 hover:bg-blue-700;
	// 	@apply text-white font-bold py-2 px-4 rounded;
	// }
	.logout-btn {
		@apply px-2 py-1 aspect-square;

		&:hover {
			@apply bg-gray-200;
		}
	}
</style>
