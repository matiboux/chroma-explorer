import { getLocaleByPath } from 'astro:i18n'

function getUrlWithoutLocale(url: URL | string): string
{
	const urlPathnames = []
	const urlParts = typeof url === 'string' ? url.split('/') : url.pathname.split('/')

	let i = !urlParts[0] ? 1 : 0
	while (i < urlParts.length)
	{
		if (urlParts[i])
		{
			const locale = getLocaleByPath(urlParts[i] as string)
			if (locale)
			{
				i++
				continue
			}
		}

		urlPathnames.push(urlParts[i])
		i++
	}
	while (i < urlParts.length)
	{
		urlPathnames.push(urlParts[i])
		i++
	}

	return '/' + urlPathnames.join('/')
}

export default getUrlWithoutLocale
