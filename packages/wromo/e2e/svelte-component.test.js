import { prepareTestFactory } from './shared-component-tests.js';

const { test, createTests } = prepareTestFactory({ root: './fixtures/svelte-component/' });

test.describe('Svelte components in Wromo files', () => {
	createTests({
		pageUrl: '/',
		pageSourceFilePath: './src/pages/index.wromo',
		componentFilePath: './src/components/SvelteComponent.svelte',
		counterCssFilePath: './src/components/Counter.svelte',
	});
});

test.describe('Svelte components in Markdown files', () => {
	createTests({
		pageUrl: '/markdown/',
		pageSourceFilePath: './src/pages/markdown.md',
		componentFilePath: './src/components/SvelteComponent.svelte',
		counterCssFilePath: './src/components/Counter.svelte',
	});
});
