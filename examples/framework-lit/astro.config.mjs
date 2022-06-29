import { defineConfig } from 'wromo/config';
import lit from '@wromojs/lit';

// https://wromo.build/config
export default defineConfig({
	// Enable Lit to support LitHTML components and templates.
	integrations: [lit()],
});
