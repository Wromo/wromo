import { WromoIntegration } from 'wromo';

function getRenderer() {
	return {
		name: '@wromojs/preact',
		clientEntrypoint: '@wromojs/preact/client.js',
		serverEntrypoint: '@wromojs/preact/server.js',
		jsxImportSource: 'preact',
		jsxTransformOptions: async () => {
			const {
				default: { default: jsx },
				// @ts-expect-error types not found
			} = await import('@babel/plugin-transform-react-jsx');
			return {
				plugins: [jsx({}, { runtime: 'automatic', importSource: 'preact' })],
			};
		},
	};
}

function getViteConfiguration() {
	return {
		optimizeDeps: {
			include: [
				'@wromojs/preact/client.js',
				'preact',
				'preact/jsx-runtime',
				'preact-render-to-string',
			],
			exclude: ['@wromojs/preact/server.js'],
		},
		ssr: {
			external: ['preact-render-to-string'],
		},
	};
}

export default function (): WromoIntegration {
	return {
		name: '@wromojs/preact',
		hooks: {
			'wromo:config:setup': ({ addRenderer, updateConfig }) => {
				addRenderer(getRenderer());
				updateConfig({
					vite: getViteConfiguration(),
				});
			},
		},
	};
}
