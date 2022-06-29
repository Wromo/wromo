import { expect } from '@playwright/test';
import { testFactory } from './test-utils.js';

const test = testFactory({ root: './fixtures/ts-resolution/' });

function runTest(it) {
	it('client:idle', async ({ page, wromo }) => {
		await page.goto(wromo.resolveUrl('/'));

		const counter = page.locator('#client-idle');
		await expect(counter, 'component is visible').toBeVisible();

		const count = counter.locator('pre');
		await expect(count, 'initial count is 0').toHaveText('0');

		const inc = counter.locator('.increment');
		await inc.click();

		await expect(count, 'count incremented by 1').toHaveText('1');
	});
}

test.describe('TypeScript resolution -', () => {
	test.describe('Development', () => {
		const t = test.extend({});

		let devServer;

		t.beforeEach(async ({ wromo }) => {
			devServer = await wromo.startDevServer();
		});

		t.afterEach(async () => {
			await devServer.stop();
		});

		runTest(t);
	});

	test.describe('Production', () => {
		const t = test.extend({});

		let previewServer;

		t.beforeAll(async ({ wromo }) => {
			await wromo.build();
		});

		t.beforeEach(async ({ wromo }) => {
			previewServer = await wromo.preview();
		});

		t.afterEach(async () => {
			await previewServer.stop();
		});

		runTest(t);
	});
});
