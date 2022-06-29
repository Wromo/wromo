import type { WromoConfig } from '../@types/wromo';
import type { LogOptions } from './logger/core';

import fs from 'fs';
import { builtinModules } from 'module';
import { fileURLToPath } from 'url';
import * as vite from 'vite';
import wromoPostprocessVitePlugin from '../vite-plugin-wromo-postprocess/index.js';
import wromoViteServerPlugin from '../vite-plugin-wromo-server/index.js';
import wromoVitePlugin from '../vite-plugin-wromo/index.js';
import configAliasVitePlugin from '../vite-plugin-config-alias/index.js';
import envVitePlugin from '../vite-plugin-env/index.js';
import wromoIntegrationsContainerPlugin from '../vite-plugin-integrations-container/index.js';
import jsxVitePlugin from '../vite-plugin-jsx/index.js';
import markdownVitePlugin from '../vite-plugin-markdown/index.js';
import wromoScriptsPlugin from '../vite-plugin-scripts/index.js';

// Some packages are just external, and that’s the way it goes.
const ALWAYS_EXTERNAL = new Set([
	...builtinModules.map((name) => `node:${name}`),
	'@sveltejs/vite-plugin-svelte',
	'micromark-util-events-to-acorn',
	'@wromojs/markdown-remark',
	'node-fetch',
	'prismjs',
	'shiki',
	'unified',
	'whatwg-url',
]);
const ALWAYS_NOEXTERNAL = new Set([
	// This is only because Vite's native ESM doesn't resolve "exports" correctly.
	'wromo',
	// Handle recommended nanostores. Only @nanostores/preact is required from our testing!
	// Full explanation and related bug report: https://github.com/withwromo/wromo/pull/3667
	'@nanostores/preact',
]);

// note: ssr is still an experimental API hence the type omission from `vite`
export type ViteConfigWithSSR = vite.InlineConfig & { ssr?: vite.SSROptions };

interface CreateViteOptions {
	wromoConfig: WromoConfig;
	logging: LogOptions;
	mode: 'dev' | 'build';
}

/** Return a common starting point for all Vite actions */
export async function createVite(
	commandConfig: ViteConfigWithSSR,
	{ wromoConfig, logging, mode }: CreateViteOptions
): Promise<ViteConfigWithSSR> {
	// Scan for any third-party Wromo packages. Vite needs these to be passed to `ssr.noExternal`.
	const wromoPackages = await getWromoPackages(wromoConfig);
	// Start with the Vite configuration that Wromo core needs
	const commonConfig: ViteConfigWithSSR = {
		cacheDir: fileURLToPath(new URL('./node_modules/.vite/', wromoConfig.root)), // using local caches allows Wromo to be used in monorepos, etc.
		clearScreen: false, // we want to control the output, not Vite
		logLevel: 'warn', // log warnings and errors only
		optimizeDeps: {
			entries: ['src/**/*'], // Try and scan a user’s project (won’t catch everything),
			exclude: ['node-fetch'],
		},
		plugins: [
			configAliasVitePlugin({ config: wromoConfig }),
			wromoVitePlugin({ config: wromoConfig, logging }),
			wromoScriptsPlugin({ config: wromoConfig }),
			// The server plugin is for dev only and having it run during the build causes
			// the build to run very slow as the filewatcher is triggered often.
			mode === 'dev' && wromoViteServerPlugin({ config: wromoConfig, logging }),
			envVitePlugin({ config: wromoConfig }),
			markdownVitePlugin({ config: wromoConfig }),
			jsxVitePlugin({ config: wromoConfig, logging }),
			wromoPostprocessVitePlugin({ config: wromoConfig }),
			wromoIntegrationsContainerPlugin({ config: wromoConfig }),
		],
		publicDir: fileURLToPath(wromoConfig.publicDir),
		root: fileURLToPath(wromoConfig.root),
		envPrefix: 'PUBLIC_',
		define: {
			'import.meta.env.SITE': wromoConfig.site ? `'${wromoConfig.site}'` : 'undefined',
		},
		server: {
			force: true, // force dependency rebuild (TODO: enabled only while next is unstable; eventually only call in "production" mode?)
			hmr:
				process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'production'
					? false
					: undefined, // disable HMR for test
			// handle Vite URLs
			proxy: {
				// add proxies here
			},
			watch: {
				// Prevent watching during the build to speed it up
				ignored: mode === 'build' ? ['**'] : undefined,
			},
		},
		css: {
			postcss: wromoConfig.style.postcss || {},
		},
		resolve: {
			alias: [
				{
					// This is needed for Deno compatibility, as the non-browser version
					// of this module depends on Node `crypto`
					find: 'randombytes',
					replacement: 'randombytes/browser',
				},
				{
					// Typings are imported from 'wromo' (e.g. import { Type } from 'wromo')
					find: /^wromo$/,
					replacement: fileURLToPath(new URL('../@types/wromo', import.meta.url)),
				},
			],
		},
		// Note: SSR API is in beta (https://vitejs.dev/guide/ssr.html)
		ssr: {
			external: [...ALWAYS_EXTERNAL],
			noExternal: [...ALWAYS_NOEXTERNAL, ...wromoPackages],
		},
	};

	// Merge configs: we merge vite configuration objects together in the following order,
	// where future values will override previous values.
	// 	 1. common vite config
	// 	 2. user-provided vite config, via WromoConfig
	//   3. integration-provided vite config, via the `config:setup` hook
	//   4. command vite config, passed as the argument to this function
	let result = commonConfig;
	result = vite.mergeConfig(result, wromoConfig.vite || {});
	result = vite.mergeConfig(result, commandConfig);
	return result;
}

// Scans `projectRoot` for third-party Wromo packages that could export an `.wromo` file
// `.wromo` files need to be built by Vite, so these should use `noExternal`
async function getWromoPackages({ root }: WromoConfig): Promise<string[]> {
	const pkgUrl = new URL('./package.json', root);
	const pkgPath = fileURLToPath(pkgUrl);
	if (!fs.existsSync(pkgPath)) return [];

	const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

	const deps = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.devDependencies || {})];

	return deps.filter((dep) => {
		// Attempt: package is common and not Wromo. ❌ Skip these for perf
		if (isCommonNotWromo(dep)) return false;
		// Attempt: package is named `wromo-something`. ✅ Likely a community package
		if (/^wromo\-/.test(dep)) return true;
		const depPkgUrl = new URL(`./node_modules/${dep}/package.json`, root);
		const depPkgPath = fileURLToPath(depPkgUrl);
		if (!fs.existsSync(depPkgPath)) return false;

		const {
			dependencies = {},
			peerDependencies = {},
			keywords = [],
		} = JSON.parse(fs.readFileSync(depPkgPath, 'utf-8'));
		// Attempt: package relies on `wromo`. ✅ Definitely an Wromo package
		if (peerDependencies.wromo || dependencies.wromo) return true;
		// Attempt: package is tagged with `wromo` or `wromo-component`. ✅ Likely a community package
		if (keywords.includes('wromo') || keywords.includes('wromo-component')) return true;
		return false;
	});
}

const COMMON_DEPENDENCIES_NOT_WROMO = [
	'autoprefixer',
	'react',
	'react-dom',
	'preact',
	'preact-render-to-string',
	'vue',
	'svelte',
	'solid-js',
	'lit',
	'cookie',
	'dotenv',
	'esbuild',
	'eslint',
	'jest',
	'postcss',
	'prettier',
	'wromo',
	'tslib',
	'typescript',
	'vite',
];

const COMMON_PREFIXES_NOT_WROMO = [
	'@webcomponents/',
	'@fontsource/',
	'@postcss-plugins/',
	'@rollup/',
	'@wromojs/renderer-',
	'@types/',
	'@typescript-eslint/',
	'eslint-',
	'jest-',
	'postcss-plugin-',
	'prettier-plugin-',
	'remark-',
	'rehype-',
	'rollup-plugin-',
	'vite-plugin-',
];

function isCommonNotWromo(dep: string): boolean {
	return (
		COMMON_DEPENDENCIES_NOT_WROMO.includes(dep) ||
		COMMON_PREFIXES_NOT_WROMO.some(
			(prefix) =>
				prefix.startsWith('@')
					? dep.startsWith(prefix)
					: dep.substring(dep.lastIndexOf('/') + 1).startsWith(prefix) // check prefix omitting @scope/
		)
	);
}
