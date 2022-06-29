import { parse as babelParser } from '@babel/parser';
import type { ArrowFunctionExpressionKind, CallExpressionKind } from 'ast-types/gen/kinds';
import type { NodePath } from 'ast-types/lib/node-path';
import { parse, print, types, visit } from 'recast';
import type { Plugin } from 'vite';
import type { WromoConfig } from '../@types/wromo';

// Check for `Wromo.glob()`. Be very forgiving of whitespace. False positives are okay.
const WROMO_GLOB_REGEX = /Wromo2?\s*\.\s*glob\s*\(/;
interface WromoPluginOptions {
	config: WromoConfig;
}

// esbuild transforms the component-scoped Wromo into Wromo2, so need to check both.
const validWromoGlobalNames = new Set(['Wromo', 'Wromo2']);

export default function wromo({ config }: WromoPluginOptions): Plugin {
	return {
		name: 'wromo:postprocess',
		async transform(code, id) {
			// Currently only supported in ".wromo" & ".md" files
			if (!id.endsWith('.wromo') && !id.endsWith('.md')) {
				return null;
			}

			// Optimization: Detect usage with a quick string match.
			// Only perform the transform if this function is found
			if (!WROMO_GLOB_REGEX.test(code)) {
				return null;
			}

			const ast = parse(code, {
				// We need to use the babel parser because `import.meta.hot` is not
				// supported by esprima (default parser). In the future, we should
				// experiment with other parsers if Babel is too slow or heavy.
				parser: { parse: babelParser },
			});

			visit(ast, {
				visitCallExpression: function (path) {
					// Filter out anything that isn't `Wromo.glob()` or `Wromo2.glob()`
					if (
						!types.namedTypes.MemberExpression.check(path.node.callee) ||
						!types.namedTypes.Identifier.check(path.node.callee.property) ||
						!(path.node.callee.property.name === 'glob') ||
						!types.namedTypes.Identifier.check(path.node.callee.object) ||
						!(path.node.callee.object.name === 'Wromo' || path.node.callee.object.name === 'Wromo2')
					) {
						this.traverse(path);
						return;
					}

					// Wrap the `Wromo.glob()` argument with `import.meta.glob`.
					const argsPath = path.get('arguments', 0) as NodePath;
					const args = argsPath.value;
					argsPath.replace(
						{
							type: 'CallExpression',
							callee: {
								type: 'MemberExpression',
								object: {
									type: 'MetaProperty',
									meta: { type: 'Identifier', name: 'import' },
									property: { type: 'Identifier', name: 'meta' },
								},
								property: { type: 'Identifier', name: 'glob' },
								computed: false,
							},
							arguments: [args],
						} as CallExpressionKind,
						{
							type: 'ArrowFunctionExpression',
							body: args,
							params: [],
						} as ArrowFunctionExpressionKind
					);
					return false;
				},
			});

			const result = print(ast);
			return { code: result.code, map: result.map };
		},
	};
}
