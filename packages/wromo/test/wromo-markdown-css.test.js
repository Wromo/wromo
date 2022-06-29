import { expect } from 'chai';
import * as cheerio from 'cheerio';
import { loadFixture } from './test-utils.js';

let fixture;
const IMPORTED_WROMO_COMPONENT_ID = 'imported-wromo-component';

describe('Imported markdown CSS', function () {
	before(async () => {
		fixture = await loadFixture({ root: './fixtures/wromo-markdown-css/' });
	});
	describe('build', () => {
		let $;
		let bundledCSS;

		before(async () => {
			this.timeout(45000); // test needs a little more time in CI
			await fixture.build();

			// get bundled CSS (will be hashed, hence DOM query)
			const html = await fixture.readFile('/index.html');
			$ = cheerio.load(html);
			const bundledCSSHREF = $('link[rel=stylesheet][href^=/assets/]').attr('href');
			bundledCSS = await fixture.readFile(bundledCSSHREF.replace(/^\/?/, '/'));
		});

		it('Compiles styles for Wromo components within imported markdown', () => {
			const importedWromoComponent = $(`#${IMPORTED_WROMO_COMPONENT_ID}`)?.[0];
			expect(importedWromoComponent?.name).to.equal('h2');
			const cssClass = $(importedWromoComponent).attr('class')?.split(/\s+/)?.[0];

			expect(bundledCSS).to.match(new RegExp(`h2.${cssClass}{color:#00f}`));
		});
	});
	describe('dev', () => {
		let devServer;
		let html;
		let $;

		before(async () => {
			devServer = await fixture.startDevServer();
			html = await fixture.fetch('/').then((res) => res.text());
			$ = cheerio.load(html);
		});

		after(async () => {
			await devServer.stop();
		});

		it('Compiles styles for Wromo components within imported markdown', async () => {
			const importedWromoComponent = $(`#${IMPORTED_WROMO_COMPONENT_ID}`)?.[0];
			expect(importedWromoComponent?.name).to.equal('h2');
			const cssClass = $(importedWromoComponent).attr('class')?.split(/\s+/)?.[0];

			const allInjectedStyles = $('style[data-wromo-injected]').text().replace(/\s*/g, '');
			expect(allInjectedStyles).to.match(new RegExp(`h2.${cssClass}{color:#00f}`));
		});
	});
});
