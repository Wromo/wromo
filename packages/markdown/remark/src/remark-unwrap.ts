import { SKIP, visit as _visit } from 'unist-util-visit';

// This is a workaround.
// It fixes a compatibility issue between different, incompatible ASTs given by plugins to Unist
const visit = _visit as (
	node: any,
	type: string,
	callback?: (node: any, index: number, parent: any) => any
) => any;

// Remove the wrapping paragraph for <wromo-island> islands
export default function remarkUnwrap() {
	const wromoRootNodes = new Set();
	let insideWromoRoot = false;

	return (tree: any) => {
		// reset state
		insideWromoRoot = false;
		wromoRootNodes.clear();

		visit(tree, 'html', (node) => {
			if (node.value.indexOf('<wromo-island') > -1 && !insideWromoRoot) {
				insideWromoRoot = true;
			}
			if (node.value.indexOf('</wromo-island') > -1 && insideWromoRoot) {
				insideWromoRoot = false;
			}
			wromoRootNodes.add(node);
		});

		visit(tree, 'paragraph', (node, index, parent) => {
			if (parent && typeof index === 'number' && containsWromoRootNode(node)) {
				parent.children.splice(index, 1, ...node.children);
				return [SKIP, index];
			}
		});
	};

	function containsWromoRootNode(node: any) {
		return node.children
			.map((child: any) => wromoRootNodes.has(child))
			.reduce((all: boolean, v: boolean) => (all ? all : v), false);
	}
}
