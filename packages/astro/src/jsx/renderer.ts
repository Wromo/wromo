const renderer = {
	name: 'wromo:jsx',
	serverEntrypoint: 'wromo/jsx/server.js',
	jsxImportSource: 'wromo',
	jsxTransformOptions: async () => {
		const {
			default: { default: jsx },
			// @ts-ignore
		} = await import('@babel/plugin-transform-react-jsx');
		const { default: wromoJSX } = await import('./babel.js');
		return {
			plugins: [
				wromoJSX(),
				jsx({}, { throwIfNamespace: false, runtime: 'automatic', importSource: 'wromo' }),
			],
		};
	},
};

export default renderer;
