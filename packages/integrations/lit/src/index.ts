import type { WromoIntegration } from 'wromo';
import { readFileSync } from 'node:fs';

function getViteConfiguration() {
	return {
		optimizeDeps: {
			include: [
				'@wromojs/lit/client-shim.js',
				'@wromojs/lit/hydration-support.js',
				'@webcomponents/template-shadowroot/template-shadowroot.js',
				'lit/experimental-hydrate-support.js',
			],
			exclude: ['@wromojs/lit/server.js'],
		},
		ssr: {
			external: [
				'lit-element/lit-element.js',
				'@lit-labs/ssr/lib/install-global-dom-shim.js',
				'@lit-labs/ssr/lib/render-lit-html.js',
				'@lit-labs/ssr/lib/lit-element-renderer.js',
				'@wromojs/lit/server.js',
			],
		},
	};
}

export default function (): WromoIntegration {
	return {
		name: '@wromojs/lit',
		hooks: {
			'wromo:config:setup': ({ updateConfig, addRenderer, injectScript }) => {
				// Inject the necessary polyfills on every page (inlined for speed).
				injectScript(
					'head-inline',
					readFileSync(new URL('../client-shim.min.js', import.meta.url), { encoding: 'utf-8' })
				);
				// Inject the hydration code, before a component is hydrated.
				injectScript('before-hydration', `import '@wromojs/lit/hydration-support.js';`);
				// Add the lit renderer so that Wromo can understand lit components.
				addRenderer({
					name: '@wromojs/lit',
					serverEntrypoint: '@wromojs/lit/server.js',
				});
				// Update the vite configuration.
				updateConfig({
					vite: getViteConfiguration(),
				});
			},
			'wromo:build:setup': ({ vite, target }) => {
				if (target === 'server') {
					if (!vite.ssr) {
						vite.ssr = {};
					}
					if (!vite.ssr.noExternal) {
						vite.ssr.noExternal = [];
					}
					if (Array.isArray(vite.ssr.noExternal)) {
						vite.ssr.noExternal.push('lit');
					}
				}
			},
		},
	};
}
