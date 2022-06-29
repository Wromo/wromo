import { defineConfig } from 'wromo/config';
import react from '@wromojs/react';
import svelte from '@wromojs/svelte';
import vue from '@wromojs/vue';

// https://wromo.build/config
export default defineConfig({
    integrations: [react(), svelte(), vue()],
    vite: {
        build: {
            assetsInlineLimit: 0,
        },
    },
});

