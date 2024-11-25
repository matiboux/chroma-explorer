<script lang="ts">
import CollectionTable from '~/components/explore/CollectionTable.svelte'

import type { Locales } from '~/i18n'
import { i18nFactory } from '~/i18n'
export let locale: Locales | undefined = undefined
const _ = i18nFactory(locale)
</script>

<CollectionTable locale={locale} />

<style lang="scss">
</style>
