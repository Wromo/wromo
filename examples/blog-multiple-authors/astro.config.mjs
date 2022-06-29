import { defineConfig } from 'wromo/config';
import preact from '@wromojs/preact';

// https://wromo.build/config
export default defineConfig({
	// Enable the Preact integration to support Preact JSX components.
	integrations: [preact()],
});
