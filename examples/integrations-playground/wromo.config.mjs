import { defineConfig } from 'wromo/config';
import lit from '@wromojs/lit';
import react from '@wromojs/react';
import tailwind from '@wromojs/tailwind';
import turbolinks from '@wromojs/turbolinks';
import sitemap from '@wromojs/sitemap';
import partytown from '@wromojs/partytown';
import solid from '@wromojs/solid-js';

// https://wromo.build/config
export default defineConfig({
	site: 'https://example.com',
	integrations: [lit(), react(), tailwind(), turbolinks(), partytown(), sitemap(), solid()],
});
