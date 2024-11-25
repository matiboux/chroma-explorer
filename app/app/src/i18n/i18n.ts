import { i18n as i18nConfig } from '~/config'
import type { Locales, I18nKeys } from './type'

function i18n(
	locale: Locales,
	keys: I18nKeys,
	...args: any[]
)
{
	const value = keys[locale] ?? keys[i18nConfig.defaultLocale]

	return value.replace(/{(\d+)}/g, (match, number) =>
		{
			const index = Number.parseInt(number)
			return String(args[index] ?? match)
		}
	)
}

export default i18n
