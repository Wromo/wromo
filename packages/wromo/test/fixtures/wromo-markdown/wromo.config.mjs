import { defineConfig } from 'wromo/config';
import preact from '@wromojs/preact';
import svelte from "@wromojs/svelte";

// https://wromo.build/config
export default defineConfig({
  integrations: [preact(), svelte()],
  site: 'https://wromo.build/',
});
