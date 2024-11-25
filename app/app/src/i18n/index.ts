import i18n, { defaultLocale } from './i18n'
import i18nFactory from './i18nFactory'
import getLocaleByUrl from './getLocaleByUrl'
import getLocaleUrlList from './getLocaleUrlList'
import getUrlWithoutLocale from './getUrlWithoutLocale'

import type { Locales, I18nKeys } from './type'

export {
	i18n,
	defaultLocale,
	i18nFactory,
	getLocaleByUrl,
	getLocaleUrlList,
	getUrlWithoutLocale,
}

export type {
	Locales,
	I18nKeys
}
