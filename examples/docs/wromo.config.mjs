import { defineConfig } from 'wromo/config';
import preact from '@wromojs/preact';
import react from '@wromojs/react';

// https://wromo.build/config
export default defineConfig({
	integrations: [
		// Enable Preact to support Preact JSX components.
		preact(),
		// Enable React for the Algolia search component.
		react(),
	],
});
