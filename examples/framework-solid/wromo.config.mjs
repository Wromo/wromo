import { defineConfig } from 'wromo/config';
import solid from '@wromojs/solid-js';

// https://wromo.build/config
export default defineConfig({
	// Enable Solid to support Solid JSX components.
	integrations: [solid()],
});
