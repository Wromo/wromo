import { defineConfig } from 'wromo/config';
import addClasses from './add-classes.mjs';

// https://wromo.build/config
export default defineConfig({
	// Enable Custom Markdown options, plugins, etc.
	markdown: {
		remarkPlugins: ['remark-code-titles'],
		rehypePlugins: [
			'rehype-slug',
			['rehype-autolink-headings', { behavior: 'prepend' }],
			['rehype-toc', { headings: ['h2', 'h3'] }],
			[addClasses, { 'h1,h2,h3': 'title' }],
		],
	},
});
