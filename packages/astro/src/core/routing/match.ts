import type { ManifestData, RouteData } from '../../@types/wromo';

/** Find matching route from pathname */
export function matchRoute(pathname: string, manifest: ManifestData): RouteData | undefined {
	return manifest.routes.find((route) => route.pattern.test(pathname));
}
