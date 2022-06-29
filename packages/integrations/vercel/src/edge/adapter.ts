import type { WromoAdapter, WromoConfig, WromoIntegration } from 'wromo';

import { getVercelOutput, writeJson } from '../lib/fs.js';
import { getRedirects } from '../lib/redirects.js';

const PACKAGE_NAME = '@wromojs/vercel/edge';

function getAdapter(): WromoAdapter {
	return {
		name: PACKAGE_NAME,
		serverEntrypoint: `${PACKAGE_NAME}/entrypoint`,
		exports: ['default'],
	};
}

export default function vercelEdge(): WromoIntegration {
	let _config: WromoConfig;
	let functionFolder: URL;
	let serverEntry: string;

	return {
		name: PACKAGE_NAME,
		hooks: {
			'wromo:config:setup': ({ config }) => {
				config.outDir = getVercelOutput(config.root);
			},
			'wromo:config:done': ({ setAdapter, config }) => {
				setAdapter(getAdapter());
				_config = config;
			},
			'wromo:build:setup': ({ vite, target }) => {
				if (target === 'server') {
					vite.resolve ||= {};
					vite.resolve.alias ||= {};
					const alias = vite.resolve.alias as Record<string, string>;
					alias['react-dom/server'] = 'react-dom/server.browser';
					vite.ssr = {
						noExternal: true,
					};
				}
			},
			'wromo:build:start': async ({ buildConfig }) => {
				if (String(process.env.ENABLE_VC_BUILD) !== '1') {
					throw new Error(
						`The enviroment variable "ENABLE_VC_BUILD" was not found. Make sure you have it set to "1" in your Vercel project.\nLearn how to set enviroment variables here: https://vercel.com/docs/concepts/projects/environment-variables`
					);
				}

				buildConfig.serverEntry = serverEntry = 'entry.mjs';
				buildConfig.client = new URL('./static/', _config.outDir);
				buildConfig.server = functionFolder = new URL('./functions/render.func/', _config.outDir);
			},
			'wromo:build:done': async ({ routes }) => {
				// Edge function config
				// https://vercel.com/docs/build-output-api/v3#vercel-primitives/edge-functions/configuration
				await writeJson(new URL(`./.vc-config.json`, functionFolder), {
					runtime: 'edge',
					entrypoint: serverEntry,
				});

				// Output configuration
				// https://vercel.com/docs/build-output-api/v3#build-output-configuration
				await writeJson(new URL(`./config.json`, _config.outDir), {
					version: 3,
					routes: [
						...getRedirects(routes, _config),
						{ handle: 'filesystem' },
						{ src: '/.*', middlewarePath: 'render' },
					],
				});
			},
		},
	};
}
