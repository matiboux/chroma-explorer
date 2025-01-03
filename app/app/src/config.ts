import type { AstroConfig } from 'astro'

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
