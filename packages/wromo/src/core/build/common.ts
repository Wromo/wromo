import npath from 'path';
import type { WromoConfig, RouteType } from '../../@types/wromo';
import { appendForwardSlash } from '../../core/path.js';

const STATUS_CODE_PAGES = new Set(['/404', '/500']);

function getOutRoot(wromoConfig: WromoConfig): URL {
	return new URL('./', wromoConfig.outDir);
}

export function getOutFolder(
	wromoConfig: WromoConfig,
	pathname: string,
	routeType: RouteType
): URL {
	const outRoot = getOutRoot(wromoConfig);

	// This is the root folder to write to.
	switch (routeType) {
		case 'endpoint':
			return new URL('.' + appendForwardSlash(npath.dirname(pathname)), outRoot);
		case 'page':
			switch (wromoConfig.build.format) {
				case 'directory': {
					if (STATUS_CODE_PAGES.has(pathname)) {
						return new URL('.' + appendForwardSlash(npath.dirname(pathname)), outRoot);
					}
					return new URL('.' + appendForwardSlash(pathname), outRoot);
				}
				case 'file': {
					return new URL('.' + appendForwardSlash(npath.dirname(pathname)), outRoot);
				}
			}
	}
}

export function getOutFile(
	wromoConfig: WromoConfig,
	outFolder: URL,
	pathname: string,
	routeType: RouteType
): URL {
	switch (routeType) {
		case 'endpoint':
			return new URL(npath.basename(pathname), outFolder);
		case 'page':
			switch (wromoConfig.build.format) {
				case 'directory': {
					if (STATUS_CODE_PAGES.has(pathname)) {
						const baseName = npath.basename(pathname);
						return new URL('./' + (baseName || 'index') + '.html', outFolder);
					}
					return new URL('./index.html', outFolder);
				}
				case 'file': {
					const baseName = npath.basename(pathname);
					return new URL('./' + (baseName || 'index') + '.html', outFolder);
				}
			}
	}
}
