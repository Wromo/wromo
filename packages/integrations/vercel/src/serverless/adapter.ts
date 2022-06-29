import type { WromoAdapter, WromoConfig, WromoIntegration } from 'wromo';

import { getVercelOutput, writeJson } from '../lib/fs.js';
import { copyDependenciesToFunction } from '../lib/nft.js';
import { getRedirects } from '../lib/redirects.js';

const PACKAGE_NAME = '@wromojs/vercel/serverless';

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
			'wromo:build:start': async ({ buildConfig }) => {
				if (String(process.env.ENABLE_VC_BUILD) !== '1') {
					throw new Error(
						`The enviroment variable "ENABLE_VC_BUILD" was not found. Make sure you have it set to "1" in your Vercel project.\nLearn how to set enviroment variables here: https://vercel.com/docs/concepts/projects/environment-variables`
					);
				}

				buildConfig.serverEntry = serverEntry = 'entry.js';
				buildConfig.client = new URL('./static/', _config.outDir);
				buildConfig.server = functionFolder = new URL('./functions/render.func/', _config.outDir);
			},
			'wromo:build:done': async ({ routes }) => {
				// Copy necessary files (e.g. node_modules/)
				await copyDependenciesToFunction(_config.root, functionFolder, serverEntry);

				// Enable ESM
				// https://aws.amazon.com/blogs/compute/using-node-js-es-modules-and-top-level-await-in-aws-lambda/
				await writeJson(new URL(`./package.json`, functionFolder), {
					type: 'module',
				});

				// Serverless function config
				// https://vercel.com/docs/build-output-api/v3#vercel-primitives/serverless-functions/configuration
				await writeJson(new URL(`./.vc-config.json`, functionFolder), {
					runtime: getRuntime(),
					handler: serverEntry,
					launcherType: 'Nodejs',
				});

				// Output configuration
				// https://vercel.com/docs/build-output-api/v3#build-output-configuration
				await writeJson(new URL(`./config.json`, _config.outDir), {
					version: 3,
					routes: [
						...getRedirects(routes, _config),
						{ handle: 'filesystem' },
						{ src: '/.*', dest: 'render' },
					],
				});
			},
		},
	};
}

function getRuntime() {
	const version = process.version.slice(1); // 'v16.5.0' --> '16.5.0'
	const major = version.split('.')[0]; // '16.5.0' --> '16'
	return `nodejs${major}.x`;
}
