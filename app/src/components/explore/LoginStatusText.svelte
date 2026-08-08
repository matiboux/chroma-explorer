<script lang="ts">
import { configStore } from '~/stores/configStore'

import type { Locales } from '~/i18n'
import { i18nFactory } from '~/i18n'
export let locale: Locales | undefined = undefined
const _ = i18nFactory(locale)
</script>

{#if $configStore.serverUrl}
	<p class="status-success">
		<span class="icon icon-[mdi--check-circle-outline] icon-align"></span>
		{_({
			en: 'Connected!',
			fr: 'Connecté !',
		})}
	</p>
{:else}
	<p class="status-error">
		<span class="icon icon-[mdi--alert-circle-outline] icon-align"></span>
		{_({
			en: 'Connection lost',
			fr: 'Connexion perdue',
		})}
	</p>
{/if}

<style>
@reference "tailwindcss/theme";

.status-success {
	@apply text-green-700;
}

.status-error {
	@apply text-red-700;
}
</style>
