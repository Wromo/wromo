import { defineConfig } from 'wromo/config';
import react from '@wromojs/react';
import preact from '@wromojs/preact';
import solid from '@wromojs/solid-js';
import svelte from '@wromojs/svelte';
import vue from '@wromojs/vue';

// https://wromo.build/config
export default defineConfig({
	integrations: [react(), preact(), solid(), svelte(), vue()],
});