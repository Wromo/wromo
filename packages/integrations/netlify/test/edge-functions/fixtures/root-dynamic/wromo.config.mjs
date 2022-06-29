import { defineConfig } from 'wromo/config';
import { netlifyEdgeFunctions } from '@wromojs/netlify';

export default defineConfig({
	adapter: netlifyEdgeFunctions({
		dist: new URL('./dist/', import.meta.url),
	}),
	experimental: {
		ssr: true
	}
})
