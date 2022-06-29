import { defineConfig } from 'wromo/config';
import react from '@wromojs/react';

// https://wromo.build/config
export default defineConfig({
	// Enable React to support React JSX components.
	integrations: [react()],
});
