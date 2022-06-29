import { defineConfig } from 'wromo/config';
import vue from '@wromojs/vue';

// https://wromo.build/config
export default defineConfig({
	integrations: [vue({
		template: {
			compilerOptions: {
				isCustomElement: tag => tag.includes('my-button')
			}
		}
	})],
});
