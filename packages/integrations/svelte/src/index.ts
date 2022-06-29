import type { Options } from '@sveltejs/vite-plugin-svelte';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import type { WromoConfig, WromoIntegration, WromoRenderer } from 'wromo';
import preprocess from 'svelte-preprocess';
import type { UserConfig } from 'vite';

function getRenderer(): WromoRenderer {
	return {
		name: '@wromojs/svelte',
		clientEntrypoint: '@wromojs/svelte/client.js',
		serverEntrypoint: '@wromojs/svelte/server.js',
	};
}

type ViteConfigurationArgs = {
	isDev: boolean;
	options?: Options | OptionsCallback;
	postcssConfig: WromoConfig['style']['postcss'];
};

function getViteConfiguration({
	options,
	postcssConfig,
	isDev,
}: ViteConfigurationArgs): UserConfig {
	const defaultOptions: Partial<Options> = {
		emitCss: true,
		compilerOptions: { dev: isDev, hydratable: true },
		preprocess: [
			preprocess({
				less: true,
				postcss: postcssConfig,
				sass: { renderSync: true },
				scss: { renderSync: true },
				stylus: true,
				typescript: true,
			}),
		],
	};

	let resolvedOptions: Partial<Options>;

	if (!options) {
		resolvedOptions = defaultOptions;
	} else if (typeof options === 'function') {
		resolvedOptions = options(defaultOptions);
	} else {
		resolvedOptions = {
			...options,
			...defaultOptions,
			compilerOptions: {
				...options.compilerOptions,
				// Always use dev and hydratable from defaults
				...defaultOptions.compilerOptions,
			},
			// Ignore default preprocessor if the user provided their own
			preprocess: options.preprocess ?? defaultOptions.preprocess,
		};
	}

	return {
		optimizeDeps: {
			include: ['@wromojs/svelte/client.js', 'svelte', 'svelte/internal'],
			exclude: ['@wromojs/svelte/server.js'],
		},
		plugins: [svelte(resolvedOptions)],
	};
}

type OptionsCallback = (defaultOptions: Options) => Options;
export default function (options?: Options | OptionsCallback): WromoIntegration {
	return {
		name: '@wromojs/svelte',
		hooks: {
			// Anything that gets returned here is merged into Wromo Config
			'wromo:config:setup': ({ command, updateConfig, addRenderer, config }) => {
				addRenderer(getRenderer());
				updateConfig({
					vite: getViteConfiguration({
						options,
						isDev: command === 'dev',
						postcssConfig: config.style.postcss,
					}),
				});
			},
		},
	};
}
