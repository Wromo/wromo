import { viteID } from '../dist/core/util.js';

/**
 *
 * @returns {import('../src/@types/wromo').WromoIntegration}
 */
export default function () {
	return {
		name: 'my-ssr-adapter',
		hooks: {
			'wromo:config:setup': ({ updateConfig }) => {
				updateConfig({
					vite: {
						plugins: [
							{
								resolveId(id) {
									if (id === '@my-ssr') {
										return id;
									} else if (id === 'wromo/app') {
										const viteId = viteID(new URL('../dist/core/app/index.js', import.meta.url));
										return viteId;
									}
								},
								load(id) {
									if (id === '@my-ssr') {
										return `import { App } from 'wromo/app';export function createExports(manifest) { return { manifest, createApp: () => new App(manifest) }; }`;
									}
								},
							},
						],
					},
				});
			},
			'wromo:config:done': ({ setAdapter }) => {
				setAdapter({
					name: 'my-ssr-adapter',
					serverEntrypoint: '@my-ssr',
					exports: ['manifest', 'createApp'],
				});
			},
		},
	};
}
