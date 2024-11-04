<script lang="ts">
import CollectionTable from '~/components/explore/CollectionTable.svelte'

import { i18nFactory } from '~/i18n'
export let locale: string | undefined = undefined
const _ = i18nFactory(locale)
</script>

<CollectionTable locale={locale} />

<style lang="scss">
</style>
