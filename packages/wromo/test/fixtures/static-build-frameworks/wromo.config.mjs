import { defineConfig } from 'wromo/config';
import react from '@wromojs/react';
import preact from '@wromojs/preact';

// https://wromo.build/config
export default defineConfig({
	integrations: [react(), preact()],
});