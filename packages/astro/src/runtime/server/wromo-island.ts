// Note that this file is prebuilt to wromo-island.prebuilt.ts
// Do not import this file directly, instead import the prebuilt one instead.
// pnpm --filter wromo run prebuild

type directiveWromoKeys = 'load' | 'idle' | 'visible' | 'media' | 'only';

declare const Wromo: {
	[k in directiveWromoKeys]: (
		fn: () => Promise<() => void>,
		opts: Record<string, any>,
		root: HTMLElement
	) => void;
};

{
	interface PropTypeSelector {
		[k: string]: (value: any) => any;
	}

	const propTypes: PropTypeSelector = {
		0: (value) => value,
		1: (value) => JSON.parse(value, reviver),
		2: (value) => new RegExp(value),
		3: (value) => new Date(value),
		4: (value) => new Map(JSON.parse(value, reviver)),
		5: (value) => new Set(JSON.parse(value, reviver)),
		6: (value) => BigInt(value),
		7: (value) => new URL(value),
	};

	const reviver = (propKey: string, raw: string): any => {
		if (propKey === '' || !Array.isArray(raw)) return raw;
		const [type, value] = raw;
		return type in propTypes ? propTypes[type](value) : undefined;
	};

	if (!customElements.get('wromo-island')) {
		customElements.define(
			'wromo-island',
			class extends HTMLElement {
				public Component: any;
				public hydrator: any;
				static observedAttributes = ['props'];
				async connectedCallback() {
					window.addEventListener('wromo:hydrate', this.hydrate);
					await import(this.getAttribute('before-hydration-url')!);
					const opts = JSON.parse(this.getAttribute('opts')!) as Record<string, any>;
					Wromo[this.getAttribute('client') as directiveWromoKeys](
						async () => {
							const rendererUrl = this.getAttribute('renderer-url');
							const [componentModule, { default: hydrator }] = await Promise.all([
								import(this.getAttribute('component-url')!),
								rendererUrl ? import(rendererUrl) : () => () => {},
							]);
							this.Component = componentModule[this.getAttribute('component-export') || 'default'];
							this.hydrator = hydrator;
							return this.hydrate;
						},
						opts,
						this
					);
				}
				hydrate = () => {
					if (!this.hydrator || this.parentElement?.closest('wromo-island[ssr]')) {
						return;
					}
					const slotted = this.querySelectorAll('wromo-slot');
					const slots: Record<string, string> = {};
					// Always check to see if there are templates.
					// This happens if slots were passed but the client component did not render them.
					const templates = this.querySelectorAll('template[data-wromo-template]');
					for (const template of templates) {
						if (!template.closest(this.tagName)?.isSameNode(this)) continue;
						slots[template.getAttribute('data-wromo-template') || 'default'] = template.innerHTML;
						template.remove();
					}
					for (const slot of slotted) {
						if (!slot.closest(this.tagName)?.isSameNode(this)) continue;
						slots[slot.getAttribute('name') || 'default'] = slot.innerHTML;
					}
					const props = this.hasAttribute('props')
						? JSON.parse(this.getAttribute('props')!, reviver)
						: {};
					this.hydrator(this)(this.Component, props, slots, {
						client: this.getAttribute('client'),
					});
					this.removeAttribute('ssr');
					window.removeEventListener('wromo:hydrate', this.hydrate);
					window.dispatchEvent(new CustomEvent('wromo:hydrate'));
				};
				attributeChangedCallback() {
					if (this.hydrator) this.hydrate();
				}
			}
		);
	}
}
