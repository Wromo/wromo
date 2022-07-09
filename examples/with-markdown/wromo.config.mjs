import { defineConfig } from 'wromo/config';
import preact from '@wromojs/preact';
import react from '@wromojs/react';
import svelte from '@wromojs/svelte';
import vue from '@wromojs/vue';

// https://wromo.build/config
export default defineConfig({
	// Enable many frameworks to support all different kinds of components.
	integrations: [preact(), react(), svelte(), vue()],
});
