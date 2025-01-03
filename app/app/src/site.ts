import type { I18nKeys } from '~/i18n/type.d.ts'

export interface Site
{
	title?: string
	description?: string | I18nKeys
	author?: string
	keywords?: string[]
	themeColor?: string
	favicon?: string
	lang?: string
}

export const site: Site = {
	title: 'Chroma Explorer',
	description: {
		'en': 'Online tool to explore the contents of a Chroma database.',
		'fr': 'Outil en ligne pour explorer le contenu d\'une base de données Chroma.',
	},
	author: 'Matiboux',
	themeColor: '#ffffff',
}
