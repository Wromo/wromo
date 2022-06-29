// TODO: unskip this test
// import { expect } from 'chai';
// import { fileURLToPath } from 'url';
// import { createRouteManifest } from '../dist/core/routing/index.js';
// import { validateConfig } from '../dist/core/config.js';

// const cwd = new URL('./fixtures/route-manifest/', import.meta.url);

// const create = async (dir, trailingSlash) => {
// 	return createRouteManifest({
// 		config: await validateConfig({
// 			root: cwd.pathname,
// 			trailingSlash,
// 		}),
// 		cwd: fileURLToPath(cwd),
// 	});
// };
// function cleanRoutes(routes) {
// 	return routes.map((r) => {
// 		delete r.generate;
// 		return r;
// 	});
// }

// describe('route manifest', () => {
// 	it('creates routes with trailingSlashes = always', async () => {
// 		const { routes } = await create('basic', 'always');
// 		expect(cleanRoutes(routes)).to.deep.equal([
// 			{
// 				type: 'page',
// 				pattern: /^\/$/,
// 				params: [],
// 				component: 'basic/index.wromo',
// 				pathname: '/',
// 			},

// 			{
// 				type: 'page',
// 				pattern: /^\/about\/$/,
// 				params: [],
// 				component: 'basic/about.wromo',
// 				pathname: '/about',
// 			},

// 			{
// 				type: 'page',
// 				pattern: /^\/blog\/$/,
// 				params: [],
// 				component: 'basic/blog/index.wromo',
// 				pathname: '/blog',
// 			},

// 			{
// 				type: 'page',
// 				pattern: /^\/blog\/([^/]+?)\/$/,
// 				params: ['slug'],
// 				component: 'basic/blog/[slug].wromo',
// 				pathname: undefined,
// 			},
// 		]);
// 	});

// 	it('creates routes with trailingSlashes = never', async () => {
// 		const { routes } = await create('basic', 'never');
// 		expect(cleanRoutes(routes)).to.deep.equal([
// 			{
// 				type: 'page',
// 				pattern: /^\/$/,
// 				params: [],
// 				component: 'basic/index.wromo',
// 				pathname: '/',
// 			},

// 			{
// 				type: 'page',
// 				pattern: /^\/about$/,
// 				params: [],
// 				component: 'basic/about.wromo',
// 				pathname: '/about',
// 			},

// 			{
// 				type: 'page',
// 				pattern: /^\/blog$/,
// 				params: [],
// 				component: 'basic/blog/index.wromo',
// 				pathname: '/blog',
// 			},

// 			{
// 				type: 'page',
// 				pattern: /^\/blog\/([^/]+?)$/,
// 				params: ['slug'],
// 				component: 'basic/blog/[slug].wromo',
// 				pathname: undefined,
// 			},
// 		]);
// 	});

// 	it('creates routes with trailingSlashes = ignore', async () => {
// 		const { routes } = await create('basic', 'ignore');
// 		expect(cleanRoutes(routes)).to.deep.equal([
// 			{
// 				type: 'page',
// 				pattern: /^\/$/,
// 				params: [],
// 				component: 'basic/index.wromo',
// 				pathname: '/',
// 			},

// 			{
// 				type: 'page',
// 				pattern: /^\/about\/?$/,
// 				params: [],
// 				component: 'basic/about.wromo',
// 				pathname: '/about',
// 			},

// 			{
// 				type: 'page',
// 				pattern: /^\/blog\/?$/,
// 				params: [],
// 				component: 'basic/blog/index.wromo',
// 				pathname: '/blog',
// 			},

// 			{
// 				type: 'page',
// 				pattern: /^\/blog\/([^/]+?)\/?$/,
// 				params: ['slug'],
// 				component: 'basic/blog/[slug].wromo',
// 				pathname: undefined,
// 			},
// 		]);
// 	});

// 	it('encodes invalid characters', async () => {
// 		const { routes } = await create('encoding', 'always');

// 		// had to remove ? and " because windows

// 		// const quote = 'encoding/".wromo';
// 		const hash = 'encoding/#.wromo';
// 		// const question_mark = 'encoding/?.wromo';

// 		expect(routes.map((p) => p.pattern)).to.deep.equal([
// 			// /^\/%22$/,
// 			/^\/%23\/$/,
// 			// /^\/%3F$/
// 		]);
// 	});

// 	it('ignores files and directories with leading underscores', async () => {
// 		const { routes } = await create('hidden-underscore', 'always');

// 		expect(routes.map((r) => r.component).filter(Boolean)).to.deep.equal(['hidden-underscore/index.wromo', 'hidden-underscore/e/f/g/h.wromo']);
// 	});

// 	it('ignores files and directories with leading dots except .well-known', async () => {
// 		const { routes } = await create('hidden-dot', 'always');

// 		expect(routes.map((r) => r.component).filter(Boolean)).to.deep.equal(['hidden-dot/.well-known/dnt-policy.wromo']);
// 	});

// 	it('fails if dynamic params are not separated', async () => {
// 		expect(() => await create('invalid-params', 'always')).to.throw('Invalid route invalid-params/[foo][bar].wromo — parameters must be separated');
// 	});

// 	it('disallows rest parameters inside segments', async () => {
// 		expect(() => await create('invalid-rest', 'always')).to.throw('Invalid route invalid-rest/foo-[...rest]-bar.wromo — rest parameter must be a standalone segment');
// 	});

// 	it('ignores things that look like lockfiles', async () => {
// 		const { routes } = await create('lockfiles', 'always');
// 		expect(cleanRoutes(routes)).to.deep.equal([
// 			{
// 				type: 'page',
// 				pattern: /^\/foo\/$/,
// 				params: [],
// 				component: 'lockfiles/foo.wromo',
// 				pathname: '/foo',
// 			},
// 		]);
// 	});

// 	it('ignores invalid route extensions', async () => {
// 		const { routes } = await create('invalid-extension', 'always');
// 		expect(cleanRoutes(routes)).to.deep.equal([
// 			{
// 				type: 'page',
// 				pattern: /^\/$/,
// 				params: [],
// 				component: 'invalid-extension/index.wromo',
// 				pathname: '/',
// 			},

// 			{
// 				type: 'page',
// 				pattern: /^\/about\/$/,
// 				params: [],
// 				component: 'invalid-extension/about.wromo',
// 				pathname: '/about',
// 			},
// 		]);
// 	});

// 	it('allows multiple slugs', async () => {
// 		const { routes } = await create('multiple-slugs', 'always');

// 		expect(cleanRoutes(routes)).to.deep.equal([
// 			{
// 				type: 'page',
// 				pattern: /^\/([^/]+?)\.([^/]+?)\/$/,
// 				component: 'multiple-slugs/[file].[ext].wromo',
// 				params: ['file', 'ext'],
// 				pathname: undefined,
// 			},
// 		]);
// 	});

// 	it('sorts routes correctly', async () => {
// 		const { routes } = await create('sorting', 'always');

// 		expect(routes.map((p) => p.component)).to.deep.equal([
// 			'sorting/index.wromo',
// 			'sorting/about.wromo',
// 			'sorting/post/index.wromo',
// 			'sorting/post/bar.wromo',
// 			'sorting/post/foo.wromo',
// 			'sorting/post/f[xx].wromo',
// 			'sorting/post/f[yy].wromo',
// 			'sorting/post/[id].wromo',
// 			'sorting/[wildcard].wromo',
// 			'sorting/[...rest]/deep/[...deep_rest]/xyz.wromo',
// 			'sorting/[...rest]/deep/[...deep_rest]/index.wromo',
// 			'sorting/[...rest]/deep/index.wromo',
// 			'sorting/[...rest]/abc.wromo',
// 			'sorting/[...rest]/index.wromo',
// 		]);
// 	});
// });
