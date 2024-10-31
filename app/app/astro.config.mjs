import { defineConfig } from 'astro/config'
import svelte from '@astrojs/svelte'
import tailwind from '@astrojs/tailwind'

import { i18n } from '/src/config'

// https://astro.build/config
export default defineConfig({
	i18n: i18n,
	integrations: [
		svelte(),
		tailwind(),
	],
})
