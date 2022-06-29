import { expect } from '@playwright/test';
import os from 'os';
import { testFactory } from './test-utils.js';

const test = testFactory({ root: './fixtures/wromo-component/' });

let devServer;

test.beforeEach(async ({ wromo }) => {
	devServer = await wromo.startDevServer();
});

test.afterEach(async () => {
	await devServer.stop();
});

test.describe('Wromo component HMR', () => {
	test('component styles', async ({ page, wromo }) => {
		await page.goto(wromo.resolveUrl('/'));

		const hero = page.locator('section');
		await expect(hero, 'hero has background: white').toHaveCSS(
			'background-color',
			'rgb(255, 255, 255)'
		);
		await expect(hero, 'hero has color: black').toHaveCSS('color', 'rgb(0, 0, 0)');

		// Edit the Hero component with a new background color
		await wromo.editFile('./src/components/Hero.wromo', (content) =>
			content.replace('background: white', 'background: rgb(230, 230, 230)')
		);

		await expect(hero, 'background color updated').toHaveCSS(
			'background-color',
			'rgb(230, 230, 230)'
		);
	});

	// TODO: Re-enable this test on windows when #3424 is fixed
	// https://github.com/Wromo/wromo/issues/3424
	const it = os.platform() === 'win32' ? test.skip : test;
	it('hoisted scripts', async ({ page, wromo }) => {
		const initialLog = page.waitForEvent(
			'console',
			(message) => message.text() === 'Hello, Wromo!'
		);

		await page.goto(wromo.resolveUrl('/'));
		await initialLog;

		const updatedLog = page.waitForEvent(
			'console',
			(message) => message.text() === 'Hello, updated Wromo!'
		);

		// Edit the hoisted script on the page
		await wromo.editFile('./src/pages/index.wromo', (content) =>
			content.replace('Hello, Wromo!', 'Hello, updated Wromo!')
		);

		await updatedLog;
	});
});
