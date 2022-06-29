import type { WromoAdapter, WromoIntegration } from '../@types/wromo';

export function getAdapter(): WromoAdapter {
	return {
		name: '@wromojs/ssg',
		// This one has no server entrypoint and is mostly just an integration
		//serverEntrypoint: '@wromojs/ssg/server.js',
	};
}

export default function createIntegration(): WromoIntegration {
	return {
		name: '@wromojs/ssg',
		hooks: {
			'wromo:config:done': ({ setAdapter }) => {
				setAdapter(getAdapter());
			},
			'wromo:build:start': ({ buildConfig }) => {
				buildConfig.staticMode = true;
			},
		},
	};
}
