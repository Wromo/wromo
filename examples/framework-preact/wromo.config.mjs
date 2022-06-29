import { defineConfig } from 'wromo/config';
import preact from '@wromojs/preact';

// https://wromo.build/config
export default defineConfig({
	// Enable Preact to support Preact JSX components.
	integrations: [preact()],
});
