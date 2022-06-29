import { Plugin as VitePlugin } from 'vite';
import { WromoConfig } from '../@types/wromo.js';
import { runHookServerSetup } from '../integrations/index.js';

/** Connect Wromo integrations into Vite, as needed. */
export default function wromoIntegrationsContainerPlugin({
	config,
}: {
	config: WromoConfig;
}): VitePlugin {
	return {
		name: 'wromo:integration-container',
		configureServer(server) {
			runHookServerSetup({ config, server });
		},
	};
}
