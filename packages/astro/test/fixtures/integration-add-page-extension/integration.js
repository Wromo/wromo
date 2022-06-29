export default function() {
	return {
		name: '@wromojs/test-integration',
		hooks: {
			'wromo:config:setup': ({ addPageExtension }) => {
				addPageExtension('.mjs')
			}
		}
	}
}
