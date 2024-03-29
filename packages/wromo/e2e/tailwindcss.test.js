import { expect } from '@playwright/test';
import { testFactory } from './test-utils.js';

const test = testFactory({ root: './fixtures/tailwindcss/' });

let devServer;

test.beforeEach(async ({ wromo }) => {
	devServer = await wromo.startDevServer();
});

test.afterEach(async ({ wromo }) => {
	await devServer.stop();
	wromo.resetAllFiles();
});

test.describe('Tailwind CSS', () => {
	test('body', async ({ page, wromo }) => {
		await page.goto(wromo.resolveUrl('/'));

		const body = page.locator('body');

		await expect(body, 'should have classes').toHaveClass('bg-dawn text-midnight');
		await expect(body, 'should have background color').toHaveCSS(
			'background-color',
			'rgb(243, 233, 250)'
		);
		await expect(body, 'should have color').toHaveCSS('color', 'rgb(49, 39, 74)');
	});

	test('button', async ({ page, wromo }) => {
		await page.goto(wromo.resolveUrl('/'));

		const button = page.locator('button');

		await expect(button, 'should have bg-purple-600').toHaveClass(/bg-purple-600/);
		await expect(button, 'should have background color').toHaveCSS(
			'background-color',
			'rgb(147, 51, 234)'
		);

		await expect(button, 'should have lg:py-3').toHaveClass(/lg:py-3/);
		await expect(button, 'should have padding bottom').toHaveCSS('padding-bottom', '12px');
		await expect(button, 'should have padding top').toHaveCSS('padding-top', '12px');

		await expect(button, 'should have font-[900]').toHaveClass(/font-\[900\]/);
		await expect(button, 'should have font weight').toHaveCSS('font-weight', '900');
	});

	test('HMR', async ({ page, wromo }) => {
		await page.goto(wromo.resolveUrl('/'));

		await wromo.editFile('./src/components/Button.wromo', (original) =>
			original.replace('bg-purple-600', 'bg-purple-400')
		);

		const button = page.locator('button');

		await expect(button, 'should have bg-purple-400').toHaveClass(/bg-purple-400/);
		await expect(button, 'should have background color').toHaveCSS(
			'background-color',
			'rgb(192, 132, 252)'
		);
	});
});
