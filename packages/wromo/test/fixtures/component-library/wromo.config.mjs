import { defineConfig } from 'wromo/config';
import preact from '@wromojs/preact';
import react from '@wromojs/react';
import svelte from '@wromojs/svelte';

export default defineConfig({
	integrations: [preact(), react(), svelte()],
})
