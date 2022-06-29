import { expect } from 'chai';
import { load as cheerioLoad } from 'cheerio';
import path from 'path';
import { loadFixture } from './test-utils.js';

let fixture;

const routes = [
	{
		url: '/',
		h1: 'index.wromo',
	},
	{
		url: '/posts/post-1',
		h1: 'posts/[pid].wromo',
		p: 'post-1',
	},
	{
		url: '/posts/post-2',
		h1: 'posts/[pid].wromo',
		p: 'post-2',
	},
	{
		url: '/posts/1/2',
		h1: 'posts/[...slug].wromo',
		p: '1/2',
	},
	{
		url: '/de',
		h1: 'de/index.wromo',
	},
	{
		url: '/de/',
		h1: 'de/index.wromo',
	},
	{
		url: '/de/index.html',
		h1: 'de/index.wromo',
	},
	{
		url: '/en',
		h1: '[lang]/index.wromo',
		p: 'en',
	},
	{
		url: '/en/',
		h1: '[lang]/index.wromo',
		p: 'en',
	},
	{
		url: '/en/index.html',
		h1: '[lang]/index.wromo',
		p: 'en',
	},
	{
		url: '/de/1/2',
		h1: '[lang]/[...catchall].wromo',
		p: 'de | 1/2',
	},
	{
		url: '/en/1/2',
		h1: '[lang]/[...catchall].wromo',
		p: 'en | 1/2',
	},
];

describe('Routing priority', () => {
	before(async () => {
		fixture = await loadFixture({
			root: './fixtures/routing-priority/',
		});
	});

	describe('build', () => {
		before(async () => {
			await fixture.build();
		});

		it('matches / to index.wromo', async () => {
			const html = await fixture.readFile('/index.html');
			const $ = cheerioLoad(html);

			expect($('h1').text()).to.equal('index.wromo');
		});

		it('matches /posts/post-1 to posts/[pid].wromo', async () => {
			const html = await fixture.readFile('/posts/post-1/index.html');
			const $ = cheerioLoad(html);

			expect($('h1').text()).to.equal('posts/[pid].wromo');
			expect($('p').text()).to.equal('post-1');
		});

		it('matches /posts/1/2 to posts/[...slug].wromo', async () => {
			const html = await fixture.readFile('/posts/1/2/index.html');
			const $ = cheerioLoad(html);

			expect($('h1').text()).to.equal('posts/[...slug].wromo');
			expect($('p').text()).to.equal('1/2');
		});

		it('matches /de to de/index.wromo', async () => {
			const html = await fixture.readFile('/de/index.html');
			const $ = cheerioLoad(html);

			expect($('h1').text()).to.equal('de/index.wromo');
		});

		it('matches /en to [lang]/index.wromo', async () => {
			const html = await fixture.readFile('/en/index.html');
			const $ = cheerioLoad(html);

			expect($('h1').text()).to.equal('[lang]/index.wromo');
			expect($('p').text()).to.equal('en');
		});

		it('matches /de/1/2 to [lang]/[...catchall].wromo', async () => {
			const html = await fixture.readFile('/de/1/2/index.html');
			const $ = cheerioLoad(html);

			expect($('h1').text()).to.equal('[lang]/[...catchall].wromo');
			expect($('p').text()).to.equal('de | 1/2');
		});

		it('matches /en/1/2 to [lang]/[...catchall].wromo', async () => {
			const html = await fixture.readFile('/en/1/2/index.html');
			const $ = cheerioLoad(html);

			expect($('h1').text()).to.equal('[lang]/[...catchall].wromo');
			expect($('p').text()).to.equal('en | 1/2');
		});
	});

	describe('dev', () => {
		let devServer;

		before(async () => {
			devServer = await fixture.startDevServer();
		});

		after(async () => {
			await devServer.stop();
		});

		it('matches / to index.wromo', async () => {
			const html = await fixture.fetch('/').then((res) => res.text());
			const $ = cheerioLoad(html);

			expect($('h1').text()).to.equal('index.wromo');
		});

		it('matches /posts/post-1 to /posts/[pid].wromo', async () => {
			const html = await fixture.fetch('/posts/post-1').then((res) => res.text());
			const $ = cheerioLoad(html);

			expect($('h1').text()).to.equal('posts/[pid].wromo');
			expect($('p').text()).to.equal('post-1');
		});

		it('matches /posts/1/2 to /posts/[...slug].wromo', async () => {
			const html = await fixture.fetch('/posts/1/2').then((res) => res.text());
			const $ = cheerioLoad(html);

			expect($('h1').text()).to.equal('posts/[...slug].wromo');
			expect($('p').text()).to.equal('1/2');
		});

		it('matches /de to de/index.wromo', async () => {
			const html = await fixture.fetch('/de').then((res) => res.text());
			const $ = cheerioLoad(html);

			expect($('h1').text()).to.equal('de/index.wromo');
		});

		it('matches /de to de/index.wromo', async () => {
			const html = await fixture.fetch('/de').then((res) => res.text());
			const $ = cheerioLoad(html);

			expect($('h1').text()).to.equal('de/index.wromo');
		});

		it('matches /de/ to de/index.wromo', async () => {
			const html = await fixture.fetch('/de/').then((res) => res.text());
			const $ = cheerioLoad(html);

			expect($('h1').text()).to.equal('de/index.wromo');
		});

		it('matches /de/index.html to de/index.wromo', async () => {
			const html = await fixture.fetch('/de/index.html').then((res) => res.text());
			const $ = cheerioLoad(html);

			expect($('h1').text()).to.equal('de/index.wromo');
		});

		it('matches /en to [lang]/index.wromo', async () => {
			const html = await fixture.fetch('/en').then((res) => res.text());
			const $ = cheerioLoad(html);

			expect($('h1').text()).to.equal('[lang]/index.wromo');
			expect($('p').text()).to.equal('en');
		});

		it('matches /en/ to [lang]/index.wromo', async () => {
			const html = await fixture.fetch('/en/').then((res) => res.text());
			const $ = cheerioLoad(html);

			expect($('h1').text()).to.equal('[lang]/index.wromo');
			expect($('p').text()).to.equal('en');
		});

		it('matches /en/index.html to de/index.wromo', async () => {
			const html = await fixture.fetch('/en/index.html').then((res) => res.text());
			const $ = cheerioLoad(html);

			expect($('h1').text()).to.equal('[lang]/index.wromo');
			expect($('p').text()).to.equal('en');
		});

		it('matches /de/1/2 to [lang]/[...catchall].wromo', async () => {
			const html = await fixture.fetch('/de/1/2/index.html').then((res) => res.text());
			const $ = cheerioLoad(html);

			expect($('h1').text()).to.equal('[lang]/[...catchall].wromo');
			expect($('p').text()).to.equal('de | 1/2');
		});

		it('matches /en/1/2 to [lang]/[...catchall].wromo', async () => {
			const html = await fixture.fetch('/en/1/2/index.html').then((res) => res.text());
			const $ = cheerioLoad(html);

			expect($('h1').text()).to.equal('[lang]/[...catchall].wromo');
			expect($('p').text()).to.equal('en | 1/2');
		});
	});
});
