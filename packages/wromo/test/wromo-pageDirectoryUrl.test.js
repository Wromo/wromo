import { expect } from 'chai';
import { loadFixture } from './test-utils.js';

describe('build format', () => {
	let fixture;

	before(async () => {
		fixture = await loadFixture({
			root: './fixtures/wromo-page-directory-url',
			build: {
				format: 'file',
			},
		});
		await fixture.build();
	});

	it('outputs', async () => {
		expect(await fixture.readFile('/client.html')).to.be.ok;
		expect(await fixture.readFile('/nested-md.html')).to.be.ok;
		expect(await fixture.readFile('/nested-wromo.html')).to.be.ok;
	});
});
