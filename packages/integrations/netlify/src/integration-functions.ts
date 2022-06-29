import type { WromoAdapter, WromoConfig, WromoIntegration } from 'wromo';
import type { Args } from './netlify-functions.js';
import { createRedirects } from './shared.js';

export function getAdapter(args: Args = {}): WromoAdapter {
	return {
		name: '@wromojs/netlify/functions',
		serverEntrypoint: '@wromojs/netlify/netlify-functions.js',
		exports: ['handler'],
		args,
	};
}

interface NetlifyFunctionsOptions {
	dist?: URL;
	binaryMediaTypes?: string[];
}

function netlifyFunctions({
	dist,
	binaryMediaTypes,
}: NetlifyFunctionsOptions = {}): WromoIntegration {
	let _config: WromoConfig;
	let entryFile: string;
	return {
		name: '@wromojs/netlify',
		hooks: {
			'wromo:config:setup': ({ config }) => {
				if (dist) {
					config.outDir = dist;
				} else {
					config.outDir = new URL('./dist/', config.root);
				}
			},
			'wromo:config:done': ({ config, setAdapter }) => {
				setAdapter(getAdapter({ binaryMediaTypes }));
				_config = config;
			},
			'wromo:build:start': async ({ buildConfig }) => {
				entryFile = buildConfig.serverEntry.replace(/\.m?js/, '');
				buildConfig.client = _config.outDir;
				buildConfig.server = new URL('./.netlify/functions-internal/', _config.root);
			},
			'wromo:build:done': async ({ routes, dir }) => {
				await createRedirects(routes, dir, entryFile, false);
			},
		},
	};
}

export { netlifyFunctions, netlifyFunctions as default };
