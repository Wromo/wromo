import { WromoIntegration } from 'wromo';
import { version as ReactVersion } from 'react-dom';

function getRenderer() {
	return {
		name: '@wromojs/react',
		clientEntrypoint: ReactVersion.startsWith('18.')
			? '@wromojs/react/client.js'
			: '@wromojs/react/client-v17.js',
		serverEntrypoint: ReactVersion.startsWith('18.')
			? '@wromojs/react/server.js'
			: '@wromojs/react/server-v17.js',
		jsxImportSource: 'react',
		jsxTransformOptions: async () => {
			const {
				default: { default: jsx },
				// @ts-expect-error types not found
			} = await import('@babel/plugin-transform-react-jsx');
			return {
				plugins: [
					jsx(
						{},
						{
							runtime: 'automatic',
							// This option tells the JSX transform how to construct the "*/jsx-runtime" import.
							// In React v17, we had to shim this due to an export map issue in React.
							// In React v18, this issue was fixed and we can import "react/jsx-runtime" directly.
							// See `./jsx-runtime.js` for more details.
							importSource: ReactVersion.startsWith('18.') ? 'react' : '@wromojs/react',
						}
					),
				],
			};
		},
	};
}

function getViteConfiguration() {
	return {
		optimizeDeps: {
			include: [
				ReactVersion.startsWith('18.')
					? '@wromojs/react/client.js'
					: '@wromojs/react/client-v17.js',
				'react',
				'react/jsx-runtime',
				'react/jsx-dev-runtime',
				'react-dom',
			],
			exclude: [
				ReactVersion.startsWith('18.')
					? '@wromojs/react/server.js'
					: '@wromojs/react/server-v17.js',
			],
		},
		resolve: {
			dedupe: ['react', 'react-dom'],
		},
		ssr: {
			external: ReactVersion.startsWith('18.')
				? ['react-dom/server', 'react-dom/client']
				: ['react-dom/server.js', 'react-dom/client.js'],
		},
	};
}

export default function (): WromoIntegration {
	return {
		name: '@wromojs/react',
		hooks: {
			'wromo:config:setup': ({ addRenderer, updateConfig }) => {
				addRenderer(getRenderer());
				updateConfig({ vite: getViteConfiguration() });
			},
		},
	};
}
