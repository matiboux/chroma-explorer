import type { AstroUserConfig } from 'astro/config'

import type Site from '~/types/Site.d.ts'

export const site: Site = {
	title: 'Chroma Explorer',
	description: {
		'en': 'Online tool to explore the contents of a Chroma database.',
		'fr': 'Outil en ligne pour explorer le contenu d\'une base de données Chroma.',
	},
	author: 'Matiboux',
	themeColor: '#ffffff',
}

export const i18n =
{
	defaultLocale: 'en',
	locales: [
		{
			codes: ['en', 'en-US'],
			path: 'en',
		},
		{
			codes: ['fr', 'fr-FR'],
			path: 'fr',
		},
	],
	routing: {
		prefixDefaultLocale: false,
	},
} as const satisfies AstroUserConfig['i18n']
