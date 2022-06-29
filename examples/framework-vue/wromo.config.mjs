import { defineConfig } from 'wromo/config';
import vue from '@wromojs/vue';

// https://wromo.build/config
export default defineConfig({
	// Enable Vue to support Vue components.
	integrations: [vue()],
});
