<script lang="ts">
import { onMount } from 'svelte'

import { configStore } from '~/stores/configStore'

import type { Locales } from '~/i18n'
import { i18nFactory } from '~/i18n'
export let locale: Locales | undefined = undefined
const _ = i18nFactory(locale)

export let logoutRedirect: string = ''

onMount(() =>
{
	if (logoutRedirect)
	{
		configStore.subscribe((value) =>
		{
			if (!value.confirmed)
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
		confirmed: false,
		authConfig: null, // Clear the auth config (privacy)
	}
}
</script>

<button
	type="button" class="logout-btn"
	on:click={onLogout}
>
	<span class="icon icon-[mdi--logout] icon-align"></span>
	<span class="sr-only">
		{_({
			en: 'Logout',
			fr: 'Déconnexion',
		})}
	</span>
</button>

<style lang="scss">
@reference "tailwindcss/theme";

.logout-btn {
	@apply px-2 py-1 aspect-square;

	&:hover {
		@apply bg-gray-200;
	}
}
</style>
