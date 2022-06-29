import type { WromoIntegration } from 'wromo';

export default function createPlugin(): WromoIntegration {
	return {
		name: '@wromojs/turbolinks',
		hooks: {
			'wromo:config:setup': ({ injectScript }) => {
				// This gets injected into the user's page, so we need to re-export Turbolinks
				// from our own package so that package managers like pnpm don't get mad and
				// can follow the import correctly.
				injectScript(
					'page',
					`import {Turbolinks} from "@wromojs/turbolinks/client.js"; Turbolinks.start();`
				);
			},
		},
	};
}
