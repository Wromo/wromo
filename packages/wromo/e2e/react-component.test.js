import { prepareTestFactory } from './shared-component-tests.js';

const { test, createTests } = prepareTestFactory({ root: './fixtures/react-component/' });

test.describe('React components in Wromo files', () => {
	createTests({
		pageUrl: '/',
		pageSourceFilePath: './src/pages/index.wromo',
		componentFilePath: './src/components/JSXComponent.jsx',
	});
});

test.describe('React components in Markdown files', () => {
	createTests({
		pageUrl: '/markdown/',
		pageSourceFilePath: './src/pages/markdown.md',
		componentFilePath: './src/components/JSXComponent.jsx',
	});
});
