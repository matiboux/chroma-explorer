import type { Props as BaseProps } from '~/layouts/Base.astro'

export interface Site
{
	lang?: BaseProps['lang']
	title?: BaseProps['title']
	description?: BaseProps['description']
	author?: BaseProps['author']
	keywords?: BaseProps['keywords']
	generator?: BaseProps['generator']
	themeColor?: BaseProps['themeColor']
	viewportScale?: BaseProps['viewportScale']
	favicon?: BaseProps['favicon']
	socialTitle?: BaseProps['socialTitle']
	socialDescription?: BaseProps['socialDescription']
	socialImage?: BaseProps['socialImage']
	socialUrl?: BaseProps['socialUrl']
	socialType?: BaseProps['socialType']
	socialTwitterCard?: BaseProps['socialTwitterCard']
}

export const site: Site = {
	lang: 'en',
	title: 'Chroma Explorer',
	description: {
		'en': 'Online tool to explore the contents of a Chroma database.',
		'fr': 'Outil en ligne pour explorer le contenu d\'une base de données Chroma.',
	},
	author: 'Matiboux',
	themeColor: '#ffffff',
	viewportScale: 1,
	socialTitle: true,
	socialDescription: true,
}
