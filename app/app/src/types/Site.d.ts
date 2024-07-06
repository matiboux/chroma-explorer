import type { I18nKeys } from '~/i18n/type.d.ts'

interface Site
{
	title: string
	description?: I18nKeys
	author?: string
	themeColor?: string
}

export default Site
