import type { GetHydrateCallback, HydrateOptions } from '../../@types/wromo';

type DirectiveLoader = (get: GetHydrateCallback, opts: HydrateOptions, root: HTMLElement) => void;

declare global {
	interface Window {
		Wromo: {
			idle: DirectiveLoader;
			load: DirectiveLoader;
			media: DirectiveLoader;
			only: DirectiveLoader;
			visible: DirectiveLoader;
		};
	}
}

export {};
