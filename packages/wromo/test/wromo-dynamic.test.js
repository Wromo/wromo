import { expect } from 'chai';
import * as cheerio from 'cheerio';
import { loadFixture } from './test-utils.js';

describe('Dynamic components', () => {
	let fixture;

	before(async () => {
		fixture = await loadFixture({
			root: './fixtures/wromo-dynamic/',
		});
		await fixture.build();
	});

	it('Loads packages that only run code in client', async () => {
		const html = await fixture.readFile('/index.html');

		const $ = cheerio.load(html);
		expect($('script').length).to.eq(1);
	});

	it('Loads pages using client:media hydrator', async () => {
		const root = new URL('http://example.com/media/index.html');
		const html = await fixture.readFile('/media/index.html');
		const $ = cheerio.load(html);

		// test 1: static value rendered
		expect($('script').length).to.equal(1);
	});

	it('Loads pages using client:only hydrator', async () => {
		const html = await fixture.readFile('/client-only/index.html');
		const $ = cheerio.load(html);

		// test 1: <wromo-island> is empty.
		expect($('wromo-island').html()).to.equal('');
		// test 2: component url
		const href = $('wromo-island').attr('component-url');
		expect(href).to.include(`/PersistentCounter`);
	});
});

describe('Dynamic components subpath', () => {
	let fixture;

	before(async () => {
		fixture = await loadFixture({
			site: 'https://site.com',
			base: '/blog',
			root: './fixtures/wromo-dynamic/',
		});
		await fixture.build();
	});

	it('Loads packages that only run code in client', async () => {
		const html = await fixture.readFile('/index.html');

		const $ = cheerio.load(html);
		expect($('script').length).to.eq(1);
	});

	it('Loads pages using client:media hydrator', async () => {
		const html = await fixture.readFile('/media/index.html');
		const $ = cheerio.load(html);

		// test 1: static value rendered
		expect($('script').length).to.equal(1);
	});

	it('Loads pages using client:only hydrator', async () => {
		const html = await fixture.readFile('/client-only/index.html');
		const $ = cheerio.load(html);

		// test 1: <wromo-island> is empty.
		expect($('wromo-island').html()).to.equal('');
		// test 2: has component url
		const attr = $('wromo-island').attr('component-url');
		expect(attr).to.include(`blog/PersistentCounter`);
	});
});
