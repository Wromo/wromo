import { defineConfig } from 'wromo/config';
import preact from '@wromojs/preact';
import vue from '@wromojs/vue';
import svelte from '@wromojs/svelte';

// https://wromo.build/config
export default defineConfig({
	integrations: [preact(), vue(), svelte()],
});
