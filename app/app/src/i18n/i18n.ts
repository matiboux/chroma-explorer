import { i18n as i18nConfig } from '~/config'
import type { Locales, I18nKeys } from './type'

const defaultLocale = i18nConfig.defaultLocale

function i18n(
	locale: Locales | undefined,
	keys: I18nKeys,
	...args: any[]
)
{
	const value = keys[locale!] ?? keys[defaultLocale]

	return value.replace(/{(\d+)}/g, (match, number) =>
		{
			const index = Number.parseInt(number)
			return String(args[index] ?? match)
		}
	)
}

export default i18n

export {
	defaultLocale,
}
