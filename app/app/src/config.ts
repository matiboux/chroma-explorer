import type { AstroConfig } from 'astro'

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
	locales: [
		{
			codes: ['en', 'en_US'],
			path: 'en',
		},
		{
			codes: ['fr', 'fr_FR'],
			path: 'fr',
		},
	],
	defaultLocale: 'en',
	fallback: {
		fr: 'en',
	},
	routing: {
		prefixDefaultLocale: false,
		fallbackType: 'rewrite',
	},
} as const satisfies AstroConfig['i18n']
