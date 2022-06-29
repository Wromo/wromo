import type { WromoAdapter, WromoConfig, WromoIntegration, BuildConfig } from 'wromo';
import esbuild from 'esbuild';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

export function getAdapter(): WromoAdapter {
	return {
		name: '@wromojs/cloudflare',
		serverEntrypoint: '@wromojs/cloudflare/server.js',
		exports: ['default'],
	};
}

export default function createIntegration(): WromoIntegration {
	let _config: WromoConfig;
	let _buildConfig: BuildConfig;

	return {
		name: '@wromojs/cloudflare',
		hooks: {
			'wromo:config:done': ({ setAdapter, config }) => {
				setAdapter(getAdapter());
				_config = config;
			},
			'wromo:build:start': ({ buildConfig }) => {
				_buildConfig = buildConfig;
				buildConfig.serverEntry = '_worker.js';
				buildConfig.client = new URL('./static/', _config.outDir);
				buildConfig.server = new URL('./', _config.outDir);
			},
			'wromo:build:setup': ({ vite, target }) => {
				if (target === 'server') {
					vite.resolve = vite.resolve || {};
					vite.resolve.alias = vite.resolve.alias || {};

					const aliases = [{ find: 'react-dom/server', replacement: 'react-dom/server.browser' }];

					if (Array.isArray(vite.resolve.alias)) {
						vite.resolve.alias = [...vite.resolve.alias, ...aliases];
					} else {
						for (const alias of aliases) {
							(vite.resolve.alias as Record<string, string>)[alias.find] = alias.replacement;
						}
					}

					vite.ssr = {
						target: 'webworker',
						noExternal: true,
					};
				}
			},
			'wromo:build:done': async () => {
				const entryUrl = new URL(_buildConfig.serverEntry, _buildConfig.server);
				const pkg = fileURLToPath(entryUrl);

				await esbuild.build({
					target: 'es2020',
					platform: 'browser',
					entryPoints: [pkg],
					outfile: pkg,
					allowOverwrite: true,
					format: 'esm',
					bundle: true,
					minify: true,
				});

				// throw the server folder in the bin
				const chunksUrl = new URL('./chunks', _buildConfig.server);
				await fs.promises.rm(chunksUrl, { recursive: true, force: true });
			},
		},
	};
}
