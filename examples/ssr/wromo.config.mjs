import { defineConfig } from 'wromo/config';
import svelte from '@wromojs/svelte';
import node from '@wromojs/node';

// https://wromo.build/config
export default defineConfig({
	adapter: node(),
	integrations: [svelte()],
});
