// @ts-check
import { fileURLToPath } from 'url';

export * from '../../../../wromo/test/test-utils.js';

/**
 *
 * @returns {import('../../../../wromo/dist/types/@types/wromo').WromoIntegration}
 */
export function testIntegration() {
	return {
		name: '@wromojs/netlify/test-integration',
		hooks: {
			'wromo:config:setup': ({ updateConfig }) => {
				updateConfig({
					vite: {
						resolve: {
							alias: {
								'@wromojs/netlify/netlify-functions.js': fileURLToPath(
									new URL('../../dist/netlify-functions.js', import.meta.url)
								),
							},
						},
					},
				});
			},
		},
	};
}
