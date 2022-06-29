import { defineConfig } from 'wromo/config';

// https://wromo.build/config
export default defineConfig({
    vite: {
        build: {
            assetsInlineLimit: 0,
        },
    },
});

