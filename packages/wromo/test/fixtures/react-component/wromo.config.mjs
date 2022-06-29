import { defineConfig } from 'wromo/config';
import react from '@wromojs/react';
import vue from '@wromojs/vue';

// https://wromo.build/config
export default defineConfig({
	integrations: [react(), vue()],
});