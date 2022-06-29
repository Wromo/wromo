import { defineConfig } from 'wromo/config';
import preact from '@wromojs/preact';

// https://wromo.build/config
export default defineConfig({
	integrations: [preact()],
	site: 'http://example.com',
	base: '/subpath',
	ssr: {
		noExternal: ['@test/static-build-pkg'],
	},
});
