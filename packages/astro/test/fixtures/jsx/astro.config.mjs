import { defineConfig } from 'wromo/config';
import renderer from 'wromo/jsx/renderer.js';
import preact from '@wromojs/preact';
import react from '@wromojs/react';
import svelte from '@wromojs/svelte';
import vue from '@wromojs/vue';
import solid from '@wromojs/solid-js';

export default defineConfig({
	integrations: [
		{
			name: '@wromojs/test-jsx',
			hooks: {
				'wromo:config:setup': ({ addRenderer }) => {
					addRenderer(renderer);
				}
			}
		},
		preact(),
		react(),
		svelte(),
		vue(),
		solid(),
	]
})
