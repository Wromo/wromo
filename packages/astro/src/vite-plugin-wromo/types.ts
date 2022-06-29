import type { TransformResult } from '@wromojs/compiler';

export interface PluginMetadata {
	wromo: {
		hydratedComponents: TransformResult['hydratedComponents'];
		clientOnlyComponents: TransformResult['clientOnlyComponents'];
		scripts: TransformResult['scripts'];
	};
}
