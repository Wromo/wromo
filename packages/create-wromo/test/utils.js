import { execa } from 'execa';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
export const testDir = dirname(__filename);
export const timeout = 5000;

const createWromoError = new Error(
	'Timed out waiting for create-wromo to respond with expected output.'
);

export function promiseWithTimeout(testFn) {
	return new Promise((resolve, reject) => {
		const timeoutEvent = setTimeout(() => {
			reject(createWromoError);
		}, timeout);
		function resolver() {
			clearTimeout(timeoutEvent);
			resolve();
		}
		testFn(resolver);
	});
}

export const PROMPT_MESSAGES = {
	directory: 'Where would you like to create your app?',
	template: 'Which app template would you like to use?',
	install: (pkgManager) => `Would you like us to run "${pkgManager} install?"`,
	wromoAdd: (wromoAddCommand = 'npx wromo@latest add --yes') =>
		`Run "${wromoAddCommand}?" This lets you optionally add component frameworks (ex. React), CSS frameworks (ex. Tailwind), and more.`,
	git: 'Initialize a git repository?',
};

export function setup(args = []) {
	const { stdout, stdin } = execa('../create-wromo.mjs', [...args, '--dryrun'], { cwd: testDir });
	return {
		stdin,
		stdout,
	};
}
