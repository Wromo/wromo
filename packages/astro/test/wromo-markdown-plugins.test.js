import { expect } from 'chai';
import * as cheerio from 'cheerio';
import { loadFixture } from './test-utils.js';
import addClasses from './fixtures/wromo-markdown-plugins/add-classes.mjs';

describe('Wromo Markdown plugins', () => {
	let fixture;

	before(async () => {
		fixture = await loadFixture({
			root: './fixtures/wromo-markdown-plugins/',
			markdown: {
				remarkPlugins: [
					'remark-code-titles',
					['rehype-autolink-headings', { behavior: 'prepend' }],
				],
				rehypePlugins: [
					'rehype-slug',
					['rehype-toc', { headings: ['h2', 'h3'] }],
					[addClasses, { 'h1,h2,h3': 'title' }],
				],
			},
		});
		await fixture.build();
	});

	it('Can render markdown with plugins', async () => {
		const html = await fixture.readFile('/index.html');
		const $ = cheerio.load(html);

		// test 1: Added a TOC
		expect($('.toc')).to.have.lengthOf(1);

		// teste 2: Added .title to h1
		expect($('#hello-world').hasClass('title')).to.equal(true);
	});

	it('Can render Wromo <Markdown> with plugins', async () => {
		const html = await fixture.readFile('/wromo/index.html');
		const $ = cheerio.load(html);

		// test 1: Added a TOC
		expect($('.toc')).to.have.lengthOf(1);

		// teste 2: Added .title to h1
		expect($('#hello-world').hasClass('title')).to.equal(true);
	});
});
