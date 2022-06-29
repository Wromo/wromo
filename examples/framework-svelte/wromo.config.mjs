import { defineConfig } from 'wromo/config';
import svelte from '@wromojs/svelte';

// https://wromo.build/config
export default defineConfig({
	// Enable Svelte to support Svelte components.
	integrations: [svelte()],
});
