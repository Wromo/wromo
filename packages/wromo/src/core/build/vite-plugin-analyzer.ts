import type { PluginContext } from 'rollup';
import type { Plugin as VitePlugin } from 'vite';
import type { WromoConfig } from '../../@types/wromo';
import type { BuildInternals } from '../../core/build/internal.js';
import type { PluginMetadata as WromoPluginMetadata } from '../../vite-plugin-wromo/types';

import { prependForwardSlash } from '../../core/path.js';
import { resolveClientDevPath } from '../../core/render/dev/resolve.js';
import { getTopLevelPages } from './graph.js';
import { getPageDataByViteID, trackClientOnlyPageDatas } from './internal.js';

export function vitePluginAnalyzer(
	wromoConfig: WromoConfig,
	internals: BuildInternals
): VitePlugin {
	function hoistedScriptScanner() {
		const uniqueHoistedIds = new Map<string, string>();
		const pageScripts = new Map<string, Set<string>>();

		return {
			scan(this: PluginContext, scripts: WromoPluginMetadata['wromo']['scripts'], from: string) {
				const hoistedScripts = new Set<string>();
				for (let i = 0; i < scripts.length; i++) {
					const hid = `${from.replace('/@fs', '')}?wromo&type=script&index=${i}&lang.ts`;
					hoistedScripts.add(hid);
				}

				if (hoistedScripts.size) {
					for (const pageId of getTopLevelPages(from, this)) {
						for (const hid of hoistedScripts) {
							if (pageScripts.has(pageId)) {
								pageScripts.get(pageId)?.add(hid);
							} else {
								pageScripts.set(pageId, new Set([hid]));
							}
						}
					}
				}
			},

			finalize() {
				for (const [pageId, hoistedScripts] of pageScripts) {
					const pageData = getPageDataByViteID(internals, pageId);
					if (!pageData) continue;

					const { component } = pageData;
					const wromoModuleId = prependForwardSlash(component);

					const uniqueHoistedId = JSON.stringify(Array.from(hoistedScripts).sort());
					let moduleId: string;

					// If we're already tracking this set of hoisted scripts, get the unique id
					if (uniqueHoistedIds.has(uniqueHoistedId)) {
						moduleId = uniqueHoistedIds.get(uniqueHoistedId)!;
					} else {
						// Otherwise, create a unique id for this set of hoisted scripts
						moduleId = `/wromo/hoisted.js?q=${uniqueHoistedIds.size}`;
						uniqueHoistedIds.set(uniqueHoistedId, moduleId);
					}
					internals.discoveredScripts.add(moduleId);

					// Make sure to track that this page uses this set of hoisted scripts
					if (internals.hoistedScriptIdToPagesMap.has(moduleId)) {
						const pages = internals.hoistedScriptIdToPagesMap.get(moduleId);
						pages!.add(wromoModuleId);
					} else {
						internals.hoistedScriptIdToPagesMap.set(moduleId, new Set([wromoModuleId]));
						internals.hoistedScriptIdToHoistedMap.set(moduleId, hoistedScripts);
					}
				}
			},
		};
	}

	return {
		name: '@wromo/rollup-plugin-wromo-analyzer',
		generateBundle() {
			const hoistScanner = hoistedScriptScanner();

			const ids = this.getModuleIds();
			for (const id of ids) {
				const info = this.getModuleInfo(id);
				if (!info || !info.meta?.wromo) continue;

				const wromo = info.meta.wromo as WromoPluginMetadata['wromo'];

				for (const c of wromo.hydratedComponents) {
					const rid = c.resolvedPath ? resolveClientDevPath(c.resolvedPath) : c.specifier;
					internals.discoveredHydratedComponents.add(rid);
				}

				// Scan hoisted scripts
				hoistScanner.scan.call(this, wromo.scripts, id);

				if (wromo.clientOnlyComponents.length) {
					const clientOnlys: string[] = [];

					for (const c of wromo.clientOnlyComponents) {
						const cid = c.resolvedPath ? resolveClientDevPath(c.resolvedPath) : c.specifier;
						internals.discoveredClientOnlyComponents.add(cid);
						clientOnlys.push(cid);
					}

					for (const pageId of getTopLevelPages(id, this)) {
						const pageData = getPageDataByViteID(internals, pageId);
						if (!pageData) continue;

						trackClientOnlyPageDatas(internals, pageData, clientOnlys);
					}
				}
			}

			// Finalize hoisting
			hoistScanner.finalize();
		},
	};
}
