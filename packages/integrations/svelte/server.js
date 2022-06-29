function check(Component) {
	return Component['render'] && Component['$$render'];
}

async function renderToStaticMarkup(Component, props, slotted) {
	const slots = {};
	for (const [key, value] of Object.entries(slotted)) {
		slots[key] = () =>
			`<wromo-slot${key === 'default' ? '' : ` name="${key}"`}>${value}</wromo-slot>`;
	}
	const { html } = Component.render(props, { $$slots: slots });
	return { html };
}

export default {
	check,
	renderToStaticMarkup,
};
