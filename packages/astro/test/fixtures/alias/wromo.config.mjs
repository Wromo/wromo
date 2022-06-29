import { defineConfig } from 'wromo/config';
import svelte from '@wromojs/svelte';

// https://wromo.build/config
export default defineConfig({
	integrations: [svelte()],
	vite: {
		resolve: {
			alias: [
				{ find:/^component:(.*)$/, replacement: '/src/components/$1' }
			]
		}
	}
});
