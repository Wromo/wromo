import { expect } from 'chai';
import { load as cheerioLoad } from 'cheerio';
import { loadFixture } from './test-utils.js';

describe('Client only components', () => {
	let fixture;

	before(async () => {
		fixture = await loadFixture({
			root: './fixtures/wromo-client-only/',
		});
		await fixture.build();
	});

	it('Loads pages using client:only hydrator', async () => {
		const html = await fixture.readFile('/index.html');
		const $ = cheerioLoad(html);

		// test 1: <wromo-island> is empty
		expect($('wromo-island').html()).to.equal('');

		// test 2: svelte renderer is on the page
		expect($('wromo-island').attr('renderer-url')).to.be.ok;
	});

	it('Adds the CSS to the page', async () => {
		const html = await fixture.readFile('/index.html');
		const $ = cheerioLoad(html);

		const href = $('link[rel=stylesheet]').attr('href');
		const css = await fixture.readFile(href);

		expect(css).to.match(/yellowgreen/, 'Svelte styles are added');
		expect(css).to.match(/Courier New/, 'Global styles are added');
	});
});

describe('Client only components subpath', () => {
	let fixture;

	before(async () => {
		fixture = await loadFixture({
			site: 'https://site.com',
			base: '/blog',
			root: './fixtures/wromo-client-only/',
		});
		await fixture.build();
	});

	it('Loads pages using client:only hydrator', async () => {
		const html = await fixture.readFile('/index.html');
		const $ = cheerioLoad(html);

		// test 1: <wromo-island> is empty
		expect($('wromo-island').html()).to.equal('');

		// test 2: svelte renderer is on the page
		expect($('wromo-island').attr('renderer-url')).to.be.ok;
	});

	it('Adds the CSS to the page', async () => {
		const html = await fixture.readFile('/index.html');
		const $ = cheerioLoad(html);

		const href = $('link[rel=stylesheet]').attr('href');
		const css = await fixture.readFile(href.replace(/\/blog/, ''));

		expect(css).to.match(/yellowgreen/, 'Svelte styles are added');
		expect(css).to.match(/Courier New/, 'Global styles are added');
	});
});
