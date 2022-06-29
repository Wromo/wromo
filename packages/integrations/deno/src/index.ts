import type { WromoAdapter, WromoIntegration } from 'wromo';
import esbuild from 'esbuild';
import * as fs from 'fs';
import * as npath from 'path';
import { fileURLToPath } from 'url';

interface Options {
	port?: number;
	hostname?: string;
}

export function getAdapter(args?: Options): WromoAdapter {
	return {
		name: '@wromojs/deno',
		serverEntrypoint: '@wromojs/deno/server.js',
		args: args ?? {},
		exports: ['stop', 'handle', 'start', 'running'],
	};
}

export default function createIntegration(args?: Options): WromoIntegration {
	let _buildConfig: any;
	let _vite: any;
	return {
		name: '@wromojs/deno',
		hooks: {
			'wromo:config:done': ({ setAdapter }) => {
				setAdapter(getAdapter(args));
			},
			'wromo:build:start': ({ buildConfig }) => {
				_buildConfig = buildConfig;
			},
			'wromo:build:setup': ({ vite, target }) => {
				if (target === 'server') {
					_vite = vite;
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
						noExternal: true,
					};
				}
			},
			'wromo:build:done': async () => {
				const entryUrl = new URL(_buildConfig.serverEntry, _buildConfig.server);
				const pth = fileURLToPath(entryUrl);
				await esbuild.build({
					target: 'es2020',
					platform: 'browser',
					entryPoints: [pth],
					outfile: pth,
					allowOverwrite: true,
					format: 'esm',
					bundle: true,
					external: ['@wromojs/markdown-remark'],
				});

				// Remove chunks, if they exist. Since we have bundled via esbuild these chunks are trash.
				try {
					const chunkFileNames =
						_vite?.build?.rollupOptions?.output?.chunkFileNames ?? 'chunks/chunk.[hash].mjs';
					const chunkPath = npath.dirname(chunkFileNames);
					const chunksDirUrl = new URL(chunkPath + '/', _buildConfig.server);
					await fs.promises.rm(chunksDirUrl, { recursive: true, force: true });
				} catch {}
			},
		},
	};
}
