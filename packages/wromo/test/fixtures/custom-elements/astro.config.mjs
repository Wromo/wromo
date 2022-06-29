import { defineConfig } from 'wromo/config';
import ceIntegration from '@test/custom-element-renderer';

export default defineConfig({
	integrations: [ceIntegration()],
	experimental: {
		integrations: true
	}
})
