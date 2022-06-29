import { defineConfig } from 'wromo/config';
import preact from '@wromojs/preact';

// https://wromo.build/config
export default defineConfig({
	integrations: [preact()],
});
