import type { WromoConfig, RouteData, SerializedRouteData } from '../../../@types/wromo';

import { getRouteGenerator } from './generator.js';

export function serializeRouteData(
	routeData: RouteData,
	trailingSlash: WromoConfig['trailingSlash']
): SerializedRouteData {
	return {
		...routeData,
		generate: undefined,
		pattern: routeData.pattern.source,
		_meta: { trailingSlash },
	};
}

export function deserializeRouteData(rawRouteData: SerializedRouteData): RouteData {
	return {
		route: rawRouteData.route,
		type: rawRouteData.type,
		pattern: new RegExp(rawRouteData.pattern),
		params: rawRouteData.params,
		component: rawRouteData.component,
		generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
		pathname: rawRouteData.pathname || undefined,
		segments: rawRouteData.segments,
	};
}
