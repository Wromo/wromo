import { defineConfig } from 'wromo/config';
import deno from '@wromojs/deno';

export default defineConfig({
	adapter: deno(),
	experimental: {
		ssr: true
	}
})
