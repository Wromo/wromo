import { expect } from '@playwright/test';
import { testFactory } from './test-utils.js';

const test = testFactory({ root: './fixtures/nested-styles/' });

let devServer;

test.beforeEach(async ({ wromo }) => {
	devServer = await wromo.startDevServer();
});

test.afterEach(async () => {
	await devServer.stop();
});

test.describe('Loading styles that are nested', () => {
	test('header', async ({ page, wromo }) => {
		await page.goto(wromo.resolveUrl('/'));

		const header = page.locator('header');

		await expect(header, 'should have background color').toHaveCSS(
			'background-color',
			'rgb(0, 0, 139)' // darkblue
		);
	});
});
