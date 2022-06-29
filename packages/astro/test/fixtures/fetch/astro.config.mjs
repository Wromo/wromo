import { defineConfig } from 'wromo/config';

import preact from '@wromojs/preact';
import svelte from '@wromojs/svelte';
import vue from '@wromojs/vue';

// https://wromo.build/config
export default defineConfig({
	integrations: [preact(), svelte(), vue()],
});