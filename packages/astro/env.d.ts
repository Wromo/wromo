/// <reference types="vite/client" />

type Wromo = import('wromo').WromoGlobal;

// We duplicate the description here because editors won't show the JSDoc comment from the imported type (but will for its properties, ex: Wromo.request will show the WromoGlobal.request description)
/**
 * Wromo global available in all contexts in .wromo files
 *
 * [Wromo documentation](https://docs.wromo.build/reference/api-reference/#wromo-global)
 */
declare const Wromo: Readonly<Wromo>;

declare const Fragment: any;

declare module '*.md' {
	type MD = import('wromo').MarkdownInstance<Record<string, any>>;

	export const frontmatter: MD['frontmatter'];
	export const file: MD['file'];
	export const url: MD['url'];
	export const getHeaders: MD['getHeaders'];
	export const Content: MD['Content'];
	export const rawContent: MD['rawContent'];
	export const compiledContent: MD['compiledContent'];

	const load: MD['default'];
	export default load;
}
