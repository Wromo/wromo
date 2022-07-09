import { defineConfig } from 'wromo/config';
import { VitePWA } from 'vite-plugin-pwa';

// https://wromo.build/config
export default defineConfig({
	vite: {
		plugins: [VitePWA()],
	},
});
