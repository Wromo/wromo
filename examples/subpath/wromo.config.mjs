import { defineConfig } from 'wromo/config';
import react from '@wromojs/react';

// https://wromo.build/config
export default defineConfig({
	integrations: [react()],
	site: 'http://example.com',
	base: '/blog',
});
