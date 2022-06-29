import { expect } from 'chai';
import * as cheerio from 'cheerio';
import { loadFixture } from './test-utils.js';

describe('Global Fetch', () => {
	let fixture;

	before(async () => {
		fixture = await loadFixture({ root: './fixtures/fetch/' });
		await fixture.build();
	});

	it('Is available in Wromo pages', async () => {
		const html = await fixture.readFile('/index.html');
		const $ = cheerio.load(html);
		expect($('#wromo-page').text()).to.equal('function', 'Fetch supported in .wromo page');
	});
	it('Is available in Wromo components', async () => {
		const html = await fixture.readFile('/index.html');
		const $ = cheerio.load(html);
		expect($('#wromo-component').text()).to.equal(
			'function',
			'Fetch supported in .wromo components'
		);
	});
	it('Is available in non-Wromo components', async () => {
		const html = await fixture.readFile('/index.html');
		const $ = cheerio.load(html);
		expect($('#jsx').text()).to.equal('function', 'Fetch supported in .jsx');
		expect($('#svelte').text()).to.equal('function', 'Fetch supported in .svelte');
		expect($('#vue').text()).to.equal('function', 'Fetch supported in .vue');
	});
	it('Respects existing code', async () => {
		const html = await fixture.readFile('/index.html');
		const $ = cheerio.load(html);
		expect($('#already-imported').text()).to.equal('function', 'Existing fetch imports respected');
		expect($('#custom-declaration').text()).to.equal(
			'number',
			'Custom fetch declarations respected'
		);
	});
});
