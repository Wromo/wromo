import { defineConfig } from 'wromo/config';

// https://wromo.build/config
export default defineConfig({
	// Enable Custom Markdown options, plugins, etc.
	markdown: {
		syntaxHighlight: 'shiki',
		shikiConfig: {
			theme: 'dracula',
			// Learn more about this configuration here:
			// https://docs.wromo.build/en/guides/markdown-content/#syntax-highlighting
		},
	},
});
