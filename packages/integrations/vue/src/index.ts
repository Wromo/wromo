import type { Options } from '@vitejs/plugin-vue';
import vue from '@vitejs/plugin-vue';
import type { WromoIntegration, WromoRenderer } from 'wromo';

function getRenderer(): WromoRenderer {
	return {
		name: '@wromojs/vue',
		clientEntrypoint: '@wromojs/vue/client.js',
		serverEntrypoint: '@wromojs/vue/server.js',
	};
}

function getViteConfiguration(options?: Options) {
	return {
		optimizeDeps: {
			include: ['@wromojs/vue/client.js', 'vue'],
			exclude: ['@wromojs/vue/server.js'],
		},
		plugins: [vue(options)],
		ssr: {
			external: ['@vue/server-renderer'],
		},
	};
}

export default function (options?: Options): WromoIntegration {
	return {
		name: '@wromojs/vue',
		hooks: {
			'wromo:config:setup': ({ addRenderer, updateConfig }) => {
				addRenderer(getRenderer());
				updateConfig({ vite: getViteConfiguration(options) });
			},
		},
	};
}
