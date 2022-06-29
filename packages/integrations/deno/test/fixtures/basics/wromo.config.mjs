import { defineConfig } from 'wromo/config';
import deno from '@wromojs/deno';
import react from '@wromojs/react';

export default defineConfig({
	adapter: deno(),
	integrations: [react()],
	experimental: {
		ssr: true
	}
})
