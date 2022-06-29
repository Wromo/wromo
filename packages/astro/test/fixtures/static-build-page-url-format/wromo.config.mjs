import { defineConfig } from 'wromo/config';

// https://wromo.build/config
export default defineConfig({
	site: 'http://example.com/',
	base: '/subpath',
	build: {
		format: 'file',
	},
});
