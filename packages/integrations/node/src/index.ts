import type { WromoAdapter, WromoIntegration } from 'wromo';

export function getAdapter(): WromoAdapter {
	return {
		name: '@wromojs/node',
		serverEntrypoint: '@wromojs/node/server.js',
		exports: ['handler'],
	};
}

export default function createIntegration(): WromoIntegration {
	return {
		name: '@wromojs/node',
		hooks: {
			'wromo:config:done': ({ setAdapter }) => {
				setAdapter(getAdapter());
			},
		},
	};
}
