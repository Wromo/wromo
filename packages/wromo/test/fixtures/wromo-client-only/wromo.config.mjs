import { defineConfig } from 'wromo/config';
import svelte from '@wromojs/svelte';
import react from '@wromojs/react';

// https://wromo.build/config
export default defineConfig({
	integrations: [svelte(), react()],
});
