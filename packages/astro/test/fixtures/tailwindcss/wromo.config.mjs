import { defineConfig } from 'wromo/config';
import tailwind from '@wromojs/tailwind';

// https://wromo.build/config
export default defineConfig({
	integrations: [tailwind()],
	vite: {
		build: {
			assetsInlineLimit: 0,
		},
	},
});