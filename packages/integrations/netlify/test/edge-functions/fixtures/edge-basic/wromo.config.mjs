import { defineConfig } from 'wromo/config';
import { netlifyEdgeFunctions } from '@wromojs/netlify';
import react from "@wromojs/react";

export default defineConfig({
	adapter: netlifyEdgeFunctions({
		dist: new URL('./dist/', import.meta.url),
	}),
	integrations: [react()],
	experimental: {
		ssr: true
	}
})
