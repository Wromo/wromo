import { defineConfig } from 'wromo/config';
import solid from '@wromojs/solid-js';
import svelte from '@wromojs/svelte';
import vue from '@wromojs/vue';

// https://wromo.build/config
export default defineConfig({
	integrations: [solid(), svelte(), vue()],
});