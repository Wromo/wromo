import { defineConfig } from 'wromo/config';
import react from '@wromojs/react';
import svelte from '@wromojs/svelte';

// https://wromo.build/config
export default defineConfig({
	integrations: [react(), svelte()],
});
