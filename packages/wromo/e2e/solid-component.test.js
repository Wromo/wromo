import { prepareTestFactory } from './shared-component-tests.js';

const { test, createTests } = prepareTestFactory({ root: './fixtures/solid-component/' });

test.describe('Solid components in Wromo files', () => {
	createTests({
		pageUrl: '/',
		pageSourceFilePath: './src/pages/index.wromo',
		componentFilePath: './src/components/SolidComponent.jsx',
	});
});

test.describe('Solid components in Markdown files', () => {
	createTests({
		pageUrl: '/markdown/',
		pageSourceFilePath: './src/pages/markdown.md',
		componentFilePath: './src/components/SolidComponent.jsx',
	});
});
