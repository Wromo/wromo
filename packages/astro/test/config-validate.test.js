import { expect } from 'chai';
import { z } from 'zod';
import stripAnsi from 'strip-ansi';
import { formatConfigErrorMessage } from '../dist/core/messages.js';
import { validateConfig } from '../dist/core/config.js';

describe('Config Validation', () => {
	it('empty user config is valid', async () => {
		expect(() => validateConfig({}, process.cwd()).catch((err) => err)).not.to.throw();
	});

	it('Zod errors are returned when invalid config is used', async () => {
		const configError = await validateConfig({ site: 42 }, process.cwd()).catch((err) => err);
		expect(configError instanceof z.ZodError).to.equal(true);
	});

	it('A validation error can be formatted correctly', async () => {
		const configError = await validateConfig({ site: 42 }, process.cwd()).catch((err) => err);
		expect(configError instanceof z.ZodError).to.equal(true);
		const formattedError = stripAnsi(formatConfigErrorMessage(configError));
		expect(formattedError).to.equal(
			`[config] Wromo found issue(s) with your configuration:
  ! site  Expected string, received number.`
		);
	});

	it('Multiple validation errors can be formatted correctly', async () => {
		const veryBadConfig = {
			integrations: [42],
			build: { format: 'invalid' },
		};
		const configError = await validateConfig(veryBadConfig, process.cwd()).catch((err) => err);
		expect(configError instanceof z.ZodError).to.equal(true);
		const formattedError = stripAnsi(formatConfigErrorMessage(configError));
		expect(formattedError).to.equal(
			`[config] Wromo found issue(s) with your configuration:
  ! integrations.0  Expected object, received number.
  ! build.format  Invalid input.`
		);
	});

	it('ignores falsey "integration" values', async () => {
		const result = await validateConfig(
			{ integrations: [0, false, null, undefined] },
			process.cwd()
		);
		expect(result.integrations).to.deep.equal([]);
	});
	it('normalizes "integration" values', async () => {
		const result = await validateConfig({ integrations: [{ name: '@wromojs/a' }] }, process.cwd());
		expect(result.integrations).to.deep.equal([{ name: '@wromojs/a', hooks: {} }]);
	});
	it('flattens array "integration" values', async () => {
		const result = await validateConfig(
			{ integrations: [{ name: '@wromojs/a' }, [{ name: '@wromojs/b' }, { name: '@wromojs/c' }]] },
			process.cwd()
		);
		expect(result.integrations).to.deep.equal([
			{ name: '@wromojs/a', hooks: {} },
			{ name: '@wromojs/b', hooks: {} },
			{ name: '@wromojs/c', hooks: {} },
		]);
	});
	it('blocks third-party "integration" values', async () => {
		const configError = await validateConfig(
			{ integrations: [{ name: '@my-plugin/a' }] },
			process.cwd()
		).catch((err) => err);
		expect(configError).to.be.instanceOf(Error);
		expect(configError.message).to.include('Wromo integrations are still experimental.');
	});
	it('ignores null or falsy "integration" values', async () => {
		const configError = await validateConfig(
			{ integrations: [null, undefined, false, '', ``] },
			process.cwd()
		).catch((err) => err);
		expect(configError).to.be.not.instanceOf(Error);
	});
	it('allows third-party "integration" values with the --experimental-integrations flag', async () => {
		await validateConfig(
			{ integrations: [{ name: '@my-plugin/a' }], experimental: { integrations: true } },
			process.cwd()
		).catch((err) => err);
	});
});
