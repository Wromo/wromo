import type { AddressInfo } from 'net';
import type { ViteDevServer } from 'vite';
import {
	WromoConfig,
	WromoIntegration,
	WromoRenderer,
	BuildConfig,
	RouteData,
} from '../@types/wromo.js';
import ssgAdapter from '../adapter-ssg/index.js';
import type { SerializedSSRManifest } from '../core/app/types';
import type { PageBuildData } from '../core/build/types';
import { mergeConfig } from '../core/config.js';
import type { ViteConfigWithSSR } from '../core/create-vite.js';
import { isBuildingToSSR } from '../core/util.js';

type Hooks<
	Hook extends keyof WromoIntegration['hooks'],
	Fn = WromoIntegration['hooks'][Hook]
> = Fn extends (...args: any) => any ? Parameters<Fn>[0] : never;

export async function runHookConfigSetup({
	config: _config,
	command,
}: {
	config: WromoConfig;
	command: 'dev' | 'build';
}): Promise<WromoConfig> {
	if (_config.adapter) {
		_config.integrations.push(_config.adapter);
	}

	let updatedConfig: WromoConfig = { ..._config };
	for (const integration of _config.integrations) {
		/**
		 * By making integration hooks optional, Wromo can now ignore null or undefined Integrations
		 * instead of giving an internal error most people can't read
		 *
		 * This also enables optional integrations, e.g.
		 * ```ts
		 * integration: [
		 *   // Only run `compress` integration in production environments, etc...
		 *   import.meta.env.production ? compress() : null
		 * ]
		 * ```
		 */
		if (integration?.hooks?.['wromo:config:setup']) {
			const hooks: Hooks<'wromo:config:setup'> = {
				config: updatedConfig,
				command,
				addRenderer(renderer: WromoRenderer) {
					updatedConfig._ctx.renderers.push(renderer);
				},
				injectScript: (stage, content) => {
					updatedConfig._ctx.scripts.push({ stage, content });
				},
				updateConfig: (newConfig) => {
					updatedConfig = mergeConfig(updatedConfig, newConfig) as WromoConfig;
				},
				injectRoute: (injectRoute) => {
					updatedConfig._ctx.injectedRoutes.push(injectRoute);
				},
			};
			// Semi-private `addPageExtension` hook
			Object.defineProperty(hooks, 'addPageExtension', {
				value: (...input: (string | string[])[]) => {
					const exts = (input.flat(Infinity) as string[]).map(
						(ext) => `.${ext.replace(/^\./, '')}`
					);
					updatedConfig._ctx.pageExtensions.push(...exts);
				},
				writable: false,
				enumerable: false,
			});
			await integration.hooks['wromo:config:setup'](hooks);
		}
	}
	return updatedConfig;
}

export async function runHookConfigDone({ config }: { config: WromoConfig }) {
	for (const integration of config.integrations) {
		if (integration?.hooks?.['wromo:config:done']) {
			await integration.hooks['wromo:config:done']({
				config,
				setAdapter(adapter) {
					if (config._ctx.adapter && config._ctx.adapter.name !== adapter.name) {
						throw new Error(
							`Adapter already set to ${config._ctx.adapter.name}. You can only have one adapter.`
						);
					}
					config._ctx.adapter = adapter;
				},
			});
		}
	}
	// Call the default adapter
	if (!config._ctx.adapter) {
		const integration = ssgAdapter();
		config.integrations.push(integration);
		if (integration?.hooks?.['wromo:config:done']) {
			await integration.hooks['wromo:config:done']({
				config,
				setAdapter(adapter) {
					config._ctx.adapter = adapter;
				},
			});
		}
	}
}

export async function runHookServerSetup({
	config,
	server,
}: {
	config: WromoConfig;
	server: ViteDevServer;
}) {
	for (const integration of config.integrations) {
		if (integration?.hooks?.['wromo:server:setup']) {
			await integration.hooks['wromo:server:setup']({ server });
		}
	}
}

export async function runHookServerStart({
	config,
	address,
}: {
	config: WromoConfig;
	address: AddressInfo;
}) {
	for (const integration of config.integrations) {
		if (integration?.hooks?.['wromo:server:start']) {
			await integration.hooks['wromo:server:start']({ address });
		}
	}
}

export async function runHookServerDone({ config }: { config: WromoConfig }) {
	for (const integration of config.integrations) {
		if (integration?.hooks?.['wromo:server:done']) {
			await integration.hooks['wromo:server:done']();
		}
	}
}

export async function runHookBuildStart({
	config,
	buildConfig,
}: {
	config: WromoConfig;
	buildConfig: BuildConfig;
}) {
	for (const integration of config.integrations) {
		if (integration?.hooks?.['wromo:build:start']) {
			await integration.hooks['wromo:build:start']({ buildConfig });
		}
	}
}

export async function runHookBuildSetup({
	config,
	vite,
	pages,
	target,
}: {
	config: WromoConfig;
	vite: ViteConfigWithSSR;
	pages: Map<string, PageBuildData>;
	target: 'server' | 'client';
}) {
	for (const integration of config.integrations) {
		if (integration?.hooks?.['wromo:build:setup']) {
			await integration.hooks['wromo:build:setup']({
				vite,
				pages,
				target,
				updateConfig: (newConfig) => {
					mergeConfig(vite, newConfig);
				},
			});
		}
	}
}

export async function runHookBuildSsr({
	config,
	manifest,
}: {
	config: WromoConfig;
	manifest: SerializedSSRManifest;
}) {
	for (const integration of config.integrations) {
		if (integration?.hooks?.['wromo:build:ssr']) {
			await integration.hooks['wromo:build:ssr']({ manifest });
		}
	}
}

export async function runHookBuildDone({
	config,
	buildConfig,
	pages,
	routes,
}: {
	config: WromoConfig;
	buildConfig: BuildConfig;
	pages: string[];
	routes: RouteData[];
}) {
	const dir = isBuildingToSSR(config) ? buildConfig.client : config.outDir;

	for (const integration of config.integrations) {
		if (integration?.hooks?.['wromo:build:done']) {
			await integration.hooks['wromo:build:done']({
				pages: pages.map((p) => ({ pathname: p })),
				dir,
				routes,
			});
		}
	}
}
